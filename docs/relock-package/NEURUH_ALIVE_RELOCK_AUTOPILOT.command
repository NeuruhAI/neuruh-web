#!/bin/bash
set -Eeuo pipefail

BASE="$HOME/neuruh-repos/NeuruhAI"
WORK="$BASE/neuruh-alive-relock"
GREEN="$BASE/neuruh-web"
STUDIO="$BASE/neuruh-design-studio"
SPIKE="$BASE/neuruh-com-spike"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="$WORK/run-$STAMP.log"

mkdir -p "$WORK"/{source-canon,package,receipts}
touch "$LOG"

say() {
  printf "\n============================================================\n%s\n============================================================\n" "$1" | tee -a "$LOG"
}

fail() {
  printf "\nERROR: %s\n" "$1" | tee -a "$LOG" >&2
  exit 1
}

say "NEURUH ALIVE — SEMANTIC RE-LOCK + P0-P2"

command -v codex >/dev/null 2>&1 || fail "Codex CLI not found."
[ -d "$STUDIO/.git" ] || fail "Design studio not found at $STUDIO"
[ -d "$SPIKE/.git" ] || fail "Spike repository not found at $SPIKE"

# Copy this execution package from Downloads when present.
PACKAGE_ZIP="$HOME/Downloads/NEURUH_ALIVE_SEMANTIC_RELOCK_v1.zip"
if [ -f "$PACKAGE_ZIP" ]; then
  rm -rf "$WORK/package"
  mkdir -p "$WORK/package"
  unzip -q -o "$PACKAGE_ZIP" -d "$WORK/package"
fi

# Locate canonical sources non-destructively.
patterns=(
  "*Adaptive*Intelligence*Visual*Atlas*.pdf"
  "*Jeramie*Neural*Core*Architecture*.pdf"
  "*Latent*Cross*Domain*Emergence*Case*Zero*.pdf"
  "*LOCAL*AI*ESTATE*MASTER*CANONICAL*CODEX*.pdf"
  "*RECOVERED*ASSET*PORTFOLIO*COMMERCIALIZATION*PLAYBOOK*.pdf"
  "*THREAD*COMMANDS*EVIDENCE*ARTIFACT*INDEX*.pdf"
  "*Find*Sell*Profit*Master*Codex*.pdf"
  "*FSP*Constitution*Brand*Ethos*.pdf"
  "*Neuruh*Galaxy*Canonical*Codex*.pdf"
  "*Neuruh*Founder*Grind*Persistence*Narrative*.pdf"
  "*Neuruh*Galaxy*Visual*Evidence*Dossier*.pdf"
  "*Neuruh*Design*System*.zip"
)

for pattern in "${patterns[@]}"; do
  found=""
  for dir in "$HOME/Downloads" "$HOME/Desktop" "$HOME/Documents"; do
    [ -d "$dir" ] || continue
    found="$(find "$dir" -maxdepth 4 -type f -iname "$pattern" -print -quit 2>/dev/null || true)"
    [ -n "$found" ] && break
  done
  if [ -n "$found" ]; then
    cp -n "$found" "$WORK/source-canon/" 2>/dev/null || true
    printf "SOURCE: %s\n" "$found" | tee -a "$LOG"
  else
    printf "MISSING PATTERN: %s\n" "$pattern" | tee -a "$LOG"
  fi
done

# Extract design system for direct inspection.
DS_ZIP="$(find "$WORK/source-canon" -maxdepth 1 -type f -iname '*Neuruh*Design*System*.zip' -print -quit || true)"
if [ -n "$DS_ZIP" ]; then
  rm -rf "$WORK/source-canon/design-system-extracted"
  mkdir -p "$WORK/source-canon/design-system-extracted"
  unzip -q -o "$DS_ZIP" -d "$WORK/source-canon/design-system-extracted"
fi

# If the package was not downloaded, create a clear stop rather than improvising.
PROMPT="$(find "$WORK/package" -type f -name '07_CODEX_ONE_SHOT_SEMANTIC_RELOCK_AND_P0_P2.md' -print -quit 2>/dev/null || true)"
[ -n "$PROMPT" ] || fail "Execution package not found. Download NEURUH_ALIVE_SEMANTIC_RELOCK_v1.zip into Downloads and rerun."

# Initialize green repo if it does not exist.
if [ ! -d "$GREEN/.git" ]; then
  mkdir -p "$GREEN"
  (
    cd "$GREEN"
    git init -q
    git branch -M main >/dev/null 2>&1 || true
    printf "# Neuruh.com Green Build\n" > README.md
    git add README.md
    git commit -q -m "chore: initialize isolated Neuruh.com green repository" || true
  )
fi

# Checkpoint any existing green work.
cd "$GREEN"
git status --porcelain > "$WORK/receipts/green-pre-status.txt"
git rev-parse HEAD > "$WORK/receipts/green-pre-head.txt"

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "chore: checkpoint green build before Neuruh Alive semantic re-lock" >/dev/null 2>&1 || true
fi

BRANCH="codex/neuruh-alive-p0-p2-$STAMP"
git switch -c "$BRANCH"

# Link/copy the canon into the green repo docs intake.
mkdir -p "$GREEN/docs/source-canon"
cp -R "$WORK/source-canon/." "$GREEN/docs/source-canon/" 2>/dev/null || true
mkdir -p "$GREEN/docs/relock-package"
cp -R "$(dirname "$PROMPT")/." "$GREEN/docs/relock-package/" 2>/dev/null || true

cat > "$GREEN/CLAUDE.md" <<'EOF'
# Neuruh.com Green Build — Semantic Re-lock

Read `docs/relock-package/07_CODEX_ONE_SHOT_SEMANTIC_RELOCK_AND_P0_P2.md`.

The design studio and spike repositories are read-only.
No deployment, DNS, GoDaddy, live database, or production private connector changes.
EOF

say "LAUNCHING CODEX — SEMANTIC RE-LOCK AND P0-P2"

codex exec \
  --sandbox workspace-write \
  --ask-for-approval never \
  -C "$GREEN" \
  -o "$WORK/receipts/codex-final.md" \
  - < "$PROMPT" \
  2> >(tee "$WORK/receipts/codex-stream.log" >&2)

say "FINAL STATE"

git status --short | tee "$WORK/receipts/final-status.txt"
git log -5 --oneline | tee "$WORK/receipts/final-log.txt"
cat "$WORK/receipts/codex-final.md"
