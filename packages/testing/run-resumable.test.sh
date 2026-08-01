#!/bin/bash
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
# shellcheck disable=SC1091
source "$REPO_ROOT/scripts/run-spike1-resumable.sh"

TEST_TMP="$(mktemp -d "${TMPDIR:-/tmp}/neuruh-spike1-runner-test.XXXXXX")"
SENTINEL_PID=""

test_cleanup() {
  [[ -z "$SENTINEL_PID" ]] || kill "$SENTINEL_PID" 2>/dev/null || true
  rm -rf "$TEST_TMP"
}
trap test_cleanup EXIT INT TERM

ROWS_DIR="$TEST_TMP/rows"
FAILURES_DIR="$ROWS_DIR/failures"
PROGRESS_FILE="$ROWS_DIR/progress.json"
VALID_IDS_FILE="$TEST_TMP/valid.txt"
FAILED_IDS_FILE="$TEST_TMP/failed.txt"
# Consumed by the sourced write_progress function.
# shellcheck disable=SC2034
RUN_ID="focused-test"
mkdir -p "$ROWS_DIR" "$FAILURES_DIR"
: >"$VALID_IDS_FILE"
: >"$FAILED_IDS_FILE"

ROW_ID="A-phys-L0-dpr2"
ROW_FILE="$ROWS_DIR/$ROW_ID.json"
SHOT_FILE="$ROWS_DIR/$ROW_ID.png"

node - "$MATRIX_FILE" "$ROW_FILE" "$SHOT_FILE" "$ROW_ID" <<'NODE'
const fs = require('node:fs')
const [matrixFile, rowFile, shotFile, id] = process.argv.slice(2)
const spec = JSON.parse(fs.readFileSync(matrixFile, 'utf8')).find((entry) => entry.id === id)
const metric = { p95: 1 }
const raw = {
  id,
  label: id,
  params: spec.params,
  errors: [],
  consoleErrors: [],
  diagnostics: { gpu: 'ANGLE Metal Renderer: focused test', softwareRenderer: false },
  frames: { gpuTimer: metric, sync: metric, raf: metric },
  census: { drawCalls: 1, drawingBuffer: { width: 1, height: 1 } },
}
const row = {
  id,
  group: spec.group,
  note: spec.note,
  gpuP95: 1,
  syncP95: 1,
  rafP95: 1,
  drawCalls: 1,
  sceneMemoryMb: 1,
  errors: [],
}
fs.writeFileSync(rowFile, JSON.stringify({
  schemaVersion: 1,
  measuredAt: new Date().toISOString(),
  screenshot: `spike1-rows/${id}.png`,
  row,
  raw,
}))
fs.writeFileSync(shotFile, Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.from('focused-test'),
]))
NODE

receipt_is_valid "$ROW_ID"
before_mtime="$(stat -f %m "$ROW_FILE" 2>/dev/null || stat -c %Y "$ROW_FILE")"
receipt_is_valid "$ROW_ID"
after_mtime="$(stat -f %m "$ROW_FILE" 2>/dev/null || stat -c %Y "$ROW_FILE")"
[[ "$before_mtime" = "$after_mtime" ]] || { printf 'valid skip predicate mutated the receipt\n' >&2; exit 1; }

mv "$SHOT_FILE" "$SHOT_FILE.missing"
if receipt_is_valid "$ROW_ID"; then
  printf 'missing screenshot was accepted\n' >&2
  exit 1
fi
mv "$SHOT_FILE.missing" "$SHOT_FILE"

node - "$ROW_FILE" <<'NODE'
const fs = require('node:fs')
const file = process.argv[2]
const doc = JSON.parse(fs.readFileSync(file, 'utf8'))
doc.raw.params.layers = 99
fs.writeFileSync(file, JSON.stringify(doc))
NODE
if receipt_is_valid "$ROW_ID"; then
  printf 'parameter mismatch was accepted\n' >&2
  exit 1
fi
node - "$ROW_FILE" <<'NODE'
const fs = require('node:fs')
const file = process.argv[2]
const doc = JSON.parse(fs.readFileSync(file, 'utf8'))
doc.raw.params.layers = 0
fs.writeFileSync(file, JSON.stringify(doc))
NODE
receipt_is_valid "$ROW_ID"

# Original cost-scaling rows intentionally had no named screenshot. Their
# complete raw Metal measurement is a first-class legacy receipt; requiring a
# newly invented visual artifact would force a pointless remeasurement.
LEGACY_ROW_ID="B-phys-L0-dpr1.5"
LEGACY_ROW_FILE="$ROWS_DIR/$LEGACY_ROW_ID.json"
node - "$MATRIX_FILE" "$LEGACY_ROW_FILE" "$LEGACY_ROW_ID" <<'NODE'
const fs = require('node:fs')
const [matrixFile, rowFile, id] = process.argv.slice(2)
const spec = JSON.parse(fs.readFileSync(matrixFile, 'utf8')).find((entry) => entry.id === id)
const metric = { p95: 1 }
fs.writeFileSync(rowFile, JSON.stringify({
  row: { id, group: spec.group, note: spec.note, gpuP95: 1, syncP95: 1, rafP95: 1, drawCalls: 1, sceneMemoryMb: 1, errors: [] },
  raw: {
    id,
    label: id,
    params: spec.params,
    errors: [],
    consoleErrors: [],
    diagnostics: { gpu: 'ANGLE Metal Renderer: focused test', softwareRenderer: false },
    frames: { gpuTimer: metric, sync: metric, raf: metric },
    census: { drawCalls: 1, drawingBuffer: { width: 1, height: 1 } },
  },
}))
NODE
receipt_is_valid "$LEGACY_ROW_ID"

/bin/sleep 10 &
SENTINEL_PID=$!
timeout_log="$TEST_TMP/timeout.log"
set +e
run_bounded 1 "$timeout_log" /bin/sleep 10
timeout_status=$?
set -e
[[ "$timeout_status" = 124 ]] || { printf 'expected timeout 124, got %s\n' "$timeout_status" >&2; exit 1; }
kill -0 "$SENTINEL_PID" 2>/dev/null || { printf 'timeout killed an unrelated process\n' >&2; exit 1; }

marker="$TEST_TMP/continued"
# $1 is expanded by the child shell.
# shellcheck disable=SC2016
run_bounded 5 "$TEST_TMP/continue.log" /bin/sh -c 'printf done >"$1"' sh "$marker"
[[ "$(cat "$marker")" = "done" ]] || { printf 'runner did not continue after timeout\n' >&2; exit 1; }

# An ordinary nonzero child must be returned to the caller without silently
# re-enabling global errexit. The matrix runner needs that status in order to
# retry the row and retain a failure receipt.
set +e
run_bounded 5 "$TEST_TMP/nonzero.log" /bin/sh -c 'exit 23'
nonzero_status=$?
continued_after_nonzero=1
set -e
[[ "$nonzero_status" = 23 ]] || { printf 'expected child exit 23, got %s\n' "$nonzero_status" >&2; exit 1; }
[[ "$continued_after_nonzero" = 1 ]] || { printf 'runner aborted before recording a child failure\n' >&2; exit 1; }

printf '%s\n' "$ROW_ID" >"$VALID_IDS_FILE"
write_progress "$ROW_ID" skipped-valid 'row:A-phys-L0-dpr2'
node - "$PROGRESS_FILE" <<'NODE'
const doc = require(process.argv[2])
if (doc.total !== 27 || doc.completed !== 1 || doc.failed !== 0 || doc.remaining !== 26) process.exit(1)
NODE

printf '%s\n' 'A-phys-L1-dpr2' >"$FAILED_IDS_FILE"
write_progress 'A-phys-L1-dpr2' failed-unresolved full
node - "$PROGRESS_FILE" <<'NODE'
const doc = require(process.argv[2])
if (doc.failed !== 1 || doc.lastStatus !== 'failed-unresolved') process.exit(1)
NODE

printf 'runner focused tests: PASS\n'
