# Visual, Accessibility & Seam Court — 2026-08-26

Executed against the canonical art-direction-v2 line (`fable/neuruh-art-direction-v2-20260824`,
parent `beda3e1` "visual reset — PROOF STRATA hero, carbon/steel/ice palette") under the terms of
`docs/design/ART_DIRECTION_V2.md` and `FABLE_NEURUH_COM_FINAL_VISUAL_AND_GO_LIVE.md`.

No new design direction was introduced. DECISION FOUNDRY remains the hero; the ART_DIRECTION_V2
token family and its PROHIBITED list were not altered.

## Defects found and fixed (all measured, none cosmetic guesses)

### 1. Colour contrast below WCAG AA — 10 serious axe violations
`--v2-steel #607d98` was used as small mono text on every dark V2 surface. Measured ratios:
**4.44:1 on `--v2-bg-1`, 4.19:1 on `--v2-surf-1`** — both below the 4.5:1 requirement for text
under 18.66px. axe reported only 2 of the affected classes; the rest sit on gradient backgrounds
where axe returns *incomplete* rather than *violation*, so they were fixed from source, not from
the tool output.

Fix: added `--v2-steel-ink #7391ad` — the AA text form of steel, measured **≥5.11:1 on every V2
surface** (bg-0 6.06, bg-1 5.80, surf-1 5.48, surf-2 5.11, bay gradient 5.42). Repointed the 14
text uses plus 2 inline TSX overrides. `--v2-steel` is retained unchanged for borders and
decoration, so the locked palette is intact.

Result: **A11Y COURT PASS — 42/42 route×viewport checks, zero serious/critical.**

### 2. Receipt card clipped at every viewport — proof payoff unreadable
`.f-receipt` (local x 866–1166 inside the 1180px `.foundry`, anchored `right:-36px`) overhung the
frame at **all 11 measured widths**: +22px at 2048/1728, +45px at 1600–1280, +101px at 1152–900,
+228px at 430/390. The clipped text was the *values* — `offer.prepare▮`, `granted · scope▮`,
`recorde▮`. The authority gate also clipped (+29px) at ≤1152.

Fix: pulled the card inward (`left 800px`, `width 292px`) and reduced the overhang per scale step
(`-46px` at ≤107rem, `-40px` at ≤75rem, `-24px` on mobile). Receipt and gate now sit **21–52px
inside the frame at every width**, with the cinematic bleed of the large panels preserved.

### 3. Hero copy collided with the foundry below 1440
Measured chip-left minus copy-right: 1366 **−10px**, 1280 **−96px**, 1152 **−6px**, 1024 **−134px**,
900 **−258px**. The headline overprinted the input chips and, after the overhang fix, the product
panels themselves (1024: **−102px**).

Fix: input chips retire below 90rem; below 84rem (~1360px) the hero **stacks** — copy above,
foundry beneath — because a 590px copy column and a legible foundry cannot share a row at 1024.
The stack is tightened (`padding-bottom 262px`) so the DeedSonar surface still enters the first
viewport rather than sitting far below the fold.

Result: **HERO COMPOSITION PASS at 13 widths** — no clipping, no collision, no page overflow.

### 4. Primary commercial CTA invisible on mobile
"Work with Neuruh" rendered at **x=454 in a 390px viewport** — entirely off-screen, inside a
horizontally-scrolling nav. "How it works" was crushed to 49px wide and wrapped to three lines
(88px tall vs 39px).

Fix: mobile nav wraps instead of scrolling; items no longer shrink. CTA is visible at every
viewport; every nav item renders on one line.

### 5. Public-truth artifacts 404ed — the verifiability claim was broken
`/proof` links `/truth/snapshot.json` and `/truth/signature.json`. The compiler writes repo-root
`public/truth`, but Next serves `apps/neuruh-web/public` — so the artifacts backing "This snapshot
itself is verifiable" **were never served**. Build-time importers were unaffected, which is why no
existing test caught it.

Fix: `scripts/sync-truth-public.mjs` publishes the canonical artifacts into the served tree on
`prebuild`, and `verify:truth-served` (now in the `verify` chain) fails the build if the served
copy ever drifts from canonical. Single source of truth remains repo-root.

Result: all three artifacts serve 200. **INTERNAL LINK COURT PASS — 25 pages, zero broken links.**

### 6. Every route declared the homepage as its canonical
`alternates: { canonical: '/' }` in the root layout was inherited by all 18 routes, telling search
engines that `/products`, `/proof`, `/worlds/*` etc. are duplicates of the homepage.

Fix: removed the inherited canonical; each route now declares its own, including per-slug
canonicals for `/worlds/[slug]`. The three deliberate homepage alternates (`/accessible`,
`/no-webgl`, `/reduced-motion`) still canonicalize to `/`, which is correct — the smoke suite
asserts their DOM is identical to the homepage.

Result: **CANONICAL COURT PASS — 19/19 routes correct.**

### 7. Scene autoplayed with no pause control (WCAG 2.2.2)
The Aug-25 visitor-walk audit (`audit/neuruh-visitor-walk-20260825`,
`docs/audits/evidence/20260825/observations.json`) recorded **P0: none, P1: AUTO-01 and CTRL-01** —
"scene autoplays with no visible play/pause control". Re-measured on this build: `/galaxy` still
carried a continuously animating canvas with **zero** visible controls. The a11y court could not
see it, because axe does not inspect motion inside a canvas.

Fix: a visible, keyboard-operable pause control on `/galaxy`, routed through the scene contract's
existing reduced-motion route (`SceneBoundary forcedMotion`, SCENE_CONTRACT §8) rather than a frame
freeze, so the still state remains a legitimate scene state. It defaults to the visitor's OS
`prefers-reduced-motion` setting and only overrides it on explicit click.

Verified: control visible; pause halts canvas repaint (screenshot-identical across 1.6s); toggles
by keyboard; `aria-pressed` starts `true` under an OS reduced-motion preference.
**AUTO-01 and CTRL-01 closed.**

## Provenance

`apps/neuruh-web/app/globals.css` is classified `ported`, so the edit is permitted; its
`destinationSha256` was updated in `receipts/provenance/artifacts.json`
(twice: the contrast token pass and the scene-motion control). Every other artifact digest is untouched, so unrelated drift would
still fail the gate. `verify:provenance` passes at 68 artifacts.

## Court results

| Court | Result |
|---|---|
| verify:truth / verify:truth-served | PASS (3 served artifacts byte-identical) |
| typecheck | PASS |
| node --test (contracts, truth, privacy, budgets) | PASS 24/24 |
| verify:provenance | PASS 68 artifacts |
| verify:boundaries | PASS — non-spatial modules WebGL-free |
| production build | PASS — 33 routes |
| test:artifacts | PASS 5/5 (homepage 174.0 KB gzip, within budget) |
| budget canary | PASS 3/3 (deliberate regressions rejected) |
| Playwright smoke | PASS 7/7 |
| a11y court (axe, 21 routes × 2 viewports) | PASS 42/42, zero serious/critical |
| internal link crawl | PASS — 25 pages, 0 broken |
| canonical court | PASS 19/19 |
| hero composition geometry | PASS 13 widths |
| visual court v2 | 49 frames, 7 viewports × 7 timestamps — inspected |
| secret scan | PASS — no credential patterns, no private paths in served HTML |
| scene motion court (WCAG 2.2.2) | PASS — pause halts the scene, keyboard-operable |

## Known, accepted, not fixed

- **Local path fragment in one client chunk.** `out/_next/static/chunks/2w-*.js` contains
  `neuruh-worktrees/neuruh-public-launch-20260823/node_modules/next/dist/compiled/process/` —
  one occurrence, injected by Next/Turbopack's own compiled `process` shim, not application code.
  It exposes a directory name only: no username, no secret. A Vercel-built deployment would carry
  the build-agent path instead. Not patched, because patching vendor output is worse than the leak.
- **`/accessible` appears in the sitemap while canonicalizing to `/`.** Standard for an alternate
  rendering; left as-is deliberately.
- **Founder visual acceptance is not granted by this court.** Machine gates are green; only
  Jeramie can set `FOUNDER_VISUAL_ACCEPTANCE`.

## Boundary respected

No deployment, no DNS change, no domain cutover, no live service or database was touched. The
spike repository `neuruh-com-spike` was read only.
