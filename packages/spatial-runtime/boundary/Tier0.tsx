'use client'

/**
 * Tier 0 — the no-WebGL route.
 *
 * SCENE_CONTRACT.md §4 and §10: "an authored static composition, honest note,
 * full copy". DESIGN_LOCK.md: "All are designed; none is a degradation message.
 * Tier 0 keeps every word of copy."
 *
 * The composition itself is authored in tokens/scene.css under
 * [data-scene-tier="0"], so tier 0 is art-directed in the design system rather
 * than improvised in a component. This element only carries it, and marks itself
 * for the automated assertion that tier 0 retains 100% of the copy.
 *
 * It lives in components/dom rather than components/scene because it must be
 * reachable without loading any WebGL code — that is what makes tier 0 free.
 */

export function Tier0({ reason }: { reason: string }) {
  return (
    <div
      className="scene-canvas-layer"
      aria-hidden="true"
      data-testid="tier0-composition"
      data-tier0-reason={reason}
    />
  )
}
