# DeedSonar production truth: 2026-09-16 (attestation)

This is the public attestation of two independent read-only receipts taken on 2026-09-16 against DeedSonar production. It records values only; parcel, party and contact detail stay private. Each value is dated and was read, never typed by hand.

## 1. Canonical current-truth pointer

- Pointer `ctp-61f1095245b73c14`
- Generated 2026-09-16T12:30:36Z, after that morning's production release
- Validated 2026-09-16T12:31:09Z: verdict **CURRENT_TRUTH_VALID**, 96 checks, 0 failures
- Evidence manifest sha256 `546553b888295f32c47433129ca630aa9a53c8470e1a4409c30dd994f244a640`
- Pointer file sha256 `f9413c338dc91ccdd298e9d2fd19092ae7583589a1c13c6e0c4817efcd5754a1`
- The earlier pointer of the same morning, `ctp-f5717be85c6518e5` (11:55:29Z, 96 checks, 0 failures), agreed on every estate value below.
- Every probe ran in a read-only transaction.

| Fact | Value (2026-09-16) |
|---|---|
| Production deployment | READY; every production alias resolves to one deployment, which serves the same commit as repository main |
| Agreement checks (aliases, database identity, UI read path == database) | 21 of 21 PASS |
| Current estate batches | 1 |
| Properties in the current estate | 22,584 (the UI read path returns the same total) |
| Qualified properties | 435 (0 of them without a next action) |
| Estate revisions since the original import | 35; the latest was 2026-09-15T15:52:25Z |
| Migration ledger | 195 rows, head `20260916121647` |
| Latest source-factory ingestion consumed by the estate | finished 2026-09-14T12:45:40Z |
| Freshness | STALE_COMPONENTS: the contact projection predates the last estate revision; public facts coverage is partial |

The original import label (`current-canonical-20260816`, as of 2026-08-14) is **HISTORICAL**. It names the first import of the batch, not the state of the estate today.

## 2. Customer tape: the product's own top opportunity, end to end

- Run `tape_20260916115458_7421053a_production`
- Schema `deedsonar.customer_tape.v1`
- Content sha256 `8351ebf549f495a424fa01e18423ec8230f4e2875379ea2ea57f3817264e63f3` (recomputed: PASS)
- Code tree identical to the production app (`src identical to production: YES`)
- Read 2026-09-16T11:54:58Z, `default_transaction_read_only=on`, at the production release that preceded the 12:16Z release the pointer reflects. That release did not change the estate values above.
- 66 reads, 0 read errors

**Verdict: BLOCKED at CONTACT_LADDER, HUMAN_STEP_REQUIRED.** The top-ranked owner is deceased and no public estate case exists, so identifying the heir is a courthouse research step.

- **Steps reachable: 10 of 15.** PROPERTY, IDENTITY, RECIPE, MEMBERSHIP, SIGNALS, SCORE, EVIDENCE, NBE, QUALIFICATION and CONTACT_LADDER are reachable.
- **Not reachable:** ACTION_AUTHORITY, OPERATOR_DECISION, OUTPUT, FULFILLMENT and RECEIPT.
- **First missing production capability: ACTION_AUTHORITY.** Production cannot record contact permission on any path, because the database constraints admit only `NOT_AUTHORIZED`.
- **Outreach state:** no SMS, no dialing, contact authority on 0 rows.

## Supersedes

- **Tape of 2026-09-14** (`tape_20260914114835_7421053a_production`): same verdict, 10 of 15 steps, at the earlier production tree. Kept as HISTORICAL.
- **Court of 2026-08-23** (1,510 tests green at release `e2b71fa`): that release is no longer the production release. Kept as HISTORICAL.
