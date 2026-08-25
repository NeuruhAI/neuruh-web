# Neuruh tract recovery receipt — 2026-08-25

BASE_SHA=`d717ab8f2b34308eb03d3a2127c3b5df46e3c9af`
RECOVERY_BRANCH=`recovery/neuruh-tract-cache-20260825`
RECOVERY_SHA=`9efb7e659ef84322c6d1de51bc62921617bae18d`

CACHE_EVIDENCE_ROOT=`.recovery/tract-cache/`
CACHE_AUTHORITY=`.recovery/tract-cache/extracted/`

MODULES_RECOVERED=51 turbopack module bodies (twin, stage, libs, atlas, brand, ui, content) plus compiled CSS tokens
MODULES_RECONSTRUCTED=`app/layout.tsx`, `app/page.tsx`, `app/globals.css` (source form), Next/Tailwind scaffold
UNCERTAIN_MODULES=`app/layout.tsx`, `app/page.tsx`, `app/globals.css` source form, TypeScript types (`@ts-nocheck`), atlas routes `/products` `/proof` `/build` (not recovered)

LOCAL_URL=`http://localhost:43147/`

Chosen generation: gzip cache `006_25000939ed2586f7_0` (stage/WebGL, PCF-only, Redraw the tract) + `049_f78c13ba7e06cc00_0` (UI with ActionDeskCard). Rejected ContactShadows/SoftShadows and Galaxy/PROOF STRATA.

Visual verification: light Harbor Church tract rendered locally. SYN-NC-4417, farmhouse, Story/Reality, 13-stage nav, ACTION DeedSonar overlay, Receipt explode all observed in the browser.

DO_NOT_MERGE=YES
DO_NOT_DEPLOY=YES

See `docs/recovery/TRACT_CACHE_MODULE_LEDGER.md` for per-module cache provenance.
