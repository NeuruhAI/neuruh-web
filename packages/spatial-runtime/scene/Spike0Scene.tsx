'use client'

/**
 * Spike 0 scene entry point.
 *
 * Exists as its own module so the page can reach it through next/dynamic. That
 * keeps three, R3F and drei out of the initial chunk, which is the only way the
 * 180 KB "initial payload, before ANY scene asset" ceiling in
 * ASSET_MANIFEST.yaml can be measured — or met.
 */

import { SceneShell } from './SceneShell'
import { LightRig } from './LightRig'
import { Tissue } from './Tissue'
import { CameraRig } from './CameraRig'
import { SCENE_STATES, type CameraName, type SceneStateName } from '@/lib/sceneStates'
import { readPinnedFrame } from '@/lib/rng'
import { SVG_UNITS_PER_WORLD } from '@/lib/tissue'
import type { Capability } from '@/lib/capability'

export default function Spike0Scene({
  state,
  cam,
  seed,
  capability,
  onFailure,
}: {
  state: SceneStateName
  cam: CameraName
  seed: number
  capability: Capability
  onFailure: (reason: string) => void
}) {
  const target = SCENE_STATES[state]
  const pinnedFrame = readPinnedFrame()
  return (
    <SceneShell capability={capability} onFailure={onFailure}>
      {(rt) => (
        <>
          <LightRig tokens={rt.tokens} />
          <CameraRig
            pose={cam}
            fov={rt.capability.coarsePointer ? rt.tokens.fovMobile : rt.tokens.fovDesktop}
            damping={rt.tokens.cameraDamping}
            cut={rt.reducedMotion || pinnedFrame !== null}
          />
          <Tissue
            profile={rt.profile}
            seed={seed}
            tokens={rt.tokens}
            focusRadius={target.focusRadius / SVG_UNITS_PER_WORLD}
            traceProgress={0}
            paused={rt.reducedMotion || pinnedFrame !== null}
            pinnedTime={pinnedFrame !== null ? pinnedFrame / 60 : null}
          />
        </>
      )}
    </SceneShell>
  )
}
