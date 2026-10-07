# LEVEL 2 — DESIGN AND HARDENING PASS — 2026-09-14

Baseline before the pass: `fable/neuruh-public-launch-20260823` @ `5ab3690` (clean). Result: `6afea08`, deployed to production as `dpl_5z3syMArbWnm4EcPQdGHwwXPBJ1d`, verified live.

## Design canon sources
See `docs/commercial/DESIGN_CANON_PHASE2_20260914.md`. In precedence: ART_DIRECTION_V2 lock (2026-08-24; carbon/steel/ice, brass ≤5%, Archivo/Inter/JetBrains Mono for proof metadata only, prohibited list), HERO_CONCEPT_DECISION, design-studio DESIGN_LOCK v1.0 (Direction A, 2026-07-31; mono is licensed, light is earned, eleven states, reduced motion is a route), master design system laws, the brand-token packages `globals.css` imports, and the live v2 vocabulary (`.sec`, `.v2-btn`, OffersGrid cards). Nothing purple, no neon, no glow on cards, no terminal aesthetic on non-proof surfaces.

## Visual changes
- `components/top10/Top10Product.module.css` rewritten onto the v2 family: `--v2-bg-0/1`, `--v2-surf-1/2`, `--v2-line-1/2`, `--v2-text/silver/muted/ice`; brass only on the single primary CTA; 12px card radius, 7px button radius, `--v2-shadow-soft`; Archivo headings; mono only for eyebrows, status badges, prices-as-data, digests, stage labels. The recovered standalone palette (`#0b0d0f`, white buttons, zero radius, `ui-monospace` stack) is gone.
- Catalog cards, hero fact tiles, journey strip, example block, evidence rows, demo panel, and commercial ladder share one geometry across all twelve routes.

## UX / information-architecture changes
- Product pages now answer, in order: title → one-sentence outcome → who it is for → price (with status) → turnaround → status badge → CTA → how buying works → the problem → what happens → what you provide → what you receive → an illustrative example (labeled "not a customer result") → typical use cases → why you can trust it (real vs demonstration + dated evidence) → browser demonstration → next step CTA → related product → commercial ladder behind a disclosure.
- Index: grouped by six buyer-language categories with a one-line descriptor each; every card shows outcome, price, and checkout status ("Live checkout" / "Order by email" / "Quoted"); all ten remain visible.
- `/harnesses`: "We test whether an AI system actually works." Buyer-language lifecycle (thirteen stages, each explained without internal names), demo explained before it runs, harness inventory in plain language with honest status labels.
- Header "Explore" and footer "Company" now reach `/products/top10` and `/harnesses`.

## Mobile changes
- Every header control (brand, primary links, Explore, Work with us, menu items) ≥ 44px; foundation `.n-btn` ≥ 44px; every `<summary>` ≥ 44px; standalone `.v2-link` ≥ 44px; inline text links ≥ 24px (WCAG 2.5.8) via padded hit boxes that keep line rhythm; demo file input ≥ 44px.
- Contact ledger reused a numeric `nowrap` rule for prose and overflowed 150px at 1024px; a prose modifier wraps it.
- Grids collapse: 4→2→1 (journey), 6→3→2→1 (timeline), 8→4→2 (ladder); CTAs go full-width under 480px.

## Desktop changes
- Section rhythm and container width follow `.sec` and `--v2-maxw` (82rem); heroes hold headings to 20ch and ledes to 60ch; three-tile fact rows under every hero; consistent hairline dividers.

## Accessibility changes
- Mono label floor raised to 0.6875rem (11px) site-wide (module CSS, `globals.css` `.mlbl`, `.ptag`, `.f-gate .gsub`, OffersGrid and Commercial modules).
- Focus ring (`--focus-ring`) on every interactive element in the module; keyboard reaches the product CTA in 9 tabs (skip link → header → back link → CTA).
- Stage list is `aria-live="polite"`; reduced motion collapses the harness animation to an instant result; catalog hover transform disabled under reduced motion.
- axe court: 0 serious/critical across 41 routes × 2 viewports after the pass (24 serious contrast failures were found on the recovered CSS earlier in the day and fixed then).

## Performance
- Commercial routes ship ~620 KB raw JavaScript (10 scripts) — the Next/React runtime plus one client island (`ProductDemo`). No Three.js on any commercial route (homepage is also ~624 KB raw; the spatial scene is not loaded there). Fonts are self-hosted via `next/font`. No new images. Static export; no server work per request. Not measured with Lighthouse in this pass; recorded as a limitation.

## Commercial CTA changes
- Followed on production: three Stripe cashiers (Dossier $499, Data Rescue $299, Workflow Sprint $1,250) HEAD 200, never opened for payment; seven contact intakes 200 with the product carried into a prefilled mailto (driven in headless Chromium at 1440 and 390). CTA labels for non-cashier products read "Order … by email" / "Request …". No payment link manufactured.

## Security / boundary changes
- Verify chain green: truth, truth-served, typecheck, 50 unit, provenance 68, boundaries, private-IP (source + prerendered commercial HTML), checkout-links (3 cashiers only, live), build, dead-links (47 pages, 2,308 refs, 0 broken), 20 artifact tests. gitleaks clean on every commit. No `dangerouslySetInnerHTML`, `eval`, or `process.env` in commercial surfaces; `?product=` is matched against the static catalog only; path-traversal and NUL probes return 404.

## Error-state changes
- `app/error.tsx` route boundary (plain statement, retry, two exits, no stack). `not-found.tsx` rewritten in buyer language with Top 10 / offers / home exits. Unknown `?product=` renders an intentional "not one we sell" state. Unknown slug 404 by `dynamicParams=false`.

## Test results (local, final tree)
| Court | Result |
|---|---|
| `npm run verify` (full chain) | exit 0 |
| `scripts/ux-court.mjs` 19 routes × 8 viewports | PASS 152/152 (from 215 findings at the first run) |
| `scripts/a11y-court.mjs` 41 routes × 2 viewports | PASS, 0 serious/critical |
| `npm run test:smoke` | 13/13 |
| Zero-dollar commercial court | 57/57 (see FIRST_SALE_READINESS) |

## Browser results
Curated screenshots: `receipts/ux-court/keep/` (1440, 768, 390, 320 across home, index, three primary products, harness). Full capture (152 PNG) generated locally, gitignored.

## Production results
- `https://neuruh.com` serves `dpl_5z3syMArbWnm4EcPQdGHwwXPBJ1d`, Vercel meta `githubCommitSha 6afea08933cbbbae5423a694d5c538307bbca9a4`; truth signature `4d8033b1…` matches the committed one.
- 14/14 required routes 200; unknown slug 404; UX court against production PASS 128/128 (16 routes × 8 viewports); harness demo on production: 13 stages → REJECT, 64-hex digest, 0 console errors, no overflow at 1440 or 390.
- Vercel runtime errors since deploy: 0.

## Deployment SHA
`6afea08933cbbbae5423a694d5c538307bbca9a4` → `dpl_5z3syMArbWnm4EcPQdGHwwXPBJ1d`.

## Known limitations
- No Lighthouse/CWV measurement in this pass; JS payload recorded raw, not gzipped.
- Homepage, /offers, /proof and other pre-existing routes were courted (overflow, targets, labels, a11y) but not redesigned; only shared controls were hardened.
- Still no webhook/order system; fulfillment is founder-manual; no customer has paid (PAID_CUSTOMER_PROOF: NONE).
