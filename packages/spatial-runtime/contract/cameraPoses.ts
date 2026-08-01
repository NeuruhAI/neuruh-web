/**
 * The eight-state scene machine, transcribed from SCENE_CONTRACT.md §1.
 *
 * This table IS the contract. No renderer may add a state or change what a
 * state means (DESIGN_LOCK.md, "What is locked"). The renderer eases toward
 * these targets; it never branches on which state it came from, which is what
 * lets chapters be reordered as a content edit.
 */

export type SceneStateName =
  | 'dormant'
  | 'fragmented'
  | 'awakening'
  | 'metabolism'
  | 'vertical'
  | 'gating'
  | 'receipt'
  | 'entry'

export interface SceneState {
  membrane: number
  fragments: number
  /** World-space distance from the core within which tissue cells are lit. */
  focusRadius: number
  channels: number
  liveChannels: number
  core: number
  coreLit: boolean
  nodes: number
  filaments: number
}

export const SCENE_STATES: Record<SceneStateName, SceneState> = {
  dormant:    { membrane: 0.30, fragments: 0,    focusRadius: 0,   channels: 0,    liveChannels: 0, core: 0.25, coreLit: false, nodes: 0,   filaments: 0 },
  fragmented: { membrane: 0.55, fragments: 1.0,  focusRadius: 0,   channels: 0.12, liveChannels: 0, core: 0.25, coreLit: false, nodes: 0,   filaments: 0 },
  awakening:  { membrane: 0.45, fragments: 0.45, focusRadius: 190, channels: 0.35, liveChannels: 1, core: 0.55, coreLit: false, nodes: 0.5, filaments: 0 },
  metabolism: { membrane: 0.30, fragments: 0.15, focusRadius: 340, channels: 0.85, liveChannels: 4, core: 0.70, coreLit: false, nodes: 1.0, filaments: 0 },
  vertical:   { membrane: 0.22, fragments: 0,    focusRadius: 300, channels: 0.55, liveChannels: 3, core: 0.60, coreLit: false, nodes: 1.0, filaments: 0 },
  gating:     { membrane: 0.18, fragments: 0,    focusRadius: 260, channels: 0.70, liveChannels: 5, core: 1.00, coreLit: true,  nodes: 1.0, filaments: 0 },
  receipt:    { membrane: 0.22, fragments: 0,    focusRadius: 320, channels: 0.55, liveChannels: 2, core: 0.85, coreLit: true,  nodes: 1.0, filaments: 1.0 },
  entry:      { membrane: 0.30, fragments: 0,    focusRadius: 240, channels: 0.35, liveChannels: 1, core: 0.70, coreLit: true,  nodes: 0.6, filaments: 0.5 },
}

/**
 * Camera timeline, SCENE_CONTRACT.md §2. Five named positions.
 *
 * The prototype expresses these as a 2D SVG scale about a pivot. In 3D the same
 * five names become dolly distances along the view axis plus a pivot offset —
 * DOLLY AND RACK-FOCUS ONLY. Orbit is Direction B's language and is forbidden
 * here (DESIGN_LOCK.md). No code path in this repository orbits the camera; the
 * only azimuth freedom is the bounded +/-35 degrees drag the responsive contract
 * grants at >=96rem, which is a parallax nudge, not an orbit.
 *
 * `scale` is carried through from the contract so the mapping stays auditable:
 * distance = BASE_DISTANCE / scale.
 */
export type CameraName = 'wide' | 'mid' | 'close' | 'vertical' | 'core'

export interface CameraPose {
  scale: number
  /** Pivot offset from the core, in world units. */
  pivot: [number, number, number]
  /** Rack-focus target: 0 = background sharp, 1 = foreground sharp. */
  focus: number
}

/**
 * Dolly distance at scale 1.0.
 *
 * Set so `wide` (10.5) frames the whole N-Cell with the membrane canopy over it,
 * and `core` (4.1) sits just inside the outermost sheet — which is what makes
 * the chapter-6 move read as pushing THROUGH a membrane rather than zooming at
 * one. Every pose's distance is BASE_DISTANCE / scale.
 */
export const BASE_DISTANCE = 10.5

export const CAMERA_POSES: Record<CameraName, CameraPose> = {
  wide:     { scale: 1.0,  pivot: [0, 0, 0],          focus: 0.15 },
  mid:      { scale: 1.34, pivot: [0, 0, 0],          focus: 0.4 },
  close:    { scale: 1.85, pivot: [0, 0, 0],          focus: 0.7 },
  vertical: { scale: 1.55, pivot: [-0.66, -0.4, 0],   focus: 0.55 },
  core:     { scale: 2.55, pivot: [0, 0, 0],          focus: 1.0 },
}

export const CHAPTERS: Array<{
  n: number
  id: string
  state: SceneStateName
  cam: CameraName
}> = [
  { n: 1, id: 'ch1', state: 'dormant', cam: 'wide' },
  { n: 2, id: 'ch2', state: 'fragmented', cam: 'wide' },
  { n: 3, id: 'ch3', state: 'awakening', cam: 'mid' },
  { n: 4, id: 'ch4', state: 'metabolism', cam: 'close' },
  { n: 5, id: 'ch5', state: 'vertical', cam: 'vertical' },
  { n: 6, id: 'ch6', state: 'gating', cam: 'core' },
  { n: 7, id: 'ch7', state: 'receipt', cam: 'mid' },
  { n: 8, id: 'ch8', state: 'entry', cam: 'wide' },
]

/** Signature interaction, SCENE_CONTRACT.md §6. Six hops, real provenance. */
export const TRACE_STEPS = [
  { id: 'S1', claim: 'Raw signal captured at the membrane', provenance: 'travis_cnty_bulk · ingest 0x4A9E17 · 2026-07-28T04:12Z' },
  { id: 'S2', claim: 'Fragment recognised and typed', provenance: 'internal.parcel@7 · 41/41 fields mapped' },
  { id: 'S3', claim: 'Evidence forms; corroboration begins', provenance: 'deed grantor matches owner of record · 2 sources' },
  { id: 'S4', claim: 'Confidence narrows', provenance: 'interval 0.31–0.78 → 0.79–0.91 · point 0.86' },
  { id: 'S5', claim: 'Governance evaluates; facets align', provenance: 'grant 0x8C21 · scope read+enrich · outbound withheld' },
  { id: 'S6', claim: 'Execution, then receipt returns inward', provenance: 'rcpt_01K9F2M7Q4 · chain verified · system reweights' },
] as const

/** Trace cadence, SCENE_CONTRACT.md §6 and §8. */
export const TRACE_CADENCE_MS = { full: 760, reduced: 220 } as const
