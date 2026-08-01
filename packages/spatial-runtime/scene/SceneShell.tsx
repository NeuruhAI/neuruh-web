'use client'

/**
 * The WebGL scene boundary — inner half.
 *
 * The OUTER half is components/dom/SceneBoundary: it detects capability and
 * decides whether a scene should exist at all, using no WebGL code. This module
 * is only reached once that decision is yes, so everything from here down may
 * freely import three, R3F and drei.
 *
 * The DOM layer above never imports any of them, never sees a renderer, and
 * never needs to know which one is in use — the renderer-agnosticism
 * SCENE_CONTRACT.md requires, enforced by module boundary rather than by
 * discipline.
 *
 * Responsibilities, all of them contract clauses:
 *   §8  reduced-motion as a route
 *   §9  scene construction after tier resolution, never gating copy
 *   §10 runtime failure drops to tier 0 without unmounting the DOM layer
 */

import { Suspense, useCallback, useMemo, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, type WebGLRenderer } from 'three'
import { TIER_PROFILE, type Capability } from '@/lib/capability'
import { readSceneTokens, type SceneTokens } from '@/lib/sceneTokens'
import { getHarness } from '@/lib/metrics'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import { Harness } from './Harness'

export interface SceneRuntime {
  capability: Capability
  tokens: SceneTokens
  profile: (typeof TIER_PROFILE)[3]
  reducedMotion: boolean
}

export function SceneShell({
  capability,
  onFailure,
  children,
  className,
}: {
  capability: Capability
  onFailure: (reason: string) => void
  children: (rt: SceneRuntime) => ReactNode
  className?: string
}) {
  const runtime: SceneRuntime = useMemo(() => {
    const tier = capability.tier === 0 ? 1 : (capability.tier as 1 | 2 | 3)
    return {
      capability,
      tokens: readSceneTokens(true),
      profile: TIER_PROFILE[tier],
      reducedMotion: capability.motion === 'reduced',
    }
  }, [capability])

  const onCreated = useCallback(
    ({ gl }: { gl: WebGLRenderer }) => {
      gl.toneMapping = ACESFilmicToneMapping
      gl.toneMappingExposure = 1.05

      // Founder-approved working policy. This remains PROVISIONAL until G1's
      // required real-device matrix passes; full-resolution is not a production
      // option because it consumes the scene-memory envelope.
      gl.transmissionResolutionScale = 0.75

      // A lost context arrives as a DOM event, not a React error, so the error
      // boundary would never see it and the page would keep a dead canvas on
      // screen. SCENE_CONTRACT.md §10 requires the drop to tier 0.
      gl.domElement.addEventListener(
        'webglcontextlost',
        (e) => {
          e.preventDefault()
          getHarness().recordError('webglcontextlost')
          onFailure('WebGL context lost')
        },
        { once: true },
      )
    },
    [onFailure],
  )

  const antialias = new URLSearchParams(window.location.search).get('aa') !== '0'

  return (
    <div className={className ?? 'scene-canvas-layer'} aria-hidden="true" data-testid="scene-canvas-layer">
      <SceneErrorBoundary onFailure={onFailure}>
        <Canvas
          dpr={capability.dpr}
          gl={{
            antialias,
            alpha: false,
            powerPreference: 'high-performance',
            // Required for the benchmark's forced-sync frame measurement: without
            // it the drawing buffer may be cleared before readPixels can fence.
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
          }}
          camera={{ position: [2.6, 3.1, 8.4], fov: runtime.tokens.fovDesktop }}
          onCreated={onCreated}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <Harness />
            {children(runtime)}
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  )
}
