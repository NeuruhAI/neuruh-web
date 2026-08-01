/**
 * Capability detection and quality-tier selection.
 *
 * Implements SCENE_CONTRACT.md §4. Detection order is fixed:
 *   WebGL context -> pointer/hover media query -> deviceMemory + hardwareConcurrency.
 *
 * A user override always wins over detection. User-agent sniffing is forbidden
 * by the contract and is not performed anywhere in this module.
 */

export type Tier = 0 | 1 | 2 | 3
export type MotionRoute = 'full' | 'reduced'

export interface Capability {
  tier: Tier
  /** Device pixel ratio the renderer should be clamped to for this tier. */
  dpr: number
  /** Why this tier was chosen — surfaced in the receipt, never guessed at. */
  reason: string
  /** True when the tier came from an explicit override rather than detection. */
  overridden: boolean
  webgl: false | 'webgl' | 'webgl2'
  /** UNMASKED_RENDERER_WEBGL when the debug extension is available. */
  gpu: string | null
  deviceMemory: number | null
  hardwareConcurrency: number | null
  coarsePointer: boolean
  motion: MotionRoute
  motionOverridden: boolean
}

/** Tier -> DPR ceiling. Mirrors --scene-tier-N-dpr in tokens/scene.css. */
export const TIER_DPR: Record<Tier, number> = { 3: 2, 2: 1.5, 1: 1, 0: 1 }

/** Tier -> scene density. Mirrors the SCENE_CONTRACT.md §4 table exactly. */
export interface TierProfile {
  hexRadius: number
  grid: [number, number]
  channels: number
  membranes: number
  fragments: number
  softFilter: boolean
}

export const TIER_PROFILE: Record<Exclude<Tier, 0>, TierProfile> = {
  3: { hexRadius: 24, grid: [15, 13], channels: 7, membranes: 5, fragments: 34, softFilter: true },
  2: { hexRadius: 28, grid: [13, 11], channels: 6, membranes: 4, fragments: 26, softFilter: false },
  1: { hexRadius: 34, grid: [10, 9], channels: 5, membranes: 3, fragments: 18, softFilter: false },
}

interface ProbeResult {
  webgl: false | 'webgl' | 'webgl2'
  gpu: string | null
}

/**
 * Probe for a WebGL context on a throwaway canvas. The canvas is explicitly
 * lost afterwards so the probe never holds one of the browser's limited
 * contexts open — a real bug class when a page probes on every route change.
 */
function probeWebGL(): ProbeResult {
  if (typeof document === 'undefined') return { webgl: false, gpu: null }
  const canvas = document.createElement('canvas')
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
  let kind: false | 'webgl' | 'webgl2' = false
  try {
    gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null
    if (gl) kind = 'webgl2'
    if (!gl) {
      gl = canvas.getContext('webgl') as WebGLRenderingContext | null
      if (gl) kind = 'webgl'
    }
  } catch {
    return { webgl: false, gpu: null }
  }
  if (!gl) return { webgl: false, gpu: null }

  let gpu: string | null = null
  try {
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    if (dbg) gpu = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string
    if (!gpu) gpu = gl.getParameter(gl.RENDERER) as string
  } catch {
    gpu = null
  }

  try {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    /* probe cleanup is best-effort */
  }
  return { webgl: kind, gpu }
}

/**
 * A renderer string that indicates a software rasteriser. Frame-time numbers
 * measured on one of these are not evidence about GPU cost and every benchmark
 * in this repository refuses to treat them as such.
 */
export function isSoftwareRenderer(gpu: string | null): boolean {
  if (!gpu) return false
  return /swiftshader|llvmpipe|software|microsoft basic render/i.test(gpu)
}

function parseTierOverride(search: string): Tier | null {
  const raw = new URLSearchParams(search).get('tier')
  if (raw === null) return null
  const n = Number(raw)
  return n === 0 || n === 1 || n === 2 || n === 3 ? (n as Tier) : null
}

export function detectCapability(search = typeof window !== 'undefined' ? window.location.search : ''): Capability {
  const params = new URLSearchParams(search)
  const { webgl, gpu } = probeWebGL()

  const coarsePointer =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches

  const nav = (typeof navigator !== 'undefined' ? navigator : undefined) as
    | (Navigator & { deviceMemory?: number })
    | undefined
  const deviceMemory = nav?.deviceMemory ?? null
  const hardwareConcurrency = nav?.hardwareConcurrency ?? null

  let tier: Tier
  let reason: string

  if (!webgl) {
    tier = 0
    reason = 'no WebGL context obtainable'
  } else if (coarsePointer) {
    tier = 1
    reason = '(hover: none) and (pointer: coarse)'
  } else if ((deviceMemory !== null && deviceMemory <= 4) || (hardwareConcurrency !== null && hardwareConcurrency <= 4)) {
    tier = 2
    reason = `desktop, constrained: deviceMemory=${deviceMemory ?? 'n/a'} cores=${hardwareConcurrency ?? 'n/a'}`
  } else {
    tier = 3
    reason = `desktop, ${webgl}, cores=${hardwareConcurrency ?? 'n/a'}, deviceMemory=${deviceMemory ?? 'n/a'}`
  }

  const override = parseTierOverride(search)
  const overridden = override !== null
  if (override !== null) {
    // Tier 0 can always be forced. A higher tier cannot be forced onto a device
    // with no WebGL context — there is nothing to force it onto.
    if (override > 0 && !webgl) {
      reason = `override tier=${override} refused: no WebGL context`
    } else {
      tier = override
      reason = `user override tier=${override}`
    }
  }

  const prefersReduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const motionParam = params.get('motion')
  const motionOverridden = motionParam === 'full' || motionParam === 'reduced'
  const motion: MotionRoute = motionOverridden
    ? (motionParam as MotionRoute)
    : prefersReduced
      ? 'reduced'
      : 'full'

  // ?dpr= exists for the benchmark matrix: SCENE_CONTRACT.md §4 fixes a DPR per
  // tier, but spike 1 must sweep DPR independently of tier to price the
  // membrane. It is a measurement instrument, not a shipped control.
  const dprParam = Number(params.get('dpr'))
  const dpr = Number.isFinite(dprParam) && dprParam > 0 ? dprParam : TIER_DPR[tier]

  return {
    tier,
    dpr,
    reason,
    overridden,
    webgl,
    gpu,
    deviceMemory,
    hardwareConcurrency,
    coarsePointer,
    motion,
    motionOverridden,
  }
}
