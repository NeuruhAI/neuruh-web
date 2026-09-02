'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SceneBoundary } from '@/components/dom/SceneBoundary'
import type { Capability, MotionRoute } from '@/lib/capability'
import { readSpike1Config } from '@/lib/spike1Config'
import { readSeed } from '@/lib/rng'

const GalaxyScene = dynamic(() => import('@/components/scene/ResetSceneEntry'), { ssr: false })

/**
 * Galaxy's immersive header — the one route where the spatial runtime lives.
 * Carries the locked material policy (tier 3 = two live physical membranes at
 * trs 0.75; lower tiers baked) exactly as SCENE_CONTRACT.md and the founder
 * gate approval fixed it. contracts.test.mjs asserts these strings here.
 *
 * The scene animates on load, so WCAG 2.2.2 (Pause, Stop, Hide) requires a
 * visible mechanism to stop it — axe cannot see motion inside a canvas, so this
 * closes the visitor-walk findings AUTO-01 and CTRL-01 rather than the audit
 * tool's silence being mistaken for compliance. Pausing routes the scene through
 * the contract's existing reduced-motion route (SCENE_CONTRACT §8) instead of
 * freezing frames, so the still frame stays a legitimate scene state.
 */
export function GalaxyImmersive() {
  const [, setCapability] = useState<Capability | null>(null)
  const [motion, setMotion] = useState<MotionRoute | null>(null)
  const config = useMemo(() => readSpike1Config(), [])
  const seed = readSeed()
  const onCapability = useCallback((next: Capability) => setCapability(next), [])

  // Default to the visitor's own OS preference; the control only overrides it.
  useEffect(() => {
    if (motion !== null) return
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    setMotion(reduced ? 'reduced' : 'full')
  }, [motion])

  const paused = motion === 'reduced'
  return (
    <div className="galaxy-immersive" style={{ position: 'relative', minHeight: '46svh' }}>
      <div aria-hidden="true">
        <SceneBoundary onCapability={onCapability} forcedMotion={motion ?? undefined}>
          {(cap, onFailure) => (
            <GalaxyScene
              config={{
                ...config,
                approach: cap.tier === 3 ? 'physical' : 'baked',
                layers: cap.tier === 3 ? 2 : cap.tier === 2 ? 4 : 3,
                doubleSided: false,
              }}
              state={config.pinnedState ?? 'metabolism'}
              camera={config.pinnedCamera ?? 'wide'}
              seed={seed}
              capability={cap}
              onFailure={onFailure}
            />
          )}
        </SceneBoundary>
      </div>
      <button
        type="button"
        className="scene-motion-toggle"
        data-testid="scene-motion-toggle"
        aria-pressed={paused}
        onClick={() => setMotion(paused ? 'full' : 'reduced')}
      >
        {paused ? '▶ Play scene' : '❚❚ Pause scene'}
      </button>
    </div>
  )
}
