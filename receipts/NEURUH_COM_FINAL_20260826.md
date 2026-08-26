# NEURUH_COM_FINAL — 2026-08-26

SOURCE_SHA=beda3e134c66ea1f6e57556429543c385a548af1 (+ uncommitted art-direction-v2 working tree, this session's fixes included)
REMOTE_SHA=beda3e134c66ea1f6e57556429543c385a548af1 (origin/fable/neuruh-art-direction-v2-20260824)
DEPLOYED_SHA=(none — no deployment performed)

FIRST_IMPRESSION_CLARITY=PASS — "AI systems that do real work — and prove it." + plain-language support, both CTAs, and the proof signal above the fold at all 7 court viewports
HEADLINE=PASS — solid and complete at t=0/250/500/1000/2000/5000/settled; no ghosting, no "its limits intact." fragment
ANIMATION=PASS — 49 frames inspected (7 viewports x 7 timestamps), receipts/visual-court-20260826/
ORGANISM=PASS — DeedSonar/Reports/Liquidity surfaces legible with honest tags; authority ring and receipt card fully on-screen at every width
COMMERCIAL_CLARITY=PASS — value proposition, 8 named systems with truthful status, engagement paths
CTA_HIERARCHY=PASS — brass primary "Explore the systems", ghost secondary "See the proof", persistent "Work with Neuruh" (7/7 sampled routes, visible at 390px)
PROOF=PASS — proofline in hero; /proof claim-evidence ledger; /truth/{snapshot,signature,events} serve 200
PRODUCTS=PASS — DeedSonar, FindSellProfit, Bookeit, CurbClaim, Liquidity Engine, ProofOS, Venture Factory, DATUM; tags IN PRODUCTION / SEALED CANDIDATE / SYNTHETIC DEMO / IN DEVELOPMENT

DESKTOP_2048=PASS   DESKTOP_1728=PASS   DESKTOP_1600=PASS   DESKTOP_1440=PASS
DESKTOP_1366=PASS   DESKTOP_1280=PASS   TABLET_1024=PASS    MOBILE_430=PASS   MOBILE_390=PASS

TYPECHECK=PASS
TESTS=PASS — 24/24 contracts+truth+privacy, 5/5 artifacts, 3/3 budget canary, 7/7 Playwright smoke
BUILD=PASS — 33 routes; homepage 174.0 KB gzip (within budget); static export clean
ACCESSIBILITY=PASS — axe 42/42 route x viewport, zero serious/critical; WCAG 2.2.2 scene pause added
RESPONSIVE=PASS — hero composition geometry verified at 13 widths; zero page-level horizontal overflow
VISUAL=PASS — screenshots inspected, not inferred from DOM
SECURITY=PASS — no credential patterns; no private paths or local endpoints in served HTML
SEO=PASS — unique titles/descriptions, one h1 per route, robots + 24-URL sitemap, OG image, canonical 18/18 correct
LINKS=PASS — 25 pages crawled, 0 broken
PROVENANCE=PASS — 68 artifacts; only the 'ported' globals.css digest updated

PREVIEW_URL=(not deployed this session)
PRODUCTION_URL=(not deployed this session)
DNS=UNCHANGED
WWW=UNCHANGED
HTTPS=UNCHANGED

FOUNDER_VISUAL_ACCEPTANCE=PENDING — machine gates are green; only Jeramie can grant this
LIVE=NO
MISSION_COMPLETE=BUILD+COURTS COMPLETE; DEPLOY WITHHELD PENDING FOUNDER SIGN-OFF

## Defects found and fixed this session
1. 10 serious WCAG contrast violations (steel #607d98 measured 4.19-4.44:1) -> --v2-steel-ink #7391ad, >=5.11:1
2. Receipt card clipped at all 11 widths (+22 to +228px) -> on-screen 21-52px inside everywhere
3. Hero copy collided with foundry below 1440 (-10 to -258px) -> chips retire <90rem, hero stacks <84rem
4. "Work with Neuruh" CTA off-screen on mobile (x=454 in a 390px viewport) -> nav wraps, CTA always visible
5. /truth/*.json 404 — verifiability claim broken -> published to served tree + drift gate in verify chain
6. All 18 routes canonicalized to the homepage -> per-route canonicals
7. Scene autoplay with no pause control (visitor-walk P1 AUTO-01/CTRL-01) -> keyboard-operable pause, honors OS preference

## Accepted, not fixed
- One Next/Turbopack vendor chunk embeds the worktree directory name (no username, no secret); a Vercel build would not carry it.
- /accessible is sitemapped while canonicalizing to / — correct for an alternate rendering.
