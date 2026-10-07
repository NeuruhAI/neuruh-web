# ATTESTATION — Public commons audit (T40), 2026-08-20

Public-safe extract of `NEURUH_T40_PUBLIC_COMMONS_20260820/receipts/T40_RECEIPT.md` and its
per-repository evidence table (`evidence/test_counts.tsv`, 34 rows).

| Fact | Value |
|---|---|
| Public repositories in the NeuruhAI organization | 37 (36 carry code; 1 is the org config repo) |
| Repositories with a passing test suite | 34/34 of those with suites |
| Total passing tests across the commons | 1,285 |
| Python packages declaring zero runtime dependencies | 32 of 33 |
| Secret-scan hits across all 36 working trees | 0 |
| Licenses | 34 Apache-2.0 · 2 MIT · 0 unlicensed |
| Index drift vs live GitHub | 35/35 verified, no drift |

Disclosed blemish, deliberately not hidden: `nimdp-validator` has a corrupted README and history
bloat; it was left untouched because republication is founder-gated by the commons charter.

Live surface: https://github.com/NeuruhAI
