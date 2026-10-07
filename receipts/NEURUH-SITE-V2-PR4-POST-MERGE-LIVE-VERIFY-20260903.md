# NEURUH-SITE-V2-PR4-POST-MERGE-LIVE-VERIFY-20260903

**MISSION_ID=NEURUH-SITE-V2-PR4-POST-MERGE-LIVE-VERIFY-20260903**
**PARENT=NEURUH-FINISH-EVERYTHING-20260902 / Bob idle watchdog**
**VERDICT=LIVE_PROVEN_ON_3777d28d**
**NEXT_CHILD_MISSION_ID=NONE** — production already serves a descendant of `3777d28d`. No founder deploy GO packet.

Courted 2026-09-03T21:12Z–21:34Z. Read-only. No production mutate, no second Vercel project, no DNS, no Stripe, no social posts.

## 1. Merged state of #4

| Item | Evidence |
| --- | --- |
| PR | https://github.com/NeuruhAI/neuruh-web/pull/4 |
| State | `merged: true` by `Jeramie-Hicks` at `2026-09-02T21:48:41Z` |
| PR head (courted SHA) | `3777d28dcbeee852cf659a75df8dc9ee7349a8dd` |
| Merge commit / Site V2 tip | `9edbafee71a5479c8959493f5649710cb5c9e7db` — *Promote PR #4 into Site V2: footer /security + 390px CTA court (courted head 3777d28d)* |
| Base at merge | `fable/neuruh-art-direction-v2-20260824` @ `b54d0ebdb61b265f4393a941ab4ca53da27177ef` |
| Current origin tip | `origin/fable/neuruh-art-direction-v2-20260824` = `9edbafe` (fetched 2026-09-03) |
| Ancestry | `git merge-base --is-ancestor 3777d28d origin/fable/neuruh-art-direction-v2-20260824` → **yes** |

`3777d28d` is the PR head, not the merge commit. The tip that contains it is `9edbafe`.

## 2. Vercel production census (existing project only)

Project `neuruh-web` / `prj_KPREbSQrX9JKq8ZOTdgGjwvW45HN` / team `team_CgohYot6QdrG9HrRSj4zEqhw` (`anchorpointpg`).

`get_project.link` = `null` (still not git-linked). Team project list still has exactly one `neuruh-web` plus unrelated `deedsonar`. No second project created.

| Field | Current production | Prior LIVE_PROVEN (PR3) |
| --- | --- | --- |
| id | `dpl_3pNcYwQvdUyYytLvrYspFmEidZed` | `dpl_A1oYAbGP32F9oY1FB3u4BPxE8d5V` |
| state / target | READY / production | READY / production |
| created | 2026-09-02T22:10:04.228Z | 2026-09-02T15:08:04.149Z |
| ready | 2026-09-02T22:10:27.357Z | 2026-09-02T15:08:37.343Z |
| url | `neuruh-1dcsfxt55-anchorpointpg.vercel.app` | `neuruh-flljnknmt-anchorpointpg.vercel.app` |
| aliases | `neuruh.com`, `www.neuruh.com`, `neuruh-web.vercel.app`, `neuruh-web-anchorpointpg.vercel.app` | same aliases historically |
| SHA / meta | `8e9a8b5e50b55293b763f525863da5cbf56ef033` · *Put Property Scan and Lead Rescue on the site as quoted work (PR #6)* · ref `deploy/canonical-20260902` · actor `claude-code_2-1-258_agent` · source `cli` | `b54d0ebdb61b265f4393a941ab4ca53da27177ef` · PR #3 merge · actor `cursor-cli` |
| inspector | https://vercel.com/anchorpointpg/neuruh-web/3pNcYwQvdUyYytLvrYspFmEidZed | https://vercel.com/anchorpointpg/neuruh-web/A1oYAbGP32F9oY1FB3u4BPxE8d5V |

`get_deployment({ idOrUrl: "neuruh.com" })` resolves to `dpl_3pNcYwQvdUyYytLvrYspFmEidZed`.

Live homepage HTML: `<html data-dpl-id="dpl_3pNcYwQvdUyYytLvrYspFmEidZed">`. Asset URLs carry `?dpl=dpl_3pNcYwQvdUyYytLvrYspFmEidZed`.

### SHA chain (why 3777d28d is live without a PR4-only deploy)

```
b54d0eb  Merge PR #3 (prior LIVE_PROVEN)
3216845  fix: replace footer mailto with /security and stack 390px CTAs
3777d28  chore: refresh ported globals.css provenance digest   ← PR #4 head
9edbafe  Promote PR #4 into Site V2                            ← Site V2 tip
fa91a9e  Converge Site V2 into the default branch (PR #5)
2920a20  quoted work (no cashier)
8e9a8b5  PR #6 — current production HEAD
```

- `3777d28d` **is** an ancestor of `8e9a8b5`
- `9edbafe` **is** an ancestor of `8e9a8b5`
- `git diff 3777d28d 8e9a8b5 -- SiteFooter.tsx globals.css .well-known` → **empty** (PR4 surfaces not reverted)

Production is **not** still on `b54d0eb`. It moved forward through PR #6. PR #4 changes are in that tree.

## 3. Buyer court — live neuruh.com

HTTP (curl, 2026-09-03T21:14Z, `x-vercel-cache: HIT`, `server: Vercel`):

| Route | Status | Note |
| --- | --- | --- |
| `https://neuruh.com/` | **200** | `data-dpl-id=dpl_3pNc…` |
| `https://neuruh.com/offers` | **200** | three cashiers |
| `https://neuruh.com/thank-you` | **200** | handoff copy present |
| `https://neuruh.com/security` | **200** | public-safe disclosure |
| `https://neuruh.com/.well-known/security.txt` | **200** | Contact HTTPS only |
| `https://www.neuruh.com/` | **200** | same homepage etag as apex |

### Checklist

| Check | Result | Evidence |
| --- | --- | --- |
| Footer has `/security` | **PASS** | Live `<footer>` brand line: `<a href="/security">neuruh.com/security</a>`. JS: `footer.site-footer a[href="/security"]` → `https://neuruh.com/security`. |
| Footer has no `mailto:jeramie@` | **PASS** | Footer hrefs: `/security`, GitHub, nav columns only. JS: `footer.site-footer a[href^="mailto:"]` count = **0**. |
| `security.txt` Contact | **PASS** | `Contact: https://neuruh.com/security` (no mailto). sha256 `20fef4335fb27637a7ec6fc8b2684ae234ea39a52c8aa08aa0c1a273e479c23f` matches repo + `8e9a8b5` file. Expires `2027-09-02T00:00:00.000Z`. |
| 390px hero CTAs stack | **PASS** | Live CSS `@media (max-width:430px){ .hero-v2 .hero-ctas{flex-flow:column;align-items:stretch} .hero-v2 .hero-ctas .v2-btn{width:100%} }`. Measured at 390×844 (see below). `scrollWidth=390`. |
| Cashiers O01 / O02 / O05 unchanged | **PASS** | Exact Stripe hrefs below. No new cashier. |
| `/thank-you` 200 | **PASS** | HTTP 200; “Checkout is done. Intake is next.” / webhook-honesty copy present. |

### 390×844 hero CTA boxes (live JS `getBoundingClientRect`)

| CTA | href | x | y | w | h |
| --- | --- | --- | --- | --- | --- |
| See offers | `/offers` | 20 | 557.546875 | 352.453125 | 51.03125 |
| Explore the systems | `/products` | 20 | 618.578125 | 352.453125 | 51.03125 |
| See the proof | `/proof` | 20 | 679.609375 | 352.453125 | 51.03125 |

Three distinct Y positions, full-width column, no clip. Matches the PR #4 court (y ≈ 557.5 / 618.6 / 679.6, x=20, w≈352.5, `scrollWidth=390`).

### Cashiers (DOM `getAttribute('href')` + saved HTML)

| id | price | href | live |
| --- | --- | --- | --- |
| O01 | $299 | `https://book.stripe.com/bJe5kDagndYugJlaow2cg04` | **unchanged** |
| O02 | $499 | `https://book.stripe.com/8x2cN574b1bIakXgMU2cg05` | **unchanged** |
| O05 | $1250 | `https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06` | **unchanged** |

`data-offer-id` values on `/offers`: `O01`, `O02`, `O05` only. No other `book.stripe.com` targets.

## 4. Verdict

**LIVE_PROVEN_ON_3777d28d**

Not `LIVE_STILL_ON_b54d0eb_NEEDS_DEPLOY` — production left `dpl_A1oY` / `b54d0eb` at 2026-09-02T22:10Z for `dpl_3pNc` / `8e9a8b5`.

Not `UNKNOWN` — SHA ancestry, Vercel alias, live `data-dpl-id`, footer/CSS/cashier DOM, and 390px boxes all agree.

Precision: neuruh.com HEAD is `8e9a8b5` (PR #6), a descendant of `3777d28d`. The PR #4 buyer markers are on that deployment.

## 5. What this mission did not do

- No `vercel --prod`, no promote, no rollback
- No second Vercel project
- No DNS change
- No Stripe create / cashier edit
- No merge of any other PR
- No FR-mission approval
- No deedsonar / recipe-engine / landos-ingest work
- No X / Reddit posts

## 6. NEXT_CHILD

**NONE.** Founder deploy GO is not required for PR #4. The idle-watchdog child `NEURUH-SITE-V2-PR4-VERCEL-PROD-FOUNDER-GO-20260903` should not be spawned from this court.
