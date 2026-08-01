# Security Advisory Disposition

Audit command: `npm audit --json --package-lock-only`, 2026-08-01. npm reports four high
vulnerable dependency nodes; the unique advisory set is three PostCSS advisories (one moderate,
two high) and one high sharp/libvips advisory. No forced audit fix or downgrade was applied.

| Package / advisory | Transitive path | Exposure and shipped route | Fix | Action |
|---|---|---|---|---|
| `postcss@8.4.31` / GHSA-qx2v-qp2m-jg93 (moderate) | `next@16.2.12 -> postcss` | Trusted repository CSS at build/dev; no runtime CSS ingestion. Shared styles affect all routes but no route accepts attacker CSS. | PostCSS 8.5.10+; Next pins older version and npm proposes a major Next downgrade. | ISOLATE / DEFER: trusted CSS only; no upload/runtime compilation; upgrade through supported Next release. |
| `postcss@8.4.31` / GHSA-6g55-p6wh-862q (high) | `next@16.2.12 -> postcss` | Build/dev source-map parsing; no untrusted CSS or `sourceMappingURL` in app/packages. No directly affected shipped route. | PostCSS 8.5.12+; no supported current Next path in this lock. | ISOLATE / DEFER with same controls; re-audit before deployment. |
| `postcss@8.4.31` / GHSA-r28c-9q8g-f849 (high) | `next@16.2.12 -> postcss` | Build/dev previous-source-map loading; no attacker-controlled CSS. No directly affected shipped route. | PostCSS 8.5.18+; npm recommends an incompatible downgrade. | ISOLATE / DEFER; no transitive override or forced fix. |
| `sharp@0.34.5` / GHSA-f88m-g3jw-g9cj (high; inherited libvips CVEs) | `next@16.2.12 -> sharp`; dev `@gltf-transform/cli@4.4.2 -> sharp` | Present in production server trace, but image optimization is disabled and no route uses image upload/processing, `next/image`, ImageResponse, or direct sharp. GLTF CLI is local build tooling for trusted assets only. | sharp 0.35.0+; current Next/CLI ranges exclude it and npm proposes destructive major downgrades. | ISOLATE / DEFER: keep optimizer disabled; trusted local assets only; monitor supported releases; consider removing unused CLI after G2/P2 tooling decision. |

Risk is accepted only for this non-deployed semantic phase. Re-audit and resolve or renew the
documented isolation decision before any preview or production deployment authorization.
