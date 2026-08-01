#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd -P)"
MATRIX_FILE="$REPO_ROOT/tests/spike1.matrix.json"
ROWS_DIR="$REPO_ROOT/receipts/spike1-rows"
FAILURES_DIR="$ROWS_DIR/failures"
PROGRESS_FILE="$ROWS_DIR/progress.json"
PORT=4310

ROW_TIMEOUT_SECONDS=300
RETRIES=1
DRY_RUN=0
FORCE=0
SELECTED_ROW=""

SERVER_PID=""
CURRENT_CHILD_PID=""
RUN_TMP=""
VALID_IDS_FILE=""
FAILED_IDS_FILE=""
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)-$$"

usage() {
  cat <<'EOF'
Usage: ./scripts/run-spike1-resumable.sh [options]

Options:
  --dry-run              Enumerate and validate only; start no server/browser.
  --row ID               Run or resume one authoritative matrix row.
  --force                Remeasure the selected row even when its receipt is valid.
  --timeout-seconds N    Per-row child timeout (default: 300).
  --retries N            Retries after the first attempt (default: 1).
  -h, --help             Show this help.
EOF
}

fail() {
  printf 'ERROR: %s\n' "$1" >&2
  exit 2
}

is_nonnegative_integer() {
  [[ "$1" =~ ^[0-9]+$ ]]
}

is_positive_integer() {
  [[ "$1" =~ ^[1-9][0-9]*$ ]]
}

receipt_is_valid() {
  local id="$1"
  local row_file="$ROWS_DIR/$id.json"
  local screenshot_file="$ROWS_DIR/$id.png"

  node - "$MATRIX_FILE" "$row_file" "$screenshot_file" "$id" <<'NODE' >/dev/null 2>&1
const fs = require('node:fs')

const [matrixFile, rowFile, screenshotFile, id] = process.argv.slice(2)
const finite = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0
const sameFlatObject = (actual, expected) => {
  if (!actual || typeof actual !== 'object') return false
  const actualKeys = Object.keys(actual).sort()
  const expectedKeys = Object.keys(expected).sort()
  return (
    JSON.stringify(actualKeys) === JSON.stringify(expectedKeys) &&
    expectedKeys.every((key) => actual[key] === expected[key])
  )
}

try {
  const matrix = JSON.parse(fs.readFileSync(matrixFile, 'utf8'))
  const spec = matrix.find((entry) => entry.id === id)
  if (!spec) process.exit(1)

  const saved = JSON.parse(fs.readFileSync(rowFile, 'utf8'))
  const row = saved.row
  const raw = saved.raw
  const gpu = raw?.diagnostics?.gpu ?? ''
  const expectedScreenshot = `spike1-rows/${id}.png`
  const canonicalEnvelope = saved.schemaVersion === 1 && saved.screenshot === expectedScreenshot
  const legacyEnvelope = saved.schemaVersion === undefined && saved.screenshot === undefined
  const completedScreenshot = canonicalEnvelope
    ? screenshotFile
    : typeof spec.shot === 'string'
      ? require('node:path').resolve(require('node:path').dirname(require('node:path').dirname(rowFile)), `${spec.shot}.png`)
      : null
  const png = completedScreenshot ? fs.readFileSync(completedScreenshot) : null
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const requiredNumbers = [
    row?.gpuP95,
    row?.syncP95,
    row?.rafP95,
    row?.drawCalls,
    row?.sceneMemoryMb,
    raw?.frames?.gpuTimer?.p95,
    raw?.frames?.sync?.p95,
    raw?.frames?.raf?.p95,
    raw?.census?.drawCalls,
    raw?.census?.drawingBuffer?.width,
    raw?.census?.drawingBuffer?.height,
  ]
  const valid =
    (canonicalEnvelope || legacyEnvelope) &&
    row?.id === id &&
    row?.group === spec.group &&
    row?.note === spec.note &&
    raw?.id === id &&
    raw?.label === id &&
    sameFlatObject(raw?.params, spec.params) &&
    Array.isArray(row?.errors) &&
    row.errors.length === 0 &&
    Array.isArray(raw?.errors) &&
    raw.errors.length === 0 &&
    Array.isArray(raw?.consoleErrors) &&
    raw.consoleErrors.length === 0 &&
    raw?.diagnostics?.softwareRenderer === false &&
    /metal/i.test(gpu) &&
    !/swiftshader|software|llvmpipe/i.test(gpu) &&
    requiredNumbers.every(finite) &&
    (png === null ||
      (png.length > pngSignature.length && png.subarray(0, pngSignature.length).equals(pngSignature)))

  process.exit(valid ? 0 : 1)
} catch {
  process.exit(1)
}
NODE
}

owned_group_exists() {
  local pid="$1"
  local pgid
  pgid="$(ps -o pgid= -p "$pid" 2>/dev/null | tr -d ' ' || true)"
  [[ "$pgid" = "$pid" ]]
}

wait_for_owned_group() {
  local pid="$1"
  local count=0
  while (( count < 100 )); do
    owned_group_exists "$pid" && return 0
    kill -0 "$pid" 2>/dev/null || return 1
    sleep 0.02
    count=$((count + 1))
  done
  return 1
}

terminate_owned_group() {
  local pid="$1"
  [[ -n "$pid" ]] || return 0

  if owned_group_exists "$pid"; then
    kill -TERM -- "-$pid" 2>/dev/null || true
    local count=0
    while (( count < 20 )) && kill -0 "$pid" 2>/dev/null; do
      sleep 0.1
      count=$((count + 1))
    done
    if kill -0 "$pid" 2>/dev/null; then
      kill -KILL -- "-$pid" 2>/dev/null || true
    fi
  else
    kill -TERM "$pid" 2>/dev/null || true
  fi
  wait "$pid" 2>/dev/null || true
}

start_isolated() {
  /usr/bin/perl -MPOSIX=setsid -e 'setsid() or die "setsid failed: $!"; exec @ARGV or die "exec failed: $!"' -- "$@" &
}

run_bounded() {
  local timeout_seconds="$1"
  local log_file="$2"
  shift 2

  start_isolated "$@" >"$log_file" 2>&1
  local pid=$!
  CURRENT_CHILD_PID="$pid"
  wait_for_owned_group "$pid" || true

  local deadline=$((SECONDS + timeout_seconds))
  while kill -0 "$pid" 2>/dev/null; do
    if (( SECONDS >= deadline )); then
      terminate_owned_group "$pid"
      CURRENT_CHILD_PID=""
      return 124
    fi
    sleep 0.25
  done

  local status=0
  if wait "$pid"; then
    status=0
  else
    status=$?
  fi
  CURRENT_CHILD_PID=""
  return "$status"
}

append_unique() {
  local file="$1"
  local value="$2"
  if ! grep -Fxq "$value" "$file" 2>/dev/null; then
    printf '%s\n' "$value" >>"$file"
  fi
}

write_progress() {
  local last_id="$1"
  local last_status="$2"
  local scope="$3"

  node - "$MATRIX_FILE" "$VALID_IDS_FILE" "$FAILED_IDS_FILE" "$PROGRESS_FILE" "$last_id" "$last_status" "$scope" "$RUN_ID" <<'NODE'
const fs = require('node:fs')
const path = require('node:path')

const [matrixFile, validFile, failedFile, progressFile, lastId, lastStatus, scope, runId] = process.argv.slice(2)
const lines = (file) => fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
const matrixIds = JSON.parse(fs.readFileSync(matrixFile, 'utf8')).map((entry) => entry.id)
const completedIds = [...new Set(lines(validFile))].filter((id) => matrixIds.includes(id))
const failedIds = [...new Set(lines(failedFile))].filter((id) => matrixIds.includes(id) && !completedIds.includes(id))
const remainingIds = matrixIds.filter((id) => !completedIds.includes(id))
const doc = {
  schemaVersion: 1,
  runId,
  updatedAt: new Date().toISOString(),
  scope,
  lastRow: lastId || null,
  lastStatus: lastStatus || null,
  total: matrixIds.length,
  completed: completedIds.length,
  failed: failedIds.length,
  remaining: remainingIds.length,
  matrixIds,
  completedIds,
  failedIds,
  remainingIds,
}
fs.mkdirSync(path.dirname(progressFile), { recursive: true })
const temp = `${progressFile}.tmp-${process.pid}`
fs.writeFileSync(temp, JSON.stringify(doc, null, 2))
fs.renameSync(temp, progressFile)
NODE
}

print_progress() {
  local completed total failed remaining
  completed="$(node -p "require(process.argv[1]).completed" "$PROGRESS_FILE")"
  total="$(node -p "require(process.argv[1]).total" "$PROGRESS_FILE")"
  failed="$(node -p "require(process.argv[1]).failed" "$PROGRESS_FILE")"
  remaining="$(node -p "require(process.argv[1]).remaining" "$PROGRESS_FILE")"
  printf 'completed=%s total=%s failed=%s remaining=%s\n' "$completed" "$total" "$failed" "$remaining"
}

record_failure() {
  local id="$1"
  local attempt="$2"
  local outcome="$3"
  local exit_code="$4"
  local log_file="$5"
  local started_at="$6"
  local finished_at="$7"
  local json_file="$FAILURES_DIR/$RUN_ID-$id-attempt-$attempt.json"

  node - "$json_file" "$id" "$attempt" "$outcome" "$exit_code" "$log_file" "$started_at" "$finished_at" "$ROW_TIMEOUT_SECONDS" <<'NODE'
const fs = require('node:fs')
const path = require('node:path')
const [file, id, attempt, outcome, exitCode, logFile, startedAt, finishedAt, timeoutSeconds] = process.argv.slice(2)
const doc = {
  schemaVersion: 1,
  id,
  attempt: Number(attempt),
  outcome,
  exitCode: Number(exitCode),
  timeoutSeconds: Number(timeoutSeconds),
  startedAt,
  finishedAt,
  log: path.relative(process.cwd(), logFile),
}
const temp = `${file}.tmp-${process.pid}`
fs.writeFileSync(temp, JSON.stringify(doc, null, 2))
fs.renameSync(temp, file)
NODE
}

cleanup() {
  local status="${1:-$?}"
  trap - EXIT INT TERM
  [[ -z "$CURRENT_CHILD_PID" ]] || terminate_owned_group "$CURRENT_CHILD_PID"
  [[ -z "$SERVER_PID" ]] || terminate_owned_group "$SERVER_PID"
  [[ -z "$RUN_TMP" || ! -d "$RUN_TMP" ]] || rm -rf "$RUN_TMP"
  exit "$status"
}

parse_args() {
  while (( $# > 0 )); do
    case "$1" in
      --dry-run)
        DRY_RUN=1
        ;;
      --row)
        (( $# >= 2 )) || fail '--row requires an ID'
        SELECTED_ROW="$2"
        shift
        ;;
      --force)
        FORCE=1
        ;;
      --timeout-seconds)
        (( $# >= 2 )) || fail '--timeout-seconds requires an integer'
        ROW_TIMEOUT_SECONDS="$2"
        shift
        ;;
      --retries)
        (( $# >= 2 )) || fail '--retries requires an integer'
        RETRIES="$2"
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        fail "unknown option: $1"
        ;;
    esac
    shift
  done

  is_positive_integer "$ROW_TIMEOUT_SECONDS" || fail '--timeout-seconds must be positive'
  is_nonnegative_integer "$RETRIES" || fail '--retries must be zero or positive'
  (( FORCE == 0 )) || [[ -n "$SELECTED_ROW" ]] || fail '--force requires --row to prevent an accidental full rerun'
}

main() {
  parse_args "$@"

  [[ "$PWD" = "$REPO_ROOT" ]] || fail "run this script from the repository root: $REPO_ROOT"
  [[ -f "$REPO_ROOT/package.json" && -f "$MATRIX_FILE" ]] || fail 'repository markers are missing'
  command -v node >/dev/null 2>&1 || fail 'node is required'
  command -v npx >/dev/null 2>&1 || fail 'npx is required'
  command -v curl >/dev/null 2>&1 || fail 'curl is required'
  [[ -x /usr/bin/perl ]] || fail '/usr/bin/perl is required for isolated process groups'

  local matrix_count unique_count
  matrix_count="$(node -p "require(process.argv[1]).length" "$MATRIX_FILE")"
  unique_count="$(node - "$MATRIX_FILE" <<'NODE'
const matrix = require(process.argv[2])
process.stdout.write(String(new Set(matrix.map((entry) => entry.id)).size))
NODE
)"
  [[ "$matrix_count" = "27" && "$unique_count" = "$matrix_count" ]] || fail 'authoritative matrix must contain 27 unique rows'

  local matrix_ids=()
  while IFS= read -r id; do
    matrix_ids+=("$id")
  done < <(node - "$MATRIX_FILE" <<'NODE'
const matrix = require(process.argv[2])
for (const entry of matrix) console.log(entry.id)
NODE
)

  if [[ -n "$SELECTED_ROW" ]]; then
    local known=0
    local candidate
    for candidate in "${matrix_ids[@]}"; do
      [[ "$candidate" != "$SELECTED_ROW" ]] || known=1
    done
    (( known == 1 )) || fail "unknown matrix row: $SELECTED_ROW"
  fi

  mkdir -p "$ROWS_DIR" "$FAILURES_DIR"
  RUN_TMP="$(mktemp -d "${TMPDIR:-/tmp}/neuruh-spike1-runner.XXXXXX")"
  VALID_IDS_FILE="$RUN_TMP/valid-ids.txt"
  FAILED_IDS_FILE="$RUN_TMP/failed-ids.txt"
  : >"$VALID_IDS_FILE"
  : >"$FAILED_IDS_FILE"
  trap 'cleanup $?' EXIT
  trap 'exit 130' INT TERM

  local id
  for id in "${matrix_ids[@]}"; do
    if receipt_is_valid "$id"; then
      append_unique "$VALID_IDS_FILE" "$id"
    fi
  done

  local scope_label="full"
  local scope_ids=("${matrix_ids[@]}")
  if [[ -n "$SELECTED_ROW" ]]; then
    scope_label="row:$SELECTED_ROW"
    scope_ids=("$SELECTED_ROW")
    if (( FORCE == 1 )); then
      grep -Fvx "$SELECTED_ROW" "$VALID_IDS_FILE" >"$VALID_IDS_FILE.next" || true
      mv "$VALID_IDS_FILE.next" "$VALID_IDS_FILE"
    fi
  fi

  if (( DRY_RUN == 1 )); then
    local completed remaining
    completed="$(wc -l <"$VALID_IDS_FILE" | tr -d ' ')"
    remaining=$((matrix_count - completed))
    printf 'dry-run matrix=27 scope=%s completed=%s total=27 failed=0 remaining=%s\n' "$scope_label" "$completed" "$remaining"
    return 0
  fi

  local unresolved=0
  for id in "${scope_ids[@]}"; do
    if (( FORCE == 0 )) && receipt_is_valid "$id"; then
      write_progress "$id" 'skipped-valid' "$scope_label"
      print_progress
    else
      unresolved=$((unresolved + 1))
    fi
  done
  (( unresolved > 0 )) || return 0

  printf 'Building production application...\n'
  npm run build

  if /usr/sbin/lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    printf 'ERROR: port %s already has a listener; refusing to reuse or kill an unowned server.\n' "$PORT" >&2
    return 1
  fi

  local server_log="$RUN_TMP/server.log"
  start_isolated npm run start >"$server_log" 2>&1
  SERVER_PID=$!
  wait_for_owned_group "$SERVER_PID" || true

  local server_deadline=$((SECONDS + 90))
  while ! curl -fsS "http://127.0.0.1:$PORT/spike1?tier=0" >/dev/null 2>&1; do
    if ! kill -0 "$SERVER_PID" 2>/dev/null || (( SECONDS >= server_deadline )); then
      local retained_server_log="$FAILURES_DIR/$RUN_ID-server-startup.log"
      cp "$server_log" "$retained_server_log"
      printf 'ERROR: owned production server did not become ready. Log: %s\n' "$retained_server_log" >&2
      return 1
    fi
    sleep 0.5
  done

  local attempts=$((RETRIES + 1))
  local row_failed=0
  local attempt status outcome started_at finished_at attempt_log failure_log playwright_timeout_ms
  playwright_timeout_ms=$(((ROW_TIMEOUT_SECONDS > 15 ? ROW_TIMEOUT_SECONDS - 15 : ROW_TIMEOUT_SECONDS) * 1000))

  for id in "${scope_ids[@]}"; do
    if (( FORCE == 0 )) && receipt_is_valid "$id"; then
      continue
    fi

    row_failed=1
    attempt=1
    while (( attempt <= attempts )); do
      attempt_log="$RUN_TMP/$id-attempt-$attempt.log"
      started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      status=0
      set +e
      run_bounded "$ROW_TIMEOUT_SECONDS" "$attempt_log" \
        env SPIKE1_EXTERNAL_SERVER=1 SPIKE1_ROW_ID="$id" SPIKE1_PLAYWRIGHT_TIMEOUT_MS="$playwright_timeout_ms" \
        npx playwright test tests/spike1.material.spec.ts --project=chromium-gpu --workers=1 --reporter=line
      status=$?
      set -e
      finished_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

      if (( status == 0 )) && receipt_is_valid "$id"; then
        append_unique "$VALID_IDS_FILE" "$id"
        row_failed=0
        break
      fi

      if (( status == 124 )); then
        outcome='timeout'
      elif (( status == 0 )); then
        outcome='invalid-receipt'
        status=65
      else
        outcome='child-exit'
      fi
      failure_log="$FAILURES_DIR/$RUN_ID-$id-attempt-$attempt.log"
      mv "$attempt_log" "$failure_log"
      record_failure "$id" "$attempt" "$outcome" "$status" "$failure_log" "$started_at" "$finished_at"
      attempt=$((attempt + 1))
    done

    if (( row_failed == 1 )); then
      append_unique "$FAILED_IDS_FILE" "$id"
      write_progress "$id" 'failed-unresolved' "$scope_label"
    else
      write_progress "$id" 'completed' "$scope_label"
    fi
    print_progress
  done

  local final_unresolved=0
  for id in "${scope_ids[@]}"; do
    if grep -Fxq "$id" "$FAILED_IDS_FILE" 2>/dev/null || ! receipt_is_valid "$id"; then
      final_unresolved=$((final_unresolved + 1))
    fi
  done
  (( final_unresolved == 0 ))
}

if [[ "${BASH_SOURCE[0]}" = "$0" ]]; then
  main "$@"
fi
