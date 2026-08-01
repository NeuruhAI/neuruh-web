# Scene Contract — Neuruh.com, Direction A

The binding interface between the DOM layer and whatever renders the scene.
The prototype implements this in SVG; the shipped build implements it in R3F.
**Swapping the renderer must not require touching the DOM layer.** If it does,
this contract has been violated.

---

## 1 · Scene state machine

Eight states, one per chapter. This table is the contract — every visual
property the scene can express is declared here and nowhere else.

| state | membrane | fragments | focus radius | channels | live channels | core | core lit | nodes | filaments |
|---|---|---|---|---|---|---|---|---|---|
| `dormant` | 0.30 | 0 | 0 | 0 | 0 | 0.25 | no | 0 | 0 |
| `fragmented` | 0.55 | 1.0 | 0 | 0.12 | 0 | 0.25 | no | 0 | 0 |
| `awakening` | 0.45 | 0.45 | 190 | 0.35 | 1 | 0.55 | no | 0.5 | 0 |
| `metabolism` | 0.30 | 0.15 | 340 | 0.85 | 4 | 0.70 | no | 1.0 | 0 |
| `vertical` | 0.22 | 0 | 300 | 0.55 | 3 | 0.60 | no | 1.0 | 0 |
| `gating` | 0.18 | 0 | 260 | 0.70 | 5 | 1.00 | **yes** | 1.0 | 0 |
| `receipt` | 0.22 | 0 | 320 | 0.55 | 2 | 0.85 | **yes** | 1.0 | 1.0 |
| `entry` | 0.30 | 0 | 240 | 0.35 | 1 | 0.70 | **yes** | 0.6 | 0.5 |

**Focus radius** is the world-space distance from the core within which tissue
cells are lit. It is the mechanism by which "recognition" is expressed without
adding an object.

**Transitions are declarative.** The state machine sets target values; the
renderer eases to them using `--dur-cinematic` / `--ease-cinematic`. No state
knows about any other state, so chapters can be reordered without code changes.

## 2 · Camera timeline

Five named positions. Chapters reference them **by name, never by index**, so
re-blocking a chapter is a content edit.

| name | scale | pivot | used by |
|---|---|---|---|
| `wide` | 1.00 | core | ch 1, 2, 8 |
| `mid` | 1.34 | core | ch 3, 7 |
| `close` | 1.85 | core | ch 4 |
| `vertical` | 1.55 | core offset (−210, −130) | ch 5 |
| `core` | 2.55 | core | ch 6 |

Transform for a pivot `(cx, cy)` at scale `s`:
`translate(cx − s·cx, cy − s·cy) scale(s)`.

Duration `--dur-camera` (1400ms), easing `--ease-cinematic`. **Dolly and
rack-focus only — never orbit.** Orbit is Direction B's language; using it here
would break the direction's central claim that you are inside the tissue.

## 3 · Chapter → state → camera binding

Declared in the DOM as data attributes, read by the runtime. The DOM is the
source of truth for sequencing.

```html
<section data-chapter="4" data-state="metabolism" data-cam="close">
```

Chapter advance is driven by `IntersectionObserver` at thresholds
`[.25, .5, .75]` with `rootMargin: -20% 0px -20% 0px`.

**Scroll is never hijacked.** This is deliberate: scroll-jacking is anti-reference
A03, and it is the most common accessibility failure among award-winning
flagship sites. Native scroll is preserved, so keyboard, screen-reader, and
assistive scroll all work without special handling.

## 4 · Quality tiers

Selected by **capability detection and user preference — never user-agent
sniffing.**

| tier | hex radius | grid | channels | membranes | fragments | soft filter | selection |
|---|---|---|---|---|---|---|---|
| 3 | 24 | 15×13 | 7 | 5 | 34 | yes | desktop, discrete GPU, >4 cores, >4GB |
| 2 | 28 | 13×11 | 6 | 4 | 26 | no | desktop, integrated GPU or ≤4 cores/GB |
| 1 | 34 | 10×9 | 5 | 3 | 18 | no | `(hover: none) and (pointer: coarse)` |
| 0 | — | — | 0 | 0 | 0 | — | no WebGL context obtainable |

Detection order: WebGL context → pointer/hover media query → `deviceMemory` and
`hardwareConcurrency`. A user override always wins over detection.

## 5 · Interactive surface

The scene takes pointer events **only** in the `metabolism` state
(`.scene.is-interactive`). At every other point it is inert and
`aria-hidden="true"`.

Channels are the sole interactive scene element:

- `role="button"`, `tabindex="0"`, `<title>` for the accessible name
- `click`, `Enter`, and `Space` all invoke the trace
- an invisible 14px-wide stroke provides the hit target; the visible stroke is 1.4–2px

## 6 · Signature interaction — trace the evidence channel

Six hops, each with real provenance. Advances on a `760ms` cadence
(`220ms` on the reduced-motion route).

| step | claim | provenance |
|---|---|---|
| S1 | Raw signal captured at the membrane | `travis_cnty_bulk` · ingest `0x4A9E17` · 2026-07-28T04:12Z |
| S2 | Fragment recognised and typed | `internal.parcel@7` · 41/41 fields mapped |
| S3 | Evidence forms; corroboration begins | deed grantor matches owner of record · 2 sources |
| S4 | Confidence narrows | interval 0.31–0.78 → 0.79–0.91 · point 0.86 |
| S5 | Governance evaluates; facets align | grant `0x8C21` · scope read+enrich · outbound withheld |
| S6 | Execution, then receipt returns inward | `rcpt_01K9F2M7Q4` · chain verified · system reweights |

On completion the traced channel holds **spectral green** and does not fade.
This is the only sustained green in the site, because it is the only place
something is finished.

## 7 · Vertical worlds

`document.body.dataset.vertical` switches `--vertical-accent` only.

**`--status-*` and `--authority-*` must not change.** Green means verified in
Field Scout, Deed Sonar and Lead Recipe OS identically. A vertical that
overrides a trust semantic is a contract violation, not a customisation.

## 8 · Reduced-motion route

Not a disabled animation — a **route**. All eight states remain reachable and
distinguishable; travel is removed, state change is not.

- `--dur-cinematic` → 100ms, `--dur-camera` → 100ms
- camera transitions become cuts
- `scroll-behavior` → `auto`
- trace cadence 760ms → 220ms
- the recognition ripple becomes a single opacity change

## 9 · Loading route

Progressive and staged: `detecting capability → building tissue → channels +
core → ready`. Scene construction happens at stage 2, so tier selection is
resolved before any geometry is built.

**The boot overlay never gates copy.** The DOM layer is fully parsed and
screen-readable before the scene exists; the overlay is a visual cover, not a
content gate.

## 10 · Error and degradation

| condition | behaviour |
|---|---|
| no WebGL context | tier 0 — authored static composition, honest note, full copy |
| scene module fails to load | the DOM layer is unaffected and fully functional; the page is a working editorial site with no scene |
| a scene error at runtime | scene error boundary drops to tier 0; the DOM layer never unmounts |
| fonts fail | `font-display: swap` with a declared fallback stack |

The site's floor is a complete, legible, converting editorial page. The scene
is an enhancement layer at every tier.

## 11 · Keyboard

| key | action |
|---|---|
| `Tab` | skip link → review rail → channels → conversion |
| `Enter` / `Space` on a channel | run the trace |
| `T` | jump to chapter 4 and trace |
| `R` | reset the trace |
| `↓` / `↑` | next / previous chapter |

Focus is the design system's 2px offset ring throughout — it survives
`forced-colors`.

## 12 · What the prototype does NOT prove

Stated plainly so the handoff is not read as more complete than it is.

- **Transmission, subsurface and depth of field.** These are Direction A's
  entire material argument and cannot be expressed in SVG. They carry the
  direction's highest technical risk and are the subject of the first spike in
  `TECHNICAL_SPIKE_PLAN.md`.
- **Real frame-time and memory under load.** The SVG scene is not a proxy for
  WebGL cost. The budgets in `scene.css` are targets to be measured, not
  measurements.
- **Asset pipeline.** No glTF, Draco or KTX2 asset has been produced or
  measured. The manifest is a specification.
