# Production Performance Budgets — Neuruh.com Direction A

Source of law: `exports/design-system/tokens/scene.css` (budgets are design tokens, reviewable as design decisions). This file adds the sub-budget split the spike measurements make possible, and the CI enforcement spec (TD-007: a budget breach fails the build; changing a budget requires all three owners).

## Frame time (GPU-timer p95, per device class)

| Route | Budget | Spike evidence |
|---|---:|---|
| Tier 3 desktop, any bound state/camera incl. worst-case envelope | ≤ 16.7 ms | 14.11 ms at trs=0.75 on M1; 13.3–13.85 ms at trs=1.0 (rejected on memory) |
| Tier 3 reduced-motion route | ≤ 16.7 ms | 19.17 ms at trs=1.0 — the binding reason reduced-motion must be re-validated at 0.75 |
| Tier 2 desktop integrated | ≤ 16.7 ms | baked 4-sheet: 4.22 ms |
| Tier 1 mobile | ≤ 22 ms | baked 3-sheet: 1.64 ms on M1 (mobile devices pending) |

## Scene memory (analytic estimate: textures + geometry + render targets)

| Item | Budget |
|---|---:|
| Total scene memory, tier 3 | ≤ 220 MB |
| — transmission render target at DPR 2, trs=0.75 (fixed cost of the material policy) | ~118 MB |
| — remaining envelope for ALL production assets (geometry, KTX2 textures, HDRI) | **≤ 80 MB** hard sub-budget, ~20 MB slack held back |
| Draw calls | ≤ 120 (spike scene: 8–16) |
| Triangles, tier 3 authored | per ASSET_MANIFEST.yaml: 180k hero LOD0; instancing mandatory |

The 80 MB asset sub-budget is the number Spike 5 (asset pipeline) must be planned against. It exists because the founder-approved material policy pre-commits ~118 MB; full-resolution transmission (210 MB) was rejected precisely because it left no such envelope.

## Payload

| Item | Budget | Spike evidence |
|---|---:|---|
| Initial payload, before ANY scene code or asset (== what tier 0 downloads in total) | ≤ 180 KB | 164.7–169.9 KB measured |
| Scene runtime chunk (three + R3F + drei + scene code), deferred, capability-gated | ≤ 260 KB gzip | ~236 KB measured — architecture requirement: capability detection lives OUTSIDE this chunk; tier 0 must download zero WebGL bytes (asserted in CI) |
| Tier-3 scene assets (glTF + KTX2, progressive, per-chapter) | ≤ 1.3 MB | unproven — Spike 5 scope |
| Web fonts (woff2 subsets, swap) | ≤ 90 KB | spike deferred fonts; production ships subsets |

## Time

| Item | Budget | Spike evidence |
|---|---:|---|
| First meaningful visual (DOM editorial paint) | ≤ 1200 ms | FCP 92–168 ms local; re-baseline on throttled network in production CI |
| First scene frame presented | ≤ 2500 ms (new, from spike data) | 600–1055 ms local |
| Shader compile stall (measured via renderer.compile + fence) | ≤ 120 ms | 6–18 ms spike scene; production shader count is larger — keep KHR_parallel_shader_compile path |
| Interaction readiness (trace clickable) | ≤ 1500 ms | interactive mark ≈ first frame + ~1 ms |

## CI enforcement (TD-007)

1. Every PR runs the smoke suite + a 3-row benchmark subset (tier-3 shipping config, reduced-motion, tier-0 parity) on a pinned runner; full matrix nightly.
2. Budgets live in one JSON consumed by both the site (tokens) and CI; a breach fails the build with the measured value in the failure message.
3. A deliberate-regression test proves the gate can fail (per handoff §5): CI must go red when a 30 MB dummy texture or a `layers=4&trs=1` config is introduced on a canary branch.
4. GPU-timer p95 is the gated number. rAF-based metrics are recorded but never gate — vsync pins them.
5. Every benchmark run refuses software rasterisers (already implemented in `tests/measure.ts` — port as-is).
