# neuruh-web

Canonical repository for **Neuruh.com** — Direction A (Biological-Architectural), public-truth-driven.

State as of 2026-08-23: public launch authorized by founder constitution
(`decisions/PUBLIC_LAUNCH_AUTHORIZATION_20260823.md`). The site renders exclusively from the compiled
public-truth snapshot (`packages/public-truth`), with claim classes, source refs, dated numbers, and a
`/refusals` page stating what is not claimed. G1 device validation and G2 renderer certification remain
open and are disclosed on `/proof`.

```bash
npm ci
npm run verify        # truth determinism · typecheck · tests · provenance · boundaries · build · artifacts
npm run test:smoke    # Playwright against a running `npm run start` (port 4311)
node scripts/visual-court.mjs <outDir>   # screenshot court across routes and viewports
```

Truthfulness rules: every number carries `{value, classification, unit, as_of, source_ref}`; `LIVE`
truth mode is unused (no live connector is attached); fixture data is labeled fixture; the privacy
pass rejects private paths and secrets at compile time.
