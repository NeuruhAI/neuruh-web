/**
 * Spike 1 run configuration, read entirely from the URL.
 *
 * ENGINEERING_HANDOFF.md §5 requires the scene to be reproducible from its
 * parameters. Every knob the benchmark turns lives here, so a receipt's URL is
 * a complete description of the run that produced it.
 */

import { MEMBRANE_APPROACHES, type MembraneApproach } from './membraneApproaches'
import { CHAPTERS, type CameraName, type SceneStateName } from './sceneStates'

export interface Spike1Config {
  approach: MembraneApproach
  layers: number
  /** Pin the scene to one state instead of letting scroll drive it. */
  pinnedState: SceneStateName | null
  pinnedCamera: CameraName | null
  doubleSided: boolean
  ssrResolution: number
  ssrSamples: number
  /** Membrane sheet tessellation. Swept to separate geometry cost from fill cost. */
  segments: [number, number]
  /** Auto-run the signature trace on load, for deterministic capture. */
  autoTrace: boolean
}

const STATE_NAMES = CHAPTERS.map((c) => c.state)
const CAM_NAMES: CameraName[] = ['wide', 'mid', 'close', 'vertical', 'core']

function intParam(p: URLSearchParams, key: string, fallback: number, min: number, max: number): number {
  const n = Number(p.get(key))
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}

export function readSpike1Config(search = typeof window !== 'undefined' ? window.location.search : ''): Spike1Config {
  const p = new URLSearchParams(search)

  const matRaw = p.get('mat') as MembraneApproach | null
  const approach: MembraneApproach =
    matRaw && MEMBRANE_APPROACHES.includes(matRaw) ? matRaw : 'physical'

  const stateRaw = p.get('state') as SceneStateName | null
  const camRaw = p.get('cam') as CameraName | null

  const segRaw = intParam(p, 'seg', 48, 8, 160)

  return {
    approach,
    // ASSET_MANIFEST.yaml specifies 4 membrane sheets and states that only 2
    // carry live transmission at tier 3. 4 is therefore the worst case the
    // spike plan names, and the sweep goes 0..4.
    layers: intParam(p, 'layers', 2, 0, 4),
    pinnedState: stateRaw && STATE_NAMES.includes(stateRaw) ? stateRaw : null,
    pinnedCamera: camRaw && CAM_NAMES.includes(camRaw) ? camRaw : null,
    doubleSided: p.get('ds') === '1',
    ssrResolution: intParam(p, 'ssrRes', 512, 128, 2048),
    ssrSamples: intParam(p, 'ssrSamples', 6, 1, 32),
    segments: [segRaw, Math.max(6, Math.round(segRaw * 0.6))],
    autoTrace: p.get('trace') === '1',
  }
}
