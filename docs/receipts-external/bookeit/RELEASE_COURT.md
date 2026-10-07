# Release court

Recorded verdict for the Bookeit agentic-commerce candidate. Reproduce with
`npm run court`, which runs each gate in sequence and prints this table.

```text
TYPECHECK=PASS
LINT=PASS
UNIT_AND_INTEGRATION_TESTS=PASS
BUILD=PASS
E2E_RESPONSIVE_VISUAL_ACCESSIBILITY=PASS
SECRET_SCAN=PASS
GIT_DIFF_CHECK=PASS
OVERALL=PASS
```

## What each court covers

| Court | Command | Coverage |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | `tsc --noEmit` with `strict` and `noUncheckedIndexedAccess` |
| Lint | `npm run lint` | ESLint flat config, `next/core-web-vitals` + `next/typescript`, no `any`, no unused, no stray `console` |
| Unit + integration | `npm test` | 161 tests across 14 files |
| Build | `npm run build` | Next.js production build, 51 routes |
| E2E | `npx playwright test` | 133 assertions on desktop-chromium and Pixel 7 |
| Secret scan | `npm run secret-scan` | 15 credential patterns over tracked files, plus a tracked-`.env` check; gitleaks also runs pre-commit |
| Diff check | `git diff --check` | No whitespace errors or conflict markers |

## Test inventory

| Suite | File | What it proves |
| --- | --- | --- |
| Primitives | `tests/unit/primitives.test.ts` | Deterministic ids, clock, digests, geo and local-time math |
| State machines | `tests/unit/state-machines.test.ts` | No stage can be skipped; terminal states are terminal |
| Payments | `tests/unit/payments.test.ts` | Authorize, capture, refund, void, idempotency, deterministic declines, mode guard |
| Offer compiler | `tests/unit/offer-compiler.test.ts` | Field extraction with evidence, missing fields as form fields, risk and credential warnings, determinism |
| Intent concierge | `tests/unit/intent-concierge.test.ts` | Clause splitting, per-clause windows, quantities, constraints, unmatched reporting, surface separation |
| Availability | `tests/unit/availability.test.ts` | Lead time, weekly windows, blackouts, capacity, and the reason for every failure |
| Matching | `tests/unit/matching.test.ts` | The ordered gate walk and each failure mode |
| Pricing + economics | `tests/unit/pricing-and-economics.test.ts` | Four pricing modes, bounded surge, fee split, refund accounting |
| Transaction court | `tests/integration/transaction-court.test.ts` | All 18 steps emitted once, in order, with no gaps |
| Authorization | `tests/integration/authorization.test.ts` | The four-stage boundary, agent rejection, limits, idempotency |
| Fulfillment + outcome | `tests/integration/fulfillment-and-outcome.test.ts` | Dispatch, capacity hold and release, proof enforcement, receipts, settlement, cancellation |
| MCP contract | `tests/integration/mcp-contract.test.ts` | JSON-RPC shape, tool schemas, no self-approval tool, protocol parity |
| UCP truthfulness | `tests/integration/ucp-truthfulness.test.ts` | The manifest cannot overstate what is implemented |
| REST | `tests/integration/rest-api.test.ts` | All 18 steps over HTTP handlers, one error envelope, correct statuses |
| E2E transaction | `tests/e2e/transaction-court.spec.ts` | The full court in a browser across three surfaces |
| E2E offer compiler | `tests/e2e/offer-compiler.spec.ts` | Compile, review, operator activation gate |
| E2E failure paths | `tests/e2e/failure-paths.spec.ts` | Seven refusal paths, each with a visible reason |
| Responsive | `tests/e2e/responsive.spec.ts` | 25 routes, no horizontal overflow, usable tap targets |
| Accessibility | `tests/e2e/accessibility.spec.ts` | axe WCAG 2.1 A/AA, skip link, single h1, keyboard operability |
| Visual | `tests/e2e/visual.spec.ts` | 19 captured screenshots plus above-the-fold heading assertions |

## Defects found and fixed during the build

1. **A declined payment was rolled back.** `Orchestrator.authorizePayment` threw
   `PAYMENT_DECLINED` from inside `store.mutate`, which discarded the draft — so
   the failed transaction and the decline reason never persisted and the
   operator exceptions view could never show them. The mutation now returns the
   decline and the error is thrown after the commit. Covered by
   `authorization.test.ts` and `failure-paths.spec.ts`.

2. **Contrast and scroll-region defects.** `--color-clay`, `--color-amber` and
   both `--color-ink-faint` tokens failed WCAG AA against the surfaces they were
   used on, and the horizontally scrollable table and graph containers were not
   keyboard focusable. Tokens were darkened to a measured minimum of 4.9:1 and
   the scroll regions are now focusable with accessible names. Covered by
   `accessibility.spec.ts` on both viewports.

3. **A capacity fixture was unreachable.** The only capacity-exhausted fixture
   sat behind a 24-hour lead time, so the `CAPACITY` gate could never be the
   first failure. A second fixture commits the lake-gear set for the following
   day, making the gate demonstrable from the demo. Covered by
   `availability.test.ts`.

## Non-goals asserted

- `PRODUCTION_WRITES=NO`
- `PRODUCTION_DNS_CHANGED=NO`
- `OUTBOUND_CONTACT=NO`
- `EXTERNAL_REPOS_MODIFIED=NO`
- `FORCE_PUSH_USED=NO`
- `MAIN_MODIFIED=NO`
