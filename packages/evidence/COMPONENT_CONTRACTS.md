# Component Contracts — Neuruh.com

Every component below exists in `exports/design-system/css/` and is exercised in
the prototype. A contract states what the component **must refuse to render**,
because that is where the brand law actually lives.

---

## Evidence layer

### `EvidenceChip` — `.n-evidence`

```ts
{ claim: string; source: { id: string; label: string }; state: State; onInspect?(): void }
```

- **MUST NOT render without a `source`.** A claim with no provenance is not an
  evidence chip; it is a marketing statement and belongs in prose.
- States: `verified`, `partial`, `stale`, `unavailable`, `unsupported`, `contradiction`.
- Colour never encodes state alone — the `◇` source glyph and border treatment carry it too.

### `ProvenanceTrail` — `.n-trail`

```ts
{ hops: Array<{ kind: 'signal'|'evidence'|'claim'; value: string; meta: string; state: State }> }
```

- **MUST render every hop.** Collapsing a trail to a summary confidence number
  is the failure this component exists to prevent.
- Minimum 2 hops. A one-hop trail means the claim *is* the signal — render an
  `EvidenceChip` instead.

### `ConfidenceMeter` — `.n-confidence`

```ts
{ point: number; interval: [number, number]; state: State }
```

- **MUST NOT accept `point` without `interval`.** A bare point estimate implies
  precision the system does not have — anti-pattern "fake confidence".
- The range band is not optional and is never zero-width.
- Renders `unavailable` rather than `0` when confidence is unknown.

### `ContradictionPair` — `.n-contradiction`

```ts
{ a: Claim; b: Claim; field: string; gatedRecipes: string[] }
```

- **MUST render both claims with equal visual weight.** Neither may be styled as
  the winner, default, or preferred value.
- **MUST list what is gated downstream.** A contradiction with no stated
  consequence reads as trivia.
- Has no "resolve" affordance. Resolution is a human action taken elsewhere.

### `ReceiptBlock` — `.n-receipt`

```ts
{ action: string; authority: string; scope: string; result: string; receiptId: string; ts: ISO8601 }
```

- Monospace is licensed here — this is machine evidence.
- **MUST NOT be rendered for an action that has not completed.** A pending
  receipt is a contradiction in terms; use state `loading` on the action itself.

## Authority layer

### `AuthorityGate` — `.n-gate`

```ts
{ authority: 'granted'|'scoped'|'withheld'|'revoked'; scope: string; reason: string; expiresAt?: ISO8601 }
```

- All four states are legitimate outcomes. `granted` is not "success".
- **MUST supply `reason` for `withheld` and `revoked`.** "Blocked" with no reason
  is indistinguishable from a bug.
- Only `granted` emits glow. Light is earned.

### `CapabilityBoundary` — `.n-boundary`

```ts
{ kind: 'unavailable'|'unsupported'|'blocked'; message: string; lastOk?: ISO8601; retryAt?: ISO8601 }
```

- **MUST distinguish the three kinds.** `unavailable` retries; `unsupported`
  never will; `blocked` is a governance decision. Collapsing them into one grey
  error is the exact lie master visual rule 9 forbids.
- `unsupported` **MUST NOT** display a retry affordance.

### `ScopeStrip` — `.n-scope`

- Mandatory on every operational product surface.
- Declares what the current view may touch **before** the user acts.

## Core layer

### `Button` — `.n-btn`

- Variants: `primary`, `secondary`, `ghost`.
- `data-state="blocked"` renders a dashed boundary, **not** a greyed-out primary.
  The visual difference between "cannot" and "will not" is the honesty.

### `Badge` — `.n-badge`

- Requires `data-glyph`. Colour alone never encodes state.

### `Table` — `.n-table`

- Numeric cells use `.is-numeric` → mono, tabular figures, right-aligned.
- A cell with no value renders `—`, never `0` and never blank.

## Flagship layer

### `SceneLayer`

- `aria-hidden="true"` at all times.
- Pointer events **only** in the `metabolism` state.
- **MUST NOT contain essential copy.** Engineering non-negotiable.

### `ChapterSection`

```html
<section data-chapter="4" data-state="metabolism" data-cam="close">
```

- The DOM is the source of truth for sequencing.
- **MUST be fully readable with the scene absent.** Verified at tier 0.

## Blackbox layer

### `LogLine` — `.bb-line`

- Severity is a left rule **plus** a glyph, never colour alone.

### `FixtureBadge` — `.bb-fixture`

- **MUST wrap any synthetic value anywhere in the system.** Blackbox is the only
  layer permitted to show synthetic data, and it must always be marked.

---

## Cross-cutting rules

1. Every component renders correctly on **both spines**. One-spine components are bugs.
2. Every data-bearing component handles all applicable states from the eleven.
3. No component may invent a status colour. `--status-*` is closed.
4. Focus is the 2px offset ring. Never a colour swap.
5. Any component that can show a number can show `unavailable`.
