# TOP10 FINAL HANDOFF — 2026-09-14

Classifications used: PROVEN_LIVE · PROVEN_LOCAL · IMPLEMENTED_NOT_LIVE · IMPLEMENTED_INCOMPLETE · BLOCKED · HISTORICAL · UNKNOWN. Nothing below was upgraded without the evidence cited next to it.

## 1. Current git branch
`w4/public-truth-organism-20260914` (pushed to `origin`; PR #11 open against the GitHub default branch `fable/neuruh-public-launch-20260823`).

## 2. Final commit SHA
- **Deployed to production:** `ca20caba2405d6f415b591aa024776da159b85c5` — "top10: recover, repair, and court the Top 10 commercial layer and /harnesses".
- This handoff document is committed on top of it (docs only; production content unchanged).

## 3. Exact commits integrated (all reachable from HEAD, none force-pushed)
| SHA | What | How |
|---|---|---|
| `e085aa1` | Existing public-truth organism court (already on the branch) | preserved untouched |
| `cd5a40c` | Phase 0 recovery court `docs/commercial/TOP10_RECOVERY_PHASE0_20260914.md` | new |
| `d101b0ee` | Top 10 products + harness catalog (GitHub squash of PR #12, tree-identical to `commercial/top10-harness-products-20260914-v2` @ `1acf1749`) | `git merge --no-ff` → merge commit `e30bb07` |
| `ca20cab` | Repair + court of the recovered layer | new |

## 4. Files changed (recovered layer + repairs, vs `e085aa1`)
```
COMMERCIALIZATION_TOP10_BIBLE.md, TOP10_SALES_PLAYBOOK.md          (from d101b0ee, unchanged)
apps/neuruh-web/app/products/page.tsx                               (from d101b0ee: 2 CTA links)
apps/neuruh-web/app/products/top10/page.tsx                         (rewritten: categories, all 10, hard zeros)
apps/neuruh-web/app/products/top10/[slug]/page.tsx                  (rewritten: 10 sections + ladder + CTA)
apps/neuruh-web/app/harnesses/page.tsx                              (rewritten: 13 stages, statuses, demo)
apps/neuruh-web/app/contact/page.tsx                                (+ProductInquiry, +Top 10 route)
apps/neuruh-web/app/sitemap.ts                                      (+12 routes)
apps/neuruh-web/lib/top10.ts                                        (git mv from features/top10/Top10Data.ts; rewritten)
apps/neuruh-web/lib/harnessStages.ts                                (new, dependency-free)
apps/neuruh-web/components/top10/ProductDemo.tsx                    (git mv; harness demo rewritten)
apps/neuruh-web/components/top10/Top10Product.module.css            (git mv; contrast lifted, new classes)
apps/neuruh-web/components/ProductInquiry.tsx                       (new: ?product= echo → mailto)
apps/neuruh-web/tests/production.smoke.spec.ts                      (+12 routes, +2 tests)
tests/top10-surfaces.test.mjs                                       (new, 5 tests)
scripts/verify-private-ip.mjs, scripts/a11y-court.mjs               (+12 routes each)
packages/public-truth/fixtures/verified-snapshot.input.json         (release-court metrics re-measured)
public/truth/*, apps/neuruh-web/public/truth/*                      (recompiled, checksum 3ad7704e…)
docs/receipts-external/top10-commercial-court-20260914.attestation.md (new, dated)
```

## 5. Top 10 product status
| # | Product | Route on neuruh.com | Price | Checkout | Page | Engagement |
|---|---|---|---|---|---|---|
| 1 | Agent Integrity Suite | 200 | $2,500 pilot (TEST) | quote via /contact | PROVEN_LIVE | IMPLEMENTED_NOT_LIVE |
| 2 | AI Estate Forensic | 200 | $2,500–$7,500 (TEST) | quote | PROVEN_LIVE | IMPLEMENTED_NOT_LIVE |
| 3 | Property Opportunity Scan | 200 | $100 founder-set | **BLOCKED** (no cashier; order by email) | PROVEN_LIVE | IMPLEMENTED_INCOMPLETE |
| 4 | Opportunity Intelligence Dossier | 200 | $499 | **PROVEN_LIVE** Stripe O02 | PROVEN_LIVE | IMPLEMENTED_INCOMPLETE (founder-fulfilled, none delivered) |
| 5 | Business Acquisition Intelligence | 200 | $750 / $2,500 (TEST) | quote | PROVEN_LIVE | IMPLEMENTED_NOT_LIVE |
| 6 | Data Rescue | 200 | $299 | **PROVEN_LIVE** Stripe O01 | PROVEN_LIVE | IMPLEMENTED_INCOMPLETE |
| 7 | Workflow Replacement Sprint | 200 | $1,250 | **PROVEN_LIVE** Stripe O05 | PROVEN_LIVE | IMPLEMENTED_INCOMPLETE |
| 8 | ProofOS / Future-State Twin | 200 | $2,500+ (TEST) | quote | PROVEN_LIVE | IMPLEMENTED_NOT_LIVE (14 courts vendored) |
| 9 | Managed Opportunity Desk | 200 | $1,500–$5,000/mo (TEST) | BLOCKED by design (after first outcome) | PROVEN_LIVE | IMPLEMENTED_NOT_LIVE |
| 10 | FindSellProfit | 200 | $299–$1,000+ (TEST) | quote | PROVEN_LIVE | IMPLEMENTED_NOT_LIVE (229/229 tests vendored) |

Every page states: buyer, problem, what it does, what you provide, what Neuruh does, what you receive, delivery format, turnaround, price with status label, use cases, evidence, real-vs-demonstration, commercial ladder, next action. Every page carries `BROWSER DEMONSTRATION — NOT A PRODUCTION ASSURANCE RESULT`. No customer results, counts, logos, or automation are claimed; public hard zeros are shown on the index.

## 6. Harness status
- `/harnesses` page: **PROVEN_LIVE** (HTTP 200 on neuruh.com; headless Chromium on production ran the demo: 13 stages, decision REJECT on the sample regression, 64-hex unsigned digest, at 1440 and 390 widths, zero console errors).
- Canonical sequence on page and in code (`lib/harnessStages.ts`): INTAKE → SCOPE → BASELINE → GOLDEN → HELD-OUT → ADVERSARIAL → RUN → DELTA → REGRESSIONS → AUTHORITY CHECK → EVIDENCE CHECK → DECISION → SIGNED RECEIPT.
- Harness inventory labeled per item: USED ON NEURUH RELEASES (neuruh-verify), INTERNAL · COURTED (factory, sentinel-court, context/memory path, runtime supervision, live-integration, cockpit), RESEARCH (crucible, ncell), PROPOSED (customer assurance pack). All eight repositories checked are `private=true` on GitHub; the page says none is externally callable.
- External harness engagement: **IMPLEMENTED_NOT_LIVE** (no pilot sold or run).

## 7. Local verification (PROVEN_LOCAL)
| Check | Result |
|---|---|
| `npm run verify` (truth, truth-served, typecheck, test, provenance, boundaries, private-ip, checkout-links, build, private-ip, dead-links, checkout-links, test:artifacts) | exit 0 · 46/46 unit · 20/20 artifact · dead-link 47 pages / 2,118 refs / 0 broken |
| `node scripts/a11y-court.mjs` (41 routes × 2 viewports) | PASS, 0 serious/critical (first run on recovered CSS: 24 serious contrast → palette lifted → re-run PASS) |
| `npm run test:smoke` (Playwright, 13 tests incl. 2 new) | 13/13 |
| HTTP on 127.0.0.1:4311 | 12 required routes 200 with titles/CTAs/banner; unknown slug 404 |
| `NEXT_OUTPUT_EXPORT=1 npm run build` (Vercel's build command) | exit 0, `out/products/top10/*.html`, `out/harnesses.html` present |
| `scripts/release-court.mjs` (historical 09-02 court, not in verify chain) | FAILS on `snapshot last_verified 2026-08-24` pin — **PRE-EXISTING** since `e085aa1` moved the snapshot to 2026-09-14 |

## 8. Production verification (PROVEN_LIVE)
- Deployment `dpl_CFuMj42cp5YP5tWVmGrK6My38jff` · `https://neuruh-17jrjutwg-anchorpointpg.vercel.app` · target production · READY · created 2026-09-14 14:15:24Z · aliases `neuruh.com`, `www.neuruh.com`, `neuruh-web.vercel.app`, `neuruh-web-anchorpointpg.vercel.app`. Project `prj_KPREbSQrX9JKq8ZOTdgGjwvW45HN` / `team_CgohYot6QdrG9HrRSj4zEqhw` (existing; no new project).
- Deploy method: CLI upload of the committed tree at `ca20cab` (the project has no Git integration; every prior production deploy was CLI too). Pre-deploy `git status`: clean except the generated `receipts/playwright-report.json`.
- Identity: `https://neuruh.com/truth/signature.json` `snapshot_sha256 = 3ad7704ede3c59f3db934f1b1209ced24539d87371ce57016e8e31be35922c8f` == committed `public/truth/signature.json` → production serves the artifact compiled at this commit.

| URL | HTTP | Title | Banner | CTA |
|---|---|---|---|---|
| /products/top10 | 200 | Top 10 commercial products — Neuruh | n/a | 10 items |
| /products/top10/agent-integrity | 200 | Agent Integrity Suite — $2,500 pilot … | yes | /contact?product=agent-integrity |
| /products/top10/ai-estate-forensic | 200 | AI Estate Forensic — $2,500–$7,500 … | yes | /contact?product=… |
| /products/top10/property-opportunity-scan | 200 | Property Opportunity Scan — $100 per property | yes | /contact?product=property-opportunity-scan |
| /products/top10/opportunity-intelligence-dossier | 200 | Opportunity Intelligence Dossier — $499 | yes | book.stripe.com/8x2cN574b1bIakXgMU2cg05 (200) |
| /products/top10/business-acquisition-intelligence | 200 | Business Acquisition Intelligence — … | yes | /contact?product=… |
| /products/top10/data-rescue | 200 | Data Rescue — $299 starter … | yes | book.stripe.com/bJe5kDagndYugJlaow2cg04 (200) |
| /products/top10/workflow-replacement | 200 | Workflow Replacement Sprint — $1,250 … | yes | book.stripe.com/7sY00j1JRf2y2Sv4082cg06 (200) |
| /products/top10/proofos | 200 | ProofOS / Future-State Twin — … | yes | /contact?product=proofos |
| /products/top10/managed-opportunity-desk | 200 | Managed Opportunity Desk — … | yes | /contact?product=… |
| /products/top10/findsellprofit | 200 | FindSellProfit — $299–$1,000+ … | yes | /contact?product=findsellprofit |
| /harnesses | 200 | Harnesses — verification as a product | yes | /contact?product=agent-integrity |
| /products/top10/does-not-exist | 404 | — | — | — |

Sitemap on production lists all 12 new routes. `/products` on production links to both `/products/top10` and `/harnesses`.

## 9. Checkout status
- **PROVEN_LIVE** for Data Rescue $299 (O01), Opportunity Dossier $499 (O02), Workflow Sprint $1,250 (O05): hosted Stripe payment links, HTTP 200 live, verified by the checkout-link court on every build and from production HTML. **No card was charged.**
- **BLOCKED** for Property Opportunity Scan $100: no cashier exists anywhere in the estate (the only other Stripe links found are legacy REI-X products). None was manufactured; the checkout-link court forbids it by design. The page says so and routes to email intake.
- All other products: quote via `/contact?product=<slug>` (IMPLEMENTED_NOT_LIVE as commerce; the route itself is live).

## 10. Intake status
- Contact intake surface: **PROVEN_LIVE** — `/contact?product=<slug>` renders the product, its price status, the required inputs, and a `mailto:jeramie@neuruh.com` with subject and body prefilled (driven in headless Chromium on production). No email was sent during verification.
- Post-checkout intake for the three cashier offers: **IMPLEMENTED_INCOMPLETE** — the site is a static export with no Stripe webhook; a founder emails the checkout address within one business day (stated on /offers, /thank-you, and each product page). No order record exists in this repository.

## 11. Fulfillment status
**IMPLEMENTED_INCOMPLETE.** Founder-operated for every product. Capability evidence exists (DeedSonar production court 1,510 green; 2026-09-14 read-only production tape reached 10 of 15 steps and stopped at a human research step; ProofOS 14 courts; FindSellProfit 229/229) but no job/order representation and no delivered engagement exists.

## 12. Receipt status
- Payment receipt: Stripe's hosted receipt to the buyer's address (Stripe mechanism; not exercised — no charge).
- Delivery receipt: **IMPLEMENTED_INCOMPLETE** — format defined on every page (human-readable report + JSON receipt naming inputs, sources, unknowns); none issued to a customer.
- Site-level receipts: dated attestation `docs/receipts-external/top10-commercial-court-20260914.attestation.md` compiled into public truth and rendered on /proof/distribution (47 pages, 2,118 refs, 0 broken, 0 serious/critical a11y).

## 13. Known blockers
1. No $100 cashier for Property Opportunity Scan (founder pricing/Stripe decision; the court allowlist would then need the new link added deliberately).
2. No webhook, order, or job system — static export by design; fulfillment is manual.
3. Zero customer engagements; hard zeros (revenue $0, customers 0, as of 2026-08-24) stand.
4. GitHub default branch (`fable/…` @ `d101b0ee`) still carries the unrepaired Top 10 (broken imports, forbidden organ name, wrong slugs). Production is served from `w4/…` @ `ca20cab` via CLI. Until PR #11 merges, default ≠ production.
5. Vercel project has no Git integration; deploys are CLI-only (unchanged from before).
6. Historical `scripts/release-court.mjs` pins the snapshot date to 2026-08-24 (pre-existing; not in the verify chain).

## 14. First founder action
Merge PR #11 (`w4/public-truth-organism-20260914` → `fable/neuruh-public-launch-20260823`) as a merge commit at exact head so the default branch equals what production serves. Then decide whether to create a $100 Stripe payment link for the Property Opportunity Scan.

## 15. What is actually sellable today
Data Rescue $299, Opportunity Dossier $499, Workflow Sprint $1,250 (live checkout, founder-fulfilled). Property Opportunity Scan $100 by email order and invoice.

## 16. What is demo-only
Every browser calculator on the ten product pages and the harness demonstration on `/harnesses` and the two harness-mode product pages. All labeled.

## 17. What is not yet live
Agent Integrity pilots, AI Estate Forensic audits, Business Acquisition screens, ProofOS diagnostics, Managed Opportunity Desk, FindSellProfit operator engagements (quote-only); Property Scan checkout; any automated intake, order tracking, fulfillment, or delivery receipt.

## 18. Exact next technical actions
1. `gh pr merge 11 --merge --match-head-commit <handoff SHA>` (founder identity) — default branch converges on production.
2. If a $100 scan cashier is created: add it to `PUBLIC_OFFERS` in `apps/neuruh-web/lib/publicOffers.ts`, to `CANONICAL_CASHIERS` in `scripts/verify-checkout-links.mjs` and the two cashier tests, set `offerId` on `property-opportunity-scan` in `apps/neuruh-web/lib/top10.ts`, flip its ladder rung, re-run `npm run verify`, redeploy.
3. First paid engagement: capture the checkout → email intake → delivery → JSON receipt tape and vendor it under `docs/receipts-external/`, then move that product's Fulfillment/Delivery/Receipt rungs to PROVEN_LIVE with the dated source.
4. Optional: `vercel git connect` so pushes to the default branch deploy automatically instead of CLI uploads.
5. Optional: retire or re-pin `scripts/release-court.mjs` to the current snapshot date with a new dated release court.
