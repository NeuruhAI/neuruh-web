# P1 Semantic Verification Receipt

Date: 2026-08-01

- `npm run verify`: PASS
- Public truth: deterministic, 14 objects, 2 events
- Node contract tests: 24/24 PASS (includes original P0 7/7)
- Production artifact semantic tests: 5/5 PASS
- TypeScript: PASS
- Production build: PASS; 19 static pages generated
- Provenance: 68/68 PASS
- Boundaries: PASS; semantic and outer-boundary modules are WebGL-free
- Tier zero: estimated 170.4 KB gzip under 180 KB; zero scene implementation bytes
- Browser runtime attempt: BLOCKED_ENVIRONMENT (`listen EPERM`; Chromium Mach rendezvous denied)

The blocked browser process was not counted as a pass. The checked-in Playwright suite now
covers the semantic routes and should run on an unrestricted CI/browser runner. G1 and G2
remain outside this receipt.
