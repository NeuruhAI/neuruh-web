# DESIGN LOCK — Neuruh.com v1.0

```yaml
product: Neuruh.com
version: 1.0
locked_at: 2026-07-31
approved_by: [Jeramie Hicks]

approved_direction:
  name: A — Biological-Architectural
  recipe_id: NEURUH-COM-A-2026-07-31
  prototype_url: https://claude.ai/design/p/817b3b32-c07b-47f8-b48c-6a677d9766ad?file=prototype%2Findex.html
  acceptance_screenshots:
    - receipts/stage4-accept-01-arrival.png
    - receipts/stage4-accept-04-signature-trace.png
    - receipts/stage4-accept-06-governance-gating.png
    - receipts/stage4-accept-tier0-no-webgl.png

tokens:
  source: Neuruh Master Design System 232e13cb-bfbc-44c8-92b9-4247db24f2b6
  local: exports/design-system/
  version: 1.0

components:
  source: exports/design-system/css/
  required_states:
    [dormant, loading, partial, verified, review, contradiction,
     stale, unavailable, unsupported, blocked, failed]

spatial_scene:
  source: exports/prototype/scene.js
  contract: exports/prototype/SCENE_CONTRACT.md
  asset_manifest: exports/prototype/ASSET_MANIFEST.yaml
  camera_contract: SCENE_CONTRACT.md §2 — five named positions, dolly and rack-focus only
  interaction_contract: SCENE_CONTRACT.md §5–6
  fallback_contract: SCENE_CONTRACT.md §4, §8, §9, §10

motion:
  source: exports/design-system/tokens/motion.css
  vocabulary: [recognition, organization, contradiction, gating, execution, receipt, adaptation]
  reduced_motion_contract: SCENE_CONTRACT.md §8 — a route, not disabled animation

responsive:
  breakpoints: ["<48rem", "≥48rem", "≥76rem", "≥96rem"]
  desktop_contract: tier 3/2, bounded ±35° drag, rack-focus transitions
  mobile_contract: tier 1, no drag, no DoF, scroll-driven chapters only

copy:
  hierarchy_source: exports/prototype/index.html — DOM is the source of truth
  prohibited_claims:
    - any live counter or real-time activity indicator
    - any confidence value without its interval
    - any claim without a reachable provenance path
    - any capability the system does not possess

change_control:
  material_change_requires: [product_owner, design_owner, technical_owner]
  implementation_agent_may_improvise: false
```

---

## What is locked

**The direction.** A — Biological-Architectural. Selected by Jeramie Hicks on
2026-07-31 from three materially different worlds. B and C are preserved intact
in `exports/directions/` and in Claude Design project `7b1c1f6d`; they are
assets, not discards.

**The eight chapters and their bindings.** Chapter → state → camera is declared
in the DOM and enumerated in `SCENE_CONTRACT.md §1–3`. Reordering chapters is a
content edit. Adding a ninth chapter is a material change.

**The scene state machine.** Eight states, and the property table that defines
them. A renderer may implement them however it likes; it may not add a state or
change what a state means.

**The camera language.** Dolly and rack-focus. **Orbit is forbidden** — it is
Direction B's language and using it here breaks the claim that you are inside
the tissue.

**The signature interaction.** Trace the evidence channel, six hops, each with
real provenance, ending in a receipt that leaves the channel green.

**The four routes.** Tier 3/2/1/0 plus the reduced-motion route. All are
designed; none is a degradation message. Tier 0 keeps every word of copy.

**The trust semantics.** `--status-*` and `--authority-*` are brand-level law.
Verticals override `--vertical-accent` and nothing else.

**The performance budgets.** Tokenised in `scene.css`, enforced in CI per
TD-007. Breaching a budget is a material change requiring all three owners.

## What is explicitly NOT locked

Stated so the lock is not read as broader than it is.

- **The renderer.** SVG in the prototype, R3F in production. The contract is
  renderer-agnostic by design.
- **Theatre.js.** Deferred to spike 4, with a stated bias against adoption.
- **The transmissive layer count.** Spike 1 sets it. The design lock accepts any
  of the three spike outcomes; it does not accept shipping without running it.
- **Final asset topology.** The manifest is a budget specification, not an
  inventory. No asset has been authored or measured.

## The one condition that reopens the direction

If spike 1 shows that **not even one live transmissive layer** holds frame
budget on a discrete GPU, transmission — Direction A's entire material argument
— is unavailable in production. That is the single outcome that puts the A/B/C
decision back on the table rather than being absorbed as a fallback.

It must be escalated, not quietly worked around. Shipping a Direction A with no
transmission would be exactly the "silently simplify the approved vision"
failure the operating contract forbids.

## Implementation authority

Constitution rule 4: **production agents do not redesign after design lock.**

An implementation agent may choose data structures, file layout, component
decomposition, test strategy and build tooling. It may not change colour
semantics, motion vocabulary, state meanings, camera language, chapter
sequence, copy hierarchy, or any performance budget. Those require the three
named owners.
