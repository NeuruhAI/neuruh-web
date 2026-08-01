/**
 * N-Cell tissue block — authored geometry.
 *
 * Hexagonally packed cells, per ASSET_MANIFEST.yaml `tissue_block`. The manifest
 * is explicit that instancing here is a correctness requirement, not an
 * optimisation: per-cell state rides in an instanced attribute so the state
 * system is expressed on the GPU rather than as separate meshes.
 *
 * UNIT MAPPING. The prototype works in SVG units (hex radius 24, focus radius up
 * to 340). This module fixes the conversion at 100 SVG units = 1 world unit, so
 * every number in SCENE_CONTRACT.md §1 and §4 maps to world space without
 * reinterpretation.
 */

import { Matrix4, Vector3 } from 'three'
import { mulberry32 } from './rng'
import type { TierProfile } from './capability'

/**
 * 160 SVG units = 1 world unit.
 *
 * Fixed by composition, then held: the 15x13 tier-3 grid must sit inside the
 * `wide` camera's frame with the membrane canopy enclosing it. At 100 the block
 * was 5.4 units across, wider than the `close` frame, so the camera sat inside
 * the tissue and the membranes were buried under it.
 *
 * The SAME divisor converts the state table's focus radius, so recognition still
 * reaches the cells the contract says it reaches: 340 SVG -> 2.13 world, against
 * a block half-diagonal of 2.39.
 */
export const SVG_UNITS_PER_WORLD = 160

/** Per-cell state ordinal. Mirrors the --status-* semantics; never decorative. */
export const CELL_STATE = {
  dormant: 0,
  verified: 1,
  review: 2,
  contradiction: 3,
  illuminated: 4,
} as const

export interface TissueData {
  count: number
  matrices: Float32Array
  /** State ordinal per instance. */
  state: Float32Array
  /** Stable per-instance noise, drawn from the seeded PRNG. */
  seed: Float32Array
  /** World-space distance of each cell from the core. */
  distance: Float32Array
  hexRadius: number
  extent: { x: number; z: number }
  triangles: number
}

/**
 * Flat-top hexagonal packing. Column spacing 1.5r, row spacing sqrt(3)r with a
 * half-row offset on odd columns — the standard packing, chosen so the cells
 * tile without gaps and read as engineered tissue rather than scattered discs.
 */
export function buildTissue(profile: TierProfile, seed: number): TissueData {
  const rand = mulberry32(seed)
  const r = profile.hexRadius / SVG_UNITS_PER_WORLD
  const [cols, rows] = profile.grid

  const dx = 1.5 * r
  const dz = Math.sqrt(3) * r

  const count = cols * rows
  const matrices = new Float32Array(count * 16)
  const state = new Float32Array(count)
  const seedAttr = new Float32Array(count)
  const distance = new Float32Array(count)

  const m = new Matrix4()
  const pos = new Vector3()
  const originX = ((cols - 1) * dx) / 2
  const originZ = ((rows - 1) * dz) / 2

  let i = 0
  for (let c = 0; c < cols; c++) {
    for (let rw = 0; rw < rows; rw++) {
      const x = c * dx - originX
      const z = rw * dz + (c % 2 ? dz / 2 : 0) - originZ

      // A shallow dome: the block is tissue, not a floor. Height falls off with
      // radius so the silhouette curves away from the camera.
      const radial = Math.hypot(x, z)
      const dome = Math.cos(Math.min(1, radial / (cols * dx * 0.62)) * Math.PI * 0.5)
      const jitter = (rand() - 0.5) * 0.03
      const y = dome * 0.2 + jitter

      pos.set(x, y, z)
      m.makeTranslation(x, y, z)
      // Vary cell height so the block reads as grown rather than extruded.
      // Scaled to the hex radius: cells must read as packed tissue, not as a
      // field of columns.
      const h = (0.9 + rand() * 0.7) * r * 2.6
      m.elements[5] = h

      m.toArray(matrices, i * 16)
      seedAttr[i] = rand()
      distance[i] = pos.length()

      // Initial state distribution. Fixture-shaped, not asserted as real data:
      // most cells dormant, a minority carrying the three evidence states.
      const roll = rand()
      state[i] =
        roll > 0.93 ? CELL_STATE.contradiction : roll > 0.82 ? CELL_STATE.review : roll > 0.52 ? CELL_STATE.verified : CELL_STATE.dormant

      i++
    }
  }

  return {
    count,
    matrices,
    state,
    seed: seedAttr,
    distance,
    hexRadius: r,
    extent: { x: cols * dx, z: rows * dz },
    // A 6-sided cylinder with caps: 6 side quads (12 tris) + 2 hex caps (8 tris).
    triangles: count * 20,
  }
}

/**
 * Evidence channels — swept tubes running from the tissue rim inward to the
 * governance core. SCENE_CONTRACT.md §5: these are the sole interactive scene
 * element.
 */
export function buildChannelCurves(channels: number, seed: number, extentX: number): Vector3[][] {
  const rand = mulberry32(seed ^ 0x9e3779b9)
  const curves: Vector3[][] = []
  for (let i = 0; i < channels; i++) {
    const angle = (i / channels) * Math.PI * 2 + rand() * 0.24
    const outer = extentX * 0.62
    const pts: Vector3[] = []
    const segments = 5
    for (let s = 0; s <= segments; s++) {
      const t = s / segments
      const radius = outer * (1 - t)
      // Channels wander as they travel inward; the wander is seeded so a
      // screenshot is reproducible.
      const wobble = (rand() - 0.5) * 0.42 * (1 - t)
      const a = angle + wobble
      pts.push(
        new Vector3(
          Math.cos(a) * radius,
          0.26 + Math.sin(t * Math.PI) * 0.2 * (1 - t) + (rand() - 0.5) * 0.04,
          Math.sin(a) * radius,
        ),
      )
    }
    curves.push(pts)
  }
  return curves
}
