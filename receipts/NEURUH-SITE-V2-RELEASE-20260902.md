# NEURUH-SITE-V2-RELEASE-20260902

**NEXT_CHILD_MISSION_ID=NEURUH-SITE-V2-RELEASE-20260902**

Do not stop at PR_CUSTODIED.

## Identities

| Item | Value |
| --- | --- |
| Candidate SHA | `e095fa72cf656a2466abc729afa8e08289eb0631` (security-txt honesty on top of `4c87bb4`) |
| PR | https://github.com/NeuruhAI/neuruh-web/pull/3 |
| Base / live production | `fable/neuruh-art-direction-v2-20260824` / SHIP-001 `30947182dd5b9e2575f77faa7eccd427da3d1a96` |
| Live production deploy | `dpl_32vJiwGRH3LiMMrcCQbVRE2bjBLK` → neuruh.com |
| Vercel project | `neuruh-web` / `prj_KPREbSQrX9JKq8ZOTdgGjwvW45HN` / team `anchorpointpg` |

## Release court (local static export)

**PASS** — `node scripts/release-court.mjs`

`/` `/offers` `/proof` `/thank-you` `/work-with-neuruh` `/work-with-us` exist. Per-route OG. Organization/WebSite/Service JSON-LD. Cashiers O01/O02/O05 only. `security.txt` Contact is `https://neuruh.com/security` (no mailto). robots + sitemap. private-IP fail-closed. Snapshot `stale: true` + `CONTRADICTING` + last_verified 2026-08-24.

## Live vs candidate (SHIP-001 vs this SHA)

| Route | Live neuruh.com | Candidate export |
| --- | --- | --- |
| `/` | 200 | 200 |
| `/offers` | 200, homepage OG | 200, og:url `/offers` |
| `/proof` | 200, homepage OG | 200, og:url `/proof` |
| `/thank-you` | **404** | 200 |
| `/work-with-neuruh` | **404** | 200 |
| `/work-with-us` | **404** | 200 |
| `/security` | **404** | 200 |
| `/.well-known/security.txt` | **404** | 200, no mailto |
| `/robots.txt` | 200 | 200 |
| `/sitemap.xml` | lastmod 2026-08-24 | commercial lastmod 2026-09-02 |

Cashiers on both: the three existing Payment Links. Not changed.

## Preview URL mapped to this SHA

**BLOCKED_EXTERNAL — Vercel CLI authentication / scope.**

- `npx vercel whoami` → Logged out
- `VERCEL_TOKEN` unset
- `npx vercel deploy --scope anchorpointpg` → `You do not have access to the specified account` (https://err.sh/vercel/scope-not-accessible)
- Project `neuruh-web` is **not git-linked** (`link: null`). A GitHub push does not create a preview.
- MCP `deploy_to_vercel` can talk to the existing project but cannot upload this repo’s source tree in one call. A one-file probe (`dpl_2e7ynwSvrhAvhFQkuQjBgvSPBCvB`) ERROR’d and was **not** production.

No preview URL is mapped to `e095fa7`. Do not treat `neuruh-el9fb83og-anchorpointpg.vercel.app` as this SHA.

## 390px

See `receipts/mobile-390-20260902/NOTES.md`. CTA does not overflow or clip.

## security.txt

Contact is `https://neuruh.com/security`. Does not claim `jeramie@neuruh.com` receives mail. Mailbox receipt is not proven.

## Merge / production deploy

Release court re-ran **PASS** on this turn (`node scripts/release-court.mjs` + `node scripts/verify-private-ip.mjs`). Live neuruh.com is still `dpl_32vJiwGRH3LiMMrcCQbVRE2bjBLK` / SHIP-001 `30947182`.

This commit only adds court receipts, 390px notes, and the court scripts. Site code is unchanged from `e095fa7`.

Next on this mission (do not stop at PR_CUSTODIED): undraft PR #3, merge into `fable/neuruh-art-direction-v2-20260824`, then Vercel production deploy of that SHA on existing project `neuruh-web` (`prj_KPREbSQrX9JKq8ZOTdgGjwvW45HN`). Do not create a second Vercel project. If CLI/MCP cannot upload this tree, the exact blocker is Vercel CLI `scope-not-accessible` / missing `VERCEL_TOKEN`, plus `neuruh-web` `link: null` so a GitHub merge does not auto-deploy.
