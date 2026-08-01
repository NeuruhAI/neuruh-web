'use client'

/**
 * The N-Cell hero — Spike 1's scene.
 *
 * Assembles the five authored objects from ASSET_MANIFEST.yaml under the state
 * machine in SCENE_CONTRACT.md §1. State targets are eased, never cut, so the
 * renderer is a function of the state table and nothing else.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Fog } from 'three'
import { useThree } from '@react-three/fiber'
import { LightRig } from './LightRig'
import { Tissue } from './Tissue'
import { GovernanceCore } from './GovernanceCore'
import { Channels, Filaments } from './Channels'
import { Fragments } from './Fragments'
import { Membranes, type MembraneReport } from './Membranes'
import { CameraRig } from './CameraRig'
import { SCENE_STATES, type CameraName, type SceneStateName } from '@/lib/sceneStates'
import { readPinnedFrame } from '@/lib/rng'
import { SVG_UNITS_PER_WORLD } from '@/lib/tissue'
import type { SceneRuntime } from './SceneShell'
import type { Spike1Config } from '@/lib/spike1Config'

/**
 * Eases the eight-state table toward its targets.
 *
 * The contract calls the transitions declarative: the state machine sets target
 * values and the renderer eases to them, and no state knows about any other
 * state. This hook is the whole implementation of that rule — it interpolates
 * every field uniformly and branches on nothing.
 */
function useEasedState(state: SceneStateName, durationMs: number, cut: boolean) {
  const target = SCENE_STATES[state]
  const current = useRef({ ...SCENE_STATES.dormant })
  const [, force] = useState(0)
  const frame = useRef(0)

  useFrame((_, delta) => {
    const c = current.current
    const k = cut ? 1 : 1 - Math.exp((-delta * 1000 * 3.2) / durationMs)
    let moved = false
    for (const key of ['membrane', 'fragments', 'focusRadius', 'channels', 'core', 'nodes', 'filaments'] as const) {
      const next = MathUtils.lerp(c[key], target[key], k)
      if (Math.abs(next - c[key]) > 1e-4) moved = true
      c[key] = next
    }
    // liveChannels and coreLit are discrete by definition; easing them would
    // invent intermediate states the contract does not have.
    if (c.liveChannels !== target.liveChannels || c.coreLit !== target.coreLit) {
      c.liveChannels = target.liveChannels
      c.coreLit = target.coreLit
      moved = true
    }
    // Re-render at most every other frame while moving. The scene reads these
    // through props, and pushing a React render every frame would make the
    // measurement a benchmark of React rather than of the material.
    if (moved && ++frame.current % 2 === 0) force((n) => n + 1)
  })

  return current.current
}

function Fog3({ tokens }: { tokens: SceneRuntime['tokens'] }) {
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    scene.fog = new Fog(tokens.fogColor, tokens.fogNear, tokens.fogFar)
    return () => {
      scene.fog = null
    }
  }, [scene, tokens])
  return null
}

export function NCellScene({
  runtime,
  config,
  state,
  camera,
  seed,
  traceProgress,
  traceComplete,
  onChannelPointerDown,
  onMembraneReport,
}: {
  runtime: SceneRuntime
  config: Spike1Config
  state: SceneStateName
  camera: CameraName
  seed: number
  traceProgress: number
  traceComplete: boolean
  onChannelPointerDown?: () => void
  onMembraneReport?: (r: MembraneReport) => void
}) {
  const { tokens, profile, reducedMotion, capability } = runtime
  // ?frame=N pins every scene clock at N/60 s — the reproducible-capture
  // requirement from ENGINEERING_HANDOFF.md §5. State easing also cuts, so a
  // pinned capture shows the state's target values, not a moment mid-ease.
  const pinnedFrame = useMemo(() => readPinnedFrame(), [])
  const paused = reducedMotion || pinnedFrame !== null
  const eased = useEasedState(state, tokens.chapterDuration, paused)

  // Membrane count is bounded by the tier profile as well as by the URL: tier 1
  // may not be asked to render four live transmissive sheets just because a
  // benchmark URL said so, and silently ignoring the tier would make every
  // mobile measurement fiction.
  const layers = useMemo(() => Math.min(config.layers, profile.membranes), [config.layers, profile])

  return (
    <>
      <Fog3 tokens={tokens} />
      <LightRig tokens={tokens} />
      <CameraRig
        pose={config.pinnedCamera ?? camera}
        fov={capability.coarsePointer ? tokens.fovMobile : tokens.fovDesktop}
        damping={tokens.cameraDamping}
        cut={paused}
      />

      {/* Internal structural layer. */}
      <Tissue
        profile={profile}
        seed={seed}
        tokens={tokens}
        focusRadius={eased.focusRadius / SVG_UNITS_PER_WORLD}
        traceProgress={traceProgress}
        paused={paused}
        pinnedTime={pinnedFrame !== null ? pinnedFrame / 60 : null}
      />

      <GovernanceCore tokens={tokens} presence={eased.core} lit={eased.coreLit} paused={paused} />

      {/* Evidence-signal trace through the object. */}
      <Channels
        count={profile.channels}
        seed={seed}
        extentX={profile.grid[0] * 1.5 * (profile.hexRadius / SVG_UNITS_PER_WORLD)}
        tokens={tokens}
        presence={eased.channels}
        liveCount={eased.liveChannels}
        traceProgress={traceProgress}
        traceComplete={traceComplete}
        paused={paused}
        onPointerDown={onChannelPointerDown}
      />

      {/* Receipt-return state. */}
      <Filaments presence={eased.filaments} tokens={tokens} seed={seed} paused={paused} />

      <Fragments count={profile.fragments} seed={seed} presence={eased.fragments} paused={paused} />

      {/* The live transmissive / refractive outer layer — the argument itself. */}
      <Membranes
        approach={config.approach}
        layers={layers}
        tokens={tokens}
        seed={seed}
        presence={eased.membrane}
        segments={config.segments}
        doubleSided={config.doubleSided}
        ssrResolution={config.ssrResolution}
        ssrSamples={config.ssrSamples}
        onReport={onMembraneReport}
      />
    </>
  )
}
