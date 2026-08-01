# Package selection — P0/P2 authorized scope

Registry verification date: 2026-08-01.

## Selected

| Package | Version | Licence | Reason |
|---|---:|---|---|
| Next.js | 16.2.12 | MIT | Proven App Router base from Spike 0 |
| React / React DOM | 19.2.8 | MIT | Proven pairing with R3F 9 |
| three | 0.185.1 | MIT | Locked spatial runtime baseline |
| @react-three/fiber | 9.7.0 | MIT | Spike 0 PASS, declarative scene graph |
| @react-three/drei | 10.7.7 | MIT | Selective helper imports only |
| TypeScript | 5.9.3 | Apache-2.0 | Proven Next 16 line; TS 7 was rejected as unproven here |
| Playwright | 1.62.1 | Apache-2.0 | Route, payload, keyboard and regression foundation |
| glTF-Transform | 4.4.2 | MIT | P2 asset-pipeline tooling; execution remains gate-blocked |

## Rejected or deferred

- Theatre.js: rejected for launch; five named positions express all eight chapters.
- Lenis: rejected; native scroll is a locked accessibility choice.
- GSAP / Motion / Rive: not adopted; no P0–P2 use case.
- Spline runtime, yFiles, WebGPU: rejected/deferred by TD-008–010.
- MeshTransmissionMaterial SSR and double-sided transmission: rejected by measured Spike 1 evidence.
- Full-resolution `trs=1.0`: rejected by the 220 MB memory budget.
- Postprocessing/DoF: not installed in the shipping runtime; Spike 2 cannot be measured or closed before G1.

## Known dependency findings

- `npm install` reports four high-severity advisories in the selected dependency tree; no force-upgrade was applied because that would change the proven majors without evidence.
- `sharp` has a gated install script and is not used by the application (`images.unoptimized=true`).
- Exported `fonts.css` references three absent TTF files. It remains byte-identical but is not loaded; the app declares an explicit system fallback pending licensed WOFF2 subsets.
