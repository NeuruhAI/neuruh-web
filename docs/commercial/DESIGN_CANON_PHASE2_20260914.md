# DESIGN CANON — LEVEL 2 POLISH — SOURCES (2026-09-14)

Nothing in the Level 2 pass invents a visual decision. Every value below is traced to an existing, committed specification. Where two sources overlap, the later lock (2026-08-24) governs the public site; the 2026-07-31 lock governs laws the later one does not restate.

## Governing sources, in precedence order

| # | Source | Location | What it establishes |
|---|---|---|---|
| 1 | **NEURUH ART DIRECTION V2 — LOCK (2026-08-24)** | `docs/design/ART_DIRECTION_V2.md` | CARBON · STEEL · ICE with a single restrained brass accent (≤5% emphasis: primary CTA, authority gate, nothing else). Token family bg0 `#07090D`, bg1 `#0B1016`, surf1 `#101720`, surf2 `#151E28`, line1 `#1C2836`, line2 `#2A3A4C`, steel `#607D98`, blue `#6E9FC5`, ice `#A9D3E8`, silver `#C5CED8`, text `#F2F5F7`, muted `#9AA8B6`, brass `#AA8745`/`#C9A557`, ok `#3A9188`. Type: Archivo display / Inter body / JetBrains Mono for proof metadata only. Prohibited: muddy brass, purple AI gradients, neon, terminal aesthetic on non-proof surfaces, generic equal-card wall, jargon-first surfaces. Layering law: plain-language value first, "what is proven" second, receipts/SHAs/courts behind disclosures. |
| 2 | **Hero concept decision (2026-08-24)** | `docs/design/HERO_CONCEPT_DECISION.md` | Homepage hero = A "Decision Foundry"; "How it works" = C five-bay machine. Untouched by Level 2. |
| 3 | **DESIGN LOCK — Neuruh.com v1.0 (2026-07-31), Direction A "Biological-Architectural"** | `~/neuruh-repos/NeuruhAI/neuruh-design-studio/DESIGN_LOCK.md`, `decisions/D004-direction-a-locked.md` | Two spines (obsidian/bone); monospace is licensed for machine evidence and the `.n-label` eyebrow only; light is earned (glow only for verified evidence, granted authority, executing operation, hero object); depth means something; eleven states that cannot lie; reduced motion is a route not a disabled animation; native scroll, no scroll-jacking; touch tier has no drag. |
| 4 | **Master design system v1.0 laws** | `neuruh-design-studio/exports/design-system/readme.md` | Forbidden defaults (terminal aesthetic, AI gradient, glass cards everywhere, particles, KPI tile walls, raw JSON in executive views, fake live activity). Radius scale `--radius-xs 2px … --radius-xl 16px`, `--radius-round` for status dots only. |
| 5 | **Brand token packages (imported by `globals.css`)** | `packages/brand-tokens/{color-primitives,color-semantics,typography,space,material,motion,state}.css`, `packages/ui-foundation/{core,evidence,authority}.css` | `--font-display/--font-sans/--font-mono`, `--type-*` roles, `--space-*` scale, `--focus-ring` (`--ring-focus-dark`), `--text-faint` floor `#7b8799` (5.11:1), `.n-label`, `.n-btn`, `.n-card`. |
| 6 | **Live v2 implementation** | `apps/neuruh-web/app/globals.css` (`--v2-*` tokens, `.sec`, `.sec-eyebrow`, `.sec-h`, `.sec-sub`, `.sec-alt`, `.v2-btn{,-primary,-secondary,-ghost}`, `.v2-link`, `.hdr`), `components/OffersGrid.module.css` (card: `surf-1` fill, `line-1` hairline, radius 12px, `--v2-shadow-soft`, mono eyebrow, ice price) | The proven commercial component vocabulary the Top 10 layer must reuse. |
| 7 | **Founder visual acceptance + a11y courts** | commits `c4f71eb` (founder visual acceptance pass), `beda3e1` (PROOF STRATA hero, carbon/steel/ice), `9648319` (visual/a11y/public-truth seams); `scripts/a11y-court.mjs`; Playwright `production.smoke.spec.ts` (390px CTA court) | What "accepted" looks like and the courts that guard it. |

Explicitly **not** a source: the two Top 10 markdown codices (`COMMERCIALIZATION_TOP10_BIBLE.md`, `TOP10_SALES_PLAYBOOK.md`) carry commercial intent, not visual law. The recovered `Top10Product.module.css` (commit `d101b0ee`) was an unsanctioned palette (`#0b0d0f` ground, `#f2f0e9` bone text on obsidian, zero radius, `ui-monospace` system stack for prose labels, white CTA buttons) and is superseded by this pass.

## Decisions applied in Level 2 (each traced)

| Decision | Source |
|---|---|
| Top 10 and harness surfaces use `--v2-bg-0/1`, `--v2-surf-1/2`, `--v2-line-1/2`, `--v2-text/silver/muted`, `--v2-ice`, brass only on the single primary CTA | 1, 6 |
| Headings in `--font-display` (Archivo); body in `--font-sans`; `--font-mono` only for eyebrows, status badges, prices-as-data, digests, receipts, stage labels | 1, 3, 5 |
| Cards: `--v2-surf-1` fill, `--v2-line-1` hairline, radius 12px, `--v2-shadow-soft`; buttons `.v2-btn*` radius 7px; no glass, no glow on cards | 4, 6 |
| Section rhythm `.sec` padding `clamp(3.6rem, 8vh, 6.5rem)`, container `--v2-maxw` 82rem, reading measure ≤ 68ch | 5, 6 |
| Muted text floor ≥ `#98a2b6` (≥ 5:1 on `#0b1016`); focus ring = `--focus-ring` everywhere | 5 |
| Buyer-language first, internal names behind the "Evidence" and "Commercial ladder" disclosures | 1 (layering law), 3 (copy hierarchy) |
| Status labels are text + border treatment, never colour alone | 3, 4 (law 6) |
| Reduced motion respected: the harness stage animation collapses to an instant result under `prefers-reduced-motion` | 3 |
| Touch targets ≥ 44px on every interactive element at ≤ 430px | 3 (mobile contract), Playwright 390px court |
