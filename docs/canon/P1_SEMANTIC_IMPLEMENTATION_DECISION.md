# P1 Semantic Implementation Decision

Decision date: 2026-08-01. Status: accepted for the local semantic phase.

## Decision

Replace the deleted generic eight-chapter marketing narrative with the eleven-record Neuruh
Alive experience map while preserving the eight-state renderer as an implementation boundary.
The public truth layer is a checked-in `VERIFIED_SNAPSHOT`, not a live feed. Its signature file
contains deterministic SHA-256 checksums and explicitly is not an identity signature.

## Architecture

- `packages/public-truth/` owns validation, privacy stripping, canonical JSON, freshness,
  state transitions, fixtures, and compilation.
- `public/truth/` contains the deterministic compiled snapshot, event stream, and checksum file.
- `packages/public-truth/client.ts` is the typed read client; it has no connector or write API.
- `packages/public-truth/experience.ts` is the data-defined flagship architecture.
- Semantic route components remain WebGL-free. Only the existing SceneBoundary may request the scene.
- Living states map to existing renderer states through a declared adapter; no renderer state is added.

## Number and staleness rulings

Bare numeric leaves are rejected. A metric must provide classification, unit, `as_of`, and
`source_ref`. The fixture declares `stale_after`; compilation at an injected evaluation time
after that timestamp fails closed. No wall clock is written into deterministic artifacts.

## Supersession boundary

The semantic chapter/content portion of `decisions/DESIGN_LOCK.md` is superseded by the explicit
Neuruh Alive phase authorization. Direction A materials, `trs=0.75`, two membranes, camera law,
tier boundary, motion rules, token semantics, and budgets are not superseded.

## Gate ruling

This decision does not rerun or bypass G1, certify G2, authorize P3 scene work, deploy, create a
Vercel project, touch DNS/GoDaddy, or attach a private production connector.

