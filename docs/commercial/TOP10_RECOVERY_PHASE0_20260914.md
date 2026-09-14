# TOP10 RECOVERY — PHASE 0 — ACTUAL REPOSITORY STATE (2026-09-14)

Evidence gathered from the founder's checkout `~/neuruh-repos/NeuruhAI/neuruh-web` after `git fetch --all --prune` at ~13:40Z.

## Identity

| Item | Value |
|---|---|
| Checkout | `/Users/jeramiehicks/neuruh-repos/NeuruhAI/neuruh-web` |
| Branch | `w4/public-truth-organism-20260914` |
| HEAD | `e085aa171c7a0a8b4028740c8d3aec291e8ab7bd` (clean tree) |
| Remote | `origin = https://github.com/NeuruhAI/neuruh-web.git` |
| GitHub default branch | `fable/neuruh-public-launch-20260823` |
| Open PR | #11 `w4/public-truth-organism-20260914 → fable/neuruh-public-launch-20260823` @e085aa17 |

## Where the Top10 work actually is

| Ref | SHA | Relationship to HEAD | Classification |
|---|---|---|---|
| `origin/fable/neuruh-public-launch-20260823` (default) | `d101b0ee4c7596b4a3f21e9ef3c75968698bf796` | sibling: base `94b17d6`, 1 ahead / 1 behind | **PRESENT_ON_REMOTE** (squash-merge of PR #12, merged 2026-09-14T13:33:47Z) |
| `origin/commercial/top10-harness-products-20260914-v2` | `1acf1749` (on `c5846786`) | 2 ahead of base `94b17d6` | **PRESENT_ON_OTHER_REF** — tree byte-identical to `d101b0e` (`git diff d101b0e ..v2` empty) |
| `origin/commercial/top10-harness-products-20260914` | `94b17d6b` | == merge base, carries nothing | HISTORICAL_ONLY (empty branch) |
| current branch `w4/…` HEAD `e085aa1` | — | `d101b0e` is **NOT** an ancestor | **MISSING** on current branch |

Before this lane's fetch, `d101b0e` was not in the local object store (`fatal: bad object`) — the earlier "merged" report was true on GitHub, not in this checkout.

### Files carried by `d101b0e` (9 files, +795 / -0)

```
COMMERCIALIZATION_TOP10_BIBLE.md                   | 209
TOP10_SALES_PLAYBOOK.md                            | 155
apps/neuruh-web/app/harnesses/page.tsx             |  47
apps/neuruh-web/app/products/page.tsx              |   4  (two CTA links added)
apps/neuruh-web/app/products/top10/[slug]/page.tsx |  72
apps/neuruh-web/app/products/top10/page.tsx        |  33
features/top10/ProductDemo.tsx                     |  78
features/top10/Top10Data.ts                        | 196
features/top10/Top10Product.module.css             |   1
```

File overlap with the current branch's own commit `e085aa1` (public-truth organism court, 12 files): **none**. A merge is conflict-free by construction.

## Current-branch inventory (PRESENT_ON_CURRENT_BRANCH)

- Routes: `/products`, `/offers`, `/ask`, `/work-with-neuruh`, `/contact`, `/thank-you`, `/cases`, `/proof`, `/proof/distribution`, … (26 page routes). **No** `/products/top10*`, **no** `/harnesses`.
- Commercial catalog `apps/neuruh-web/lib/publicOffers.ts`: three live cashiers **O01 Data Rescue $299**, **O02 Opportunity Dossier $499**, **O05 Workflow Sprint $1250** (Stripe payment links, founder-fulfilled, no webhook); two quoted engagements **Q-PROPERTY-SCAN (one market)**, **Q-LEAD-RESCUE** with no price and no cashier, court-enforced.
- Courts: `verify:checkout-links` (only the three cashiers are legal), `verify:private-ip` (forbids Mother/AXON/Aegis/IAR/recipe-engine/… on `app`, `components`, `lib`), `verify:dead-links`, `verify:truth`, `verify:provenance`, `verify:boundaries`, `tests/commercial-surfaces.test.mjs`, `tests/seo-courts.test.mjs`, Playwright `production.smoke.spec.ts`.
- Vercel linkage `.vercel/project.json` → `prj_KPREbSQrX9JKq8ZOTdgGjwvW45HN` / `team_CgohYot6QdrG9HrRSj4zEqhw`, project `anchorpointpg/neuruh-web`, aliases `neuruh.com`, `www.neuruh.com`.

## Live production (NOT_LIVE_PROVEN for Top10)

| URL | HTTP |
|---|---|
| https://neuruh.com/ | 200 |
| https://neuruh.com/products | 200 |
| https://neuruh.com/products/top10 | **404** |
| https://neuruh.com/products/top10/agent-integrity | **404** |
| https://neuruh.com/harnesses | **404** |
| https://neuruh.com/proof/distribution (PR #8, merged 09-03) | **404** |
| https://neuruh.com/offers, /contact, /cases, /ask, /work-with-neuruh, /security | 200 |

Production deployment = `dpl_3pNcYwQvdUyYytLvrYspFmEidZed` (`neuruh-1dcsfxt55`), created 2026-09-02 22:10Z by CLI (`yousernamehere`), no git metadata, aliased to neuruh.com. It predates PR #7/#8/#9, the current branch's truth court, and the Top10 merge. **Nothing auto-deploys from GitHub.** Top10 routes: `NOT_LIVE_PROVEN`.

## Defects found in the recovered implementation (to fix in Phase 1/2, not reimplement)

1. **Slug drift vs required routes** — `workflow-replacement-sprint` → must be `workflow-replacement`; `proof-os` → `proofos`; `find-sell-profit` → `findsellprofit`.
2. **Private-IP court will fail** — `apps/neuruh-web/app/harnesses/page.tsx` names `AXON` (forbidden rule `axon`); `features/top10/Top10Data.ts` names `AXON/PMLA` and `Founder Runtime` (outside the scanned roots today, but the doctrine still forbids shipping the factory).
3. **Unverified claim** — Top10Data says Property Opportunity Scan "records a live $100 Stripe product/payment link". No such cashier exists in this repo, in the estate grep (only O01/O02/O05 + legacy REI-X links), or in the 09-09 receipts, which state the $100 Scan "has NO delivery mechanism". Classification: **MISSING** (checkout), HISTORICAL_ONLY (intent).
4. **Demo mislabeled** — component header reads `LIVE PRODUCT DEMO`; mission requires `BROWSER DEMONSTRATION — NOT A PRODUCTION ASSURANCE RESULT`.
5. **Missing page fields** — no "what goes in", delivery mechanism, or turnaround per product; CTA always goes to `/contact?product=` even where a live cashier exists (Data Rescue O01, Dossier O02, Workflow Sprint O05).
6. **Harness page** lacks the canonical 13-stage sequence and per-harness production/external-callability status; all 8 referenced harness repos are `private=true` on GitHub.
7. Sitemap and Playwright smoke route list do not include the new routes.

## Classification summary

| Finding | Class |
|---|---|
| Top10 implementation (9 files) | PRESENT_ON_REMOTE + PRESENT_ON_OTHER_REF; MISSING on current branch |
| Public-truth organism work (`e085aa1`) | PRESENT_ON_CURRENT_BRANCH, pushed, PR #11 open |
| Three live cashiers O01/O02/O05 | PRESENT_ON_CURRENT_BRANCH, LIVE_PROVEN (checkout-link court hits Stripe live) |
| $100 Property Opportunity Scan cashier | MISSING |
| Top10 / harness routes on neuruh.com | NOT_LIVE_PROVEN (404) |
| Production deployment identity | 09-02 CLI deploy, behind default branch (HISTORICAL for PR #7–#9) |
