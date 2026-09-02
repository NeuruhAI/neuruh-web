# ATTESTATION — Neuruh Liquidity Engine custody + courts, 2026-08-24

Public-safe extract of `neuruh-liquidity-engine-fable-20260823/FABLE_HANDOFF.md`.

- Custody: NeuruhAI/neuruh-liquidity-engine, HEAD == REMOTE_HEAD `7f2af0039d51…` (branch
  feat/liquidity-engine-signal-market-v1-20260823).
- Courts proven on the founder host: **112 tests exit 0** · **18/18 operating court** · four
  vertical slices CLOSED · persistence court 6/6 · typecheck/lint/build clean · **100/100
  browser page-checks** (dev + production preview, desktop + mobile) · axe **0 serious / 0
  critical** (was 41/50 pages failing; two tokens fixed) · gitleaks 0 (a donor-baked sandbox
  secret was neutralized to env-sourced fail-closed).
- Meaningful ranking proof: for a distressed farm scenario the engine ranks **equipment
  liquidation (+$22.5k) first**, HOLD second, and the **$555k whole-farm sale last** at
  destructiveness 96 — least-destructive liquidity first.
- Boundaries by contract: all data, transactions, and authorization are **synthetic**; AUTH=OFF;
  owner contact, negotiation, legal review, execution, and payouts are manual. No real money
  moves.
