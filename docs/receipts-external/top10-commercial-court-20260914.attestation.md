# ATTESTATION — Top 10 commercial layer and harness surface court, 2026-09-14

Public-safe extract of the Top 10 recovery lane (`docs/commercial/TOP10_RECOVERY_PHASE0_20260914.md`,
`docs/commercial/TOP10_FINAL_HANDOFF_20260914.md`). Every number below was measured on 2026-09-14 by
running the courts against the built candidate on branch `w4/public-truth-organism-20260914`, after the
default-branch commit `d101b0ee` (Top 10 products + harness catalog, PR #12) was merged at its exact SHA.

## What changed on the public surface

Twelve routes were added: `/products/top10`, ten product detail pages under it, and `/harnesses`.
Three products link to the three existing Stripe cashiers (Data Rescue $299, Opportunity Dossier $499,
Workflow Sprint $1,250). No new cashier was created. Every other product routes to the existing
`/contact` intake with the product carried in the query string. Every product page carries the label
`BROWSER DEMONSTRATION — NOT A PRODUCTION ASSURANCE RESULT` on its interactive panel.

## Release court gates (re-measured 2026-09-14)

Links were resolved against real prerendered routes and public files (`scripts/verify-dead-links.mjs`).
Accessibility used axe-core (WCAG 2.0/2.1 A and AA tags) at desktop 1440×900 and mobile 390×844 over
41 routes including all twelve new ones (`scripts/a11y-court.mjs`). Private-path and factory-name scans
ran over `app`, `components`, `lib`, and the prerendered HTML of every commercial route including the
twelve new ones (`scripts/verify-private-ip.mjs`). False live claims were checked by the Playwright
smoke court asserting zero `data-truth-mode="LIVE"` nodes on every route including the twelve new ones.

| Gate | Value |
|---|---|
| Broken links | 0 |
| Serious accessibility violations | 0 |
| Critical accessibility violations | 0 |
| Private-path leaks | 0 |
| False live claims | 0 |
| Accessibility viewport widths audited | 2 |
| Routes audited for accessibility | 41 |
| Prerendered pages checked for links | 47 |
| Internal references resolved | 2,118 |

The first accessibility run on the recovered pages recorded 24 serious color-contrast failures
(12 routes × 2 viewports). The muted palette was lifted to ≥ 4.5:1 and the court re-run to the values
above. Secret-scan hits are not re-attested here; the 2026-09-03 figure stands for that gate.

## What is explicitly not claimed

No customer has purchased or received any Top 10 product. Public hard zeros (revenue $0, customers 0,
as of 2026-08-24) still apply. Fulfillment, delivery, and receipt for every product are founder-operated
and become proven only with a delivered, receipted engagement. The $100 Property Opportunity Scan has
no checkout; it is ordered by email. Prices other than the three live cashiers are test commercial
pricing. Browser demonstrations are not production results.
