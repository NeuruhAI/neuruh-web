# DeedSonar production customer tape — 2026-09-14 (attestation)

Read-only tape run against the production database (project `efxowqudmsfqjmbeidjc`, `default_transaction_read_only=on`) from the repository main tree `06cbb841e81221cef12be51384139be28b2351f6`; the production app attests the same SHA (`src identical to production: YES`).

- Run: `tape_20260914114835_7421053a_production` · schema `deedsonar.customer_tape.v1`
- Content SHA-256: `c93e60246c47c45ee84fd7b0ef281f8c0de6bf1e0fd330722ca8d1c203facb8d`
- Ledger max: `20260913150000` (read 2026-09-14T11:48:35Z)
- Selection: the product's own top opportunity (min global_rank over `deedsonar_current_candidates_v1`)
- Verdict: **BLOCKED at CONTACT_LADDER — HUMAN_STEP_REQUIRED** (owner deceased, no public estate case found; heir identity is a courthouse research step)
- Steps reachable: 10 of 15 (PROPERTY, IDENTITY, RECIPE, MEMBERSHIP, SIGNALS, SCORE, EVIDENCE, NBE, QUALIFICATION, CONTACT_LADDER); ACTION_AUTHORITY, OPERATOR_DECISION, OUTPUT, FULFILLMENT, RECEIPT not reachable
- Outreach state: no SMS, no dialing, contact action authority 0 eligible rows; no DNC or consent weakening

Full tape (private, contains parcel and party detail): `~/neuruh-workspace/RE_LIVE_20260914/TAPE.production.md`.
