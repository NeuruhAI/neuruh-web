# PREVIEW DEPLOY RECEIPT — 2026-08-26

**Left uncommitted deliberately.** Committing it would advance `COMMITTED_HEAD` past the SHA the
preview was built from and break the exact SHA match proven below. Commit as a docs-only follow-up
after preview acceptance, or fold it into the production release commit.

## Deployment

| Field | Value |
|---|---|
| Preview URL | https://neuruh-cjdhliur0-anchorpointpg.vercel.app |
| Deployment id | `dpl_3bTBb2c1gpC7sLYrbXpNzr9WAZcD` |
| Project / team | `neuruh-web` / `anchorpointpg` (`team_CgohYot6QdrG9HrRSj4zEqhw`) |
| **target** | **`preview`** — confirmed by `vercel inspect`; not production |
| readyState | READY, built in `iad1`, 26s |
| Source | Vercel CLI 54.18.6, archive upload |
| Aliases | none — no domain attached |

## SHA provenance — PREVIEW_SHA_MATCH = TRUE

Vercel's own deployment metadata records:

- `gitCommitSha`  = `9648319e4ef98de4c1a743c1c0d7c4d342342d53`
- `gitCommitRef`  = `fable/neuruh-art-direction-v2-20260824`
- `gitCommitMessage` = "fix: close Neuruh.com visual, accessibility and public-truth seams"

That is exactly `COMMITTED_HEAD`. `gitDirty: "1"` reflects only the five 0-byte `.NNNNN`
zsh-exit artifacts, which are not build inputs; excluding them the tree had **0** modifications
against the commit at deploy time.

Corroborated by content: the committed public-truth artifacts are served **byte-identical**.

| Artifact | committed sha256 | served sha256 | |
|---|---|---|---|
| `/truth/snapshot.json` | `2b184723f7168bca…` | `2b184723f7168bca…` | MATCH |
| `/truth/signature.json` | `0f1060b26fa70616…` | `0f1060b26fa70616…` | MATCH |
| `/truth/events.jsonl` | `5878da8a9dc0a49a…` | `5878da8a9dc0a49a…` | MATCH |

The served snapshot also matches its own declared `snapshot_sha256` — the fail-closed truth layer
is self-consistent in production form.

## Courts run against the PREVIEW URL

The preview is behind Vercel SSO (`ssoProtection: all_except_custom_domains`). That protection was
**not** modified, disabled, or bypassed with a stored secret; the courts ran through the founder's
own authenticated browser session.

| Court | Result |
|---|---|
| HTTP status, 27 routes | PASS — 27/27 `200` |
| Internal link crawl | PASS — 25 pages, 0 broken |
| Canonical tags | PASS — 18/18 correct (3 homepage alternates → `/` by design) |
| Public truth | PASS — byte-identical + self-consistent checksum |
| Product routing | PASS — 8/8 named systems; all four status classes present |
| Independent faces | PASS — 7 `/worlds/*` deep records; 0 iframes, 0 canvas on `/products` |
| Commercial CTA | PASS — "Work with Neuruh" on 7/7 sampled routes; both hero CTAs present |
| Lead capture | PASS — `mailto:jeramie@neuruh.com`, the only mailto on the site |
| Scene motion (WCAG 2.2.2) | PASS — visible `<button>`, focusable, toggles `aria-pressed` false→true |
| Home / products / galaxy render | PASS — inspected as screenshots on the live preview |
| Remote build log | PASS — `prebuild` truth-sync ran; 33/33 static pages; no errors |

## Deployed CSS

Not byte-identical to a local build (69,171 B local vs 70,131 B deployed) — expected, since Vercel
built on Node 24.x against local Node 26.5, producing different asset-hash strings. Structurally
equivalent: **29 `@font-face` and 22 `@media` blocks in both**. All six shipped fixes verified
present in the deployed stylesheet: `--v2-steel-ink`, chips retiring at 90rem, hero stacking at
84rem, wrapping mobile nav, `.f-receipt` pulled in, and the scene pause control.

## Boundary

No production deployment. No alias or domain attached. No DNS change. `main` untouched at
`d717ab8`. Deployment protection settings unchanged.
