# Tract cache module ledger

Recovery authority: `.recovery/tract-cache/extracted/`

Printable Chromium Simple Cache dumps in that directory identify modules and generations. Many bodies are gzip after the cache header, so recoverable TypeScript was decoded from matching hashes in the sibling Cursor cache:

`/Users/jeramiehicks/Desktop/NEURUH_TRACT_CURSOR_WORKSPACE_RECOVERY_20260825_090947/cache_hits/`

The original running app was `http://127.0.0.1:43147/` (Next.js Turbopack development).

## Chosen generation (LATEST coherent light tract)

Do **not** use earlier ContactShadows / SoftShadows stage chunks. Do **not** use UI chunks that lack `ActionDeskCard`.

| Role | Cache file (workspace extract) | Turbopack URL | Markers |
| --- | --- | --- | --- |
| Stage / WebGL LATEST | `006_25000939ed2586f7_0` (gzip-clean). Printable `070_5da17625d5748c10_0` is the same later generation, not gzip-clean. | `_0y6q24r._.js` | PCF-only, no ContactShadows/SoftShadows, `Redraw the tract`, `lib/twin/gpu.ts`, `webglcontextlost`, `StageFault` |
| Twin UI LATEST | `049_f78c13ba7e06cc00_0` | `_0wigrff._.js` | `ActionDeskCard`, Harbor Church, SYN-NC-4417. HTML page loads this chunk. |
| Chrome / atlas / content | `030_a1c8e17320d76895_0` | chrome chunk | `SiteHeader`, brand, ui, content |
| Compiled CSS tokens | `010_3bbff1177acf59be_0` | `[root-of-the-server]__0y8lf9j._.css` | light `:root` `--ink: #f4f6f8`, `--bone: #14181c`, `--copper: #2c5d86`, theater `#9eb6c8` |
| Page HTML / RSC | `042_c81ad8a13707246d_0` | `/` | title, skip link, `SiteHeader`, `main#content`, `Theater` / `Home` |

### Rejected generations

| Generation | Cache files | Why rejected |
| --- | --- | --- |
| Earlier stage | gzip `008`; printable `064` / `089` | ContactShadows + SoftShadows (shader-crash generation) |
| Mid stage | gzip `002`, `014`, `028`, `040`, `075` | ContactShadows + PCF; some still import `stage/ActionDesk.tsx` |
| Earlier UI | gzip `011` | DemoChrome present, no ActionDeskCard |
| Mid UI | gzip `050` | annotations + stage-geometry, no ActionDeskCard |

## Module table

CONFIDENCE: HIGH = gzip-decoded turbopack module body with original path. MEDIUM = recovered body plus a mechanical decompile patch (export keyword, leftover `});`). LOW = reconstructed from HTML/RSC/CSS, not a turbopack module body.

| SOURCE_PATH | CACHE_FILE | MODULE_IDENTIFIER | RECOVERABLE_BODY | CONFIDENCE | NOTES |
| --- | --- | --- | --- | --- | --- |
| `components/twin/ActionDeskCard.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/ActionDeskCard.tsx [app-client] (ecmascript)` | YES | HIGH | LATEST. Absent from `011`/`050`. DeedSonar desk overlay on ACTION. |
| `components/twin/DemoChrome.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/DemoChrome.tsx [app-client] (ecmascript)` | YES | HIGH | Story/Reality, Previous/Next, scrubber. Also in earlier UI chunks. |
| `components/twin/InspectDock.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/InspectDock.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/NeuruhThread.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/NeuruhThread.tsx [app-client] (ecmascript)` | YES | HIGH | 13-stage thread. |
| `components/twin/OrganStrip.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/OrganStrip.tsx [app-client] (ecmascript)` | YES | HIGH | Reality clothing controls. |
| `components/twin/ParcelTwin.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/ParcelTwin.tsx [app-client] (ecmascript)` | YES | MEDIUM | Decompiler left extra `});` after nested functions; stripped. Dynamic `StageCanvas` with `ssr: false` and “Compiling Harbor Church tract”. |
| `components/twin/Theater.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/Theater.tsx [app-client] (ecmascript)` | YES | HIGH | Keyboard Story/Reality, stage nav. |
| `components/twin/TwinProvider.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/TwinProvider.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/WorkPanel.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/twin/WorkPanel.tsx [app-client] (ecmascript)` | YES | MEDIUM | Extra `});` after some scene work functions; stripped. |
| `components/twin/stage/Annotations.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/Annotations.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/stage/CameraRig.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/CameraRig.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/stage/Evidence.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/Evidence.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/stage/ExplodeGroup.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/ExplodeGroup.tsx [app-client] (ecmascript)` | YES | HIGH | Receipt explosion. |
| `components/twin/stage/HarborScene.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/HarborScene.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/stage/House.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/House.tsx [app-client] (ecmascript)` | YES | HIGH | Farmhouse from `HOUSE` geometry. |
| `components/twin/stage/LayerTab.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/LayerTab.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/stage/RecipeCage.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/RecipeCage.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/stage/StageCanvas.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/StageCanvas.tsx [app-client] (ecmascript)` | YES | HIGH | PCFShadowMap, `Redraw the tract`, context-lost. Also identified in printable `070`. |
| `components/twin/stage/Studio.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/Studio.tsx [app-client] (ecmascript)` | YES | HIGH | Sky only. Earlier gens imported ContactShadows/SoftShadows. |
| `components/twin/stage/Terrain.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/Terrain.tsx [app-client] (ecmascript)` | YES | HIGH | Parcel, pines, oaks, fence. |
| `components/twin/stage/ThreadSpine.tsx` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/ThreadSpine.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/stage/motion.ts` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/motion.ts [app-client] (ecmascript)` | YES | HIGH | |
| `components/twin/stage/textures.ts` | `006_25000939ed2586f7_0` | `[project]/components/twin/stage/textures.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/twin/annotations.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/annotations.ts [app-client] (ecmascript)` | YES | HIGH | Also present in stage chunks. |
| `lib/twin/epistemic.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/epistemic.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/twin/gpu.ts` | `006_25000939ed2586f7_0` | `[project]/lib/twin/gpu.ts [app-client] (ecmascript)` | YES | MEDIUM | Not in the mission hard graph. Comment ate `export`; restored `export function gpuIsSoftware`. Keep — latest WebGL recovery. |
| `lib/twin/inspect.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/inspect.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/twin/machine.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/machine.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/twin/organ-cloth.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/organ-cloth.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/twin/property.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/property.ts [app-client] (ecmascript)` | YES | HIGH | `HARBOR_TRACT`, SYN-NC-4417, Harbor Church tract, 12.4 ac, Pender. |
| `lib/twin/query.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/query.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/twin/stage-camera.ts` | `006_25000939ed2586f7_0` | `[project]/lib/twin/stage-camera.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/twin/stage-geometry.ts` | `049_f78c13ba7e06cc00_0` (also in stage `006`) | `[project]/lib/twin/stage-geometry.ts [app-client] (ecmascript)` | YES | MEDIUM | Comment ate `export` on `PARCEL`; restored. 1 unit ≈ 90 ft. |
| `lib/twin/stage-visual.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/stage-visual.ts [app-client] (ecmascript)` | YES | HIGH | `RECEIPT_STACK`. |
| `lib/twin/stages.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/twin/stages.ts [app-client] (ecmascript)` | YES | HIGH | world → calibration (13 scenes). |
| `components/atlas/ProofBadge.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/atlas/ProofBadge.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/atlas/SiteHeader.tsx` | `030_a1c8e17320d76895_0` | `[project]/components/atlas/SiteHeader.tsx [app-client] (ecmascript)` | YES | HIGH | Also visible in HTML `042`. |
| `components/brand/Mark.tsx` | `030_a1c8e17320d76895_0` | `[project]/components/brand/Mark.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/brand/Wordmark.tsx` | `030_a1c8e17320d76895_0` | `[project]/components/brand/Wordmark.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/ui/button.tsx` | `030_a1c8e17320d76895_0` | `[project]/components/ui/button.tsx [app-client] (ecmascript)` | YES | HIGH | Cache used `import * as Slot` + `Slot.Root`. |
| `components/ui/input.tsx` | `049_f78c13ba7e06cc00_0` | `[project]/components/ui/input.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/ui/sheet.tsx` | `030_a1c8e17320d76895_0` | `[project]/components/ui/sheet.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `components/ui/tooltip.tsx` | `030_a1c8e17320d76895_0` | `[project]/components/ui/tooltip.tsx [app-client] (ecmascript)` | YES | HIGH | |
| `lib/content/commercial.ts` | `030_a1c8e17320d76895_0` | `[project]/lib/content/commercial.ts [app-client] (ecmascript)` | YES | HIGH | Atlas inventory, not tract geometry. |
| `lib/content/demo.ts` | `049_f78c13ba7e06cc00_0` | `[project]/lib/content/demo.ts [app-client] (ecmascript)` | YES | HIGH | `djb2`, synthetic disclaimer. |
| `lib/content/index.ts` | `030_a1c8e17320d76895_0` | `[project]/lib/content/index.ts [app-client] (ecmascript)` | YES | HIGH | `ATLAS`, `NAV`. |
| `lib/content/loop.ts` | `030_a1c8e17320d76895_0` | `[project]/lib/content/loop.ts [app-client] (ecmascript)` | YES | HIGH | Recovered; homepage Theater does not import it. |
| `lib/content/primitives.ts` | `030_a1c8e17320d76895_0` | `[project]/lib/content/primitives.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/content/products.ts` | `030_a1c8e17320d76895_0` | `[project]/lib/content/products.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/status.ts` | `030_a1c8e17320d76895_0` | `[project]/lib/status.ts [app-client] (ecmascript)` | YES | HIGH | |
| `lib/utils.ts` | `030_a1c8e17320d76895_0` | `[project]/lib/utils.ts [app-client] (ecmascript)` | YES | HIGH | |
| `app/globals.css` | `010_3bbff1177acf59be_0` | compiled CSS, not original source | PARTIAL | LOW | Tokens and custom classes recovered from compiled CSS. `@import "tailwindcss"` / `@theme` reconstructed. Dark Galaxy tokens were **not** used as `:root`. |
| `app/layout.tsx` | `042_c81ad8a13707246d_0` | inferred from HTML + RSC; no turbopack module body | NO | LOW | Geist / Geist Mono / Instrument Serif variables, skip link, `SiteHeader`, `TooltipProvider`, `bg-ink text-bone`. |
| `app/page.tsx` | `042_c81ad8a13707246d_0` | RSC stack `Home` → `Theater` | NO | LOW | `<main id="content"><Theater /></main>`. |
| `app/products`, `app/proof`, `app/build` | not in cache as page modules | — | NO | — | Header links exist. Pages were not recovered. Not required for the tract homepage. |

## Decompile notes

Turbopack development output was converted with `jsx`/`jsxs` from `react/jsx-runtime` (valid TSX). Types were erased; files carry `@ts-nocheck`.

Mechanical patches (not redesign):

1. Restore `export` on `PARCEL` and `gpuIsSoftware` where a leading comment swallowed it.
2. Strip leftover `});` after nested function bodies.
3. Keep `import * as Slot from "@radix-ui/react-slot"` so `Slot.Root` resolves.

## Visual proof (2026-08-25)

Ran locally at `http://localhost:43147/`. Confirmed light `#9eb6c8` stage, SYN-NC-4417, Harbor Church tract, farmhouse, Story/Reality, 13-stage nav, ACTION DeedSonar desk, Receipt explode. Not the dark PROOF STRATA / Galaxy site.
