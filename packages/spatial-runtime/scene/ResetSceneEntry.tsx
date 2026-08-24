'use client'

/**
 * Reset-scene entry point — same dynamic-import seam as Spike1Scene so the
 * DOM layer's payload stays measurable without the WebGL runtime in it, and
 * the SceneBoundary/tier/failure contract is unchanged.
 */

import { SceneShell } from './SceneShell'
import { ResetSceneInner } from './ResetScene'
import type { MembraneReport } from './Membranes'
import type { CameraName, SceneStateName } from '@/lib/sceneStates'
import type { Spike1Config } from '@/lib/spike1Config'
import type { Capability } from '@/lib/capability'

export default function ResetSceneEntry({
  config,
  state,
  camera,
  seed,
  capability,
  onFailure,
  onMembraneReport,
}: {
  config: Spike1Config
  state: SceneStateName
  camera: CameraName
  seed: number
  traceProgress?: number
  traceComplete?: boolean
  capability: Capability
  onFailure: (reason: string) => void
  onChannelPointerDown?: () => void
  onMembraneReport?: (r: MembraneReport) => void
}) {
  return (
    <SceneShell capability={capability} onFailure={onFailure}>
      {(rt) => (
        <ResetSceneInner
          rt={rt}
          config={config}
          state={state}
          camera={camera}
          seed={seed}
          onMembraneReport={onMembraneReport}
        />
      )}
    </SceneShell>
  )
}
