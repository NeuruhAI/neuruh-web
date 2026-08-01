'use client'

/**
 * Spike 1 scene entry point. Dynamically imported for the same reason as
 * Spike0Scene: the DOM layer's payload has to be measurable without the WebGL
 * runtime in it.
 */

import { SceneShell } from './SceneShell'
import { NCellScene } from './NCellScene'
import type { MembraneReport } from './Membranes'
import type { CameraName, SceneStateName } from '@/lib/sceneStates'
import type { Spike1Config } from '@/lib/spike1Config'
import type { Capability } from '@/lib/capability'

export default function Spike1Scene({
  config,
  state,
  camera,
  seed,
  traceProgress,
  traceComplete,
  capability,
  onFailure,
  onChannelPointerDown,
  onMembraneReport,
}: {
  config: Spike1Config
  state: SceneStateName
  camera: CameraName
  seed: number
  traceProgress: number
  traceComplete: boolean
  capability: Capability
  onFailure: (reason: string) => void
  onChannelPointerDown?: () => void
  onMembraneReport?: (r: MembraneReport) => void
}) {
  return (
    <SceneShell capability={capability} onFailure={onFailure}>
      {(rt) => (
        <NCellScene
          runtime={rt}
          config={config}
          state={state}
          camera={camera}
          seed={seed}
          traceProgress={traceProgress}
          traceComplete={traceComplete}
          onChannelPointerDown={onChannelPointerDown}
          onMembraneReport={onMembraneReport}
        />
      )}
    </SceneShell>
  )
}
