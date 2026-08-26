# Neuruh.com Provenance Table — 2026-08-26

Recovery of the actual Neuruh.com design/build authority from local disk. Hashes are `sha256`
prefixes; repo rows carry the commit SHA.

| ARTIFACT | DATE | PATH | SHA/HASH | SOURCE | CANONICAL | SUPERSEDED | DONOR_ONLY |
|---|---|---|---|---|---|---|---|
| **art-direction-v2 worktree** (the build) | 2026-08-24 → 08-26 | `~/neuruh-worktrees/neuruh-public-launch-20260823` | `beda3e1` + uncommitted | branch `fable/neuruh-art-direction-v2-20260824` of `NeuruhAI/neuruh-web` | **YES — the one production build** | no | no |
| ART_DIRECTION_V2.md (design lock v2) | 2026-08-24 | `docs/design/ART_DIRECTION_V2.md` | `f1845d3cc0d6` | worktree | **YES — governing visual law** | no | no |
| HERO_CONCEPT_DECISION.md | 2026-08-24 | `docs/design/HERO_CONCEPT_DECISION.md` | `a5cc56b42c66` | worktree | **YES — A/DECISION FOUNDRY won (89/100)** | no | no |
| FABLE_NEURUH_COM_FINAL_VISUAL_AND_GO_LIVE.md | 2026-08-24 | repo root | `b215e8da4985` | worktree | **YES — the executing mission** | no | no |
| NEURUH_ALIVE canonical ruling | 2026-08-23 | `docs/relock-package/01_…RULING.md` | `bca14d93241e` | worktree | **YES — product/claim law** | no | no |
| WORLD_MANIFEST.yaml (ecosystem) | 2026-08-23 | `docs/canon/WORLD_MANIFEST.yaml` | `ece379e05082` | worktree | **YES** | no | no |
| Public-truth compiler + snapshot | 2026-08-24 | `packages/public-truth`, `public/truth/*` | snapshot `2b184723f716…` | worktree | **YES — fail-closed truth layer** | no | no |
| `neuruh-web` canonical repo (default branch) | 2026-08-01 | `~/neuruh-repos/NeuruhAI/neuruh-web` | `0a6685f` | `codex/neuruh-alive-semantic-20260801-185255` | no — parent line | **YES**, by `beda3e1` | no |
| `neuruh-web` `main` | 2026-08-01 | same repo | `d717ab8` | git | no | **YES** | no |
| **neuruh-com-spike** (this repo) | 2026-08-01 | `~/neuruh-repos/NeuruhAI/neuruh-com-spike` | `ca50895` | git | no — spike only | **YES** (production line moved to `neuruh-web`) | **YES** — donor of tokens, scene runtime, budgets, Spike 0/1 evidence |
| Spike tag `…-direction-a-spike-v1` | 2026-08-01 | same | `a391f3d` | git tag | no | yes | **YES** — provenance source for 68 vendored artifacts |
| `neuruh-design-studio` | 2026-07-31 | `~/neuruh-repos/NeuruhAI/neuruh-design-studio` | `708a996` | git (clean, untouched) | no | yes | **YES** — origin of DESIGN_LOCK / SCENE_CONTRACT / prototype |
| `neuruh-design-system` | 2026-07-31 | `~/neuruh-repos/NeuruhAI/neuruh-design-system` | — (empty scaffold, 0 files) | dir | no | n/a | no — **empty, no content to recover** |
| visitor-walk audit | 2026-08-25 | `~/neuruh-worktrees/neuruh-visitor-audit-20260825` | `beda3e1` + uncommitted | branch `audit/neuruh-visitor-walk-20260825` | no — evidence, not a build | no | **YES** — supplied P1s AUTO-01/CTRL-01, both now closed |
| tract-cache recovery | 2026-08-25 | `~/neuruh-worktrees/neuruh-tract-recovery-20260825` | `47e7476` | branch `recovery/neuruh-tract-cache-20260825` (divergent, does **not** contain `beda3e1`) | no | no | **YES** — unrelated `lib/twin/*` property-twin salvage, 63 files; not the Neuruh.com line |
| `.74301 .74303 .74304 .74434 .74439 .75378 .75579` | 2026-08-17 08:39–08:40 | `neuruh-com-spike/` | 0 bytes each | shell litter | **no** | n/a | **no — TEMP ARTIFACTS, not evidence** |

## Untracked-file classification (mechanism-verified, nothing deleted)

All seven are **0-byte temp artifacts**, not source evidence. Verified cause, not inferred:
`~/.neuruh/lane.sh:15` defines `_nrh_drop(){ t="$NRH_REG.$$"; awk … >"$t" && mv "$t" "$NRH_REG"; }`
and `lane.sh:120` installs it as a `zshexit` hook. Claude Code's shell snapshot captures the
*function* but contains **no `NRH_REG=` assignment** (confirmed: 0 matches across snapshots), so
each tool-shell exits writing `".<pid>"` into its CWD; the `awk` finds no registry, so the trailing
`mv` never runs and a 0-byte file named for the PID is left behind. The same defect litters
`~/.neuruh/registry.tsv.<pid>`. The identical pattern appears in `~/neuruh-repos/NeuruhAI/` (40
files) and in other worktrees, which is why it is machine-wide rather than repo-specific.

This matches the independent forensic finding in `CURRENT_CHECKPOINT_20260824.md` §1.

**Disposition:** harmless residue; safe to ignore; **not deleted**, per instruction.
**Suggested owner fix (not applied):** `export NRH_REG`, or guard with `[ -n "$NRH_REG" ]`.

## Convergence ruling

There is **one** canonical production build: the art-direction-v2 worktree. No fourth direction was
invented. Direction A (Biological-Architectural) survives inside it as the Galaxy spatial runtime
under the founder-approved `trs=0.75` controlled reduction; the newer PROOF-STRATA / DECISION
FOUNDRY art direction governs the commercial surface. Nothing useful was discarded: the spike, the
studio, and the audit all remain intact as donors and evidence.
