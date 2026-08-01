/**
 * The four candidate membrane materials for Spike 1.
 *
 * TECHNICAL_SPIKE_PLAN.md spike 1 asks how many stacked transmissive membranes
 * hold budget. That question only has an honest answer if the alternatives are
 * built and measured too, so all four approaches below are real implementations
 * driven from the same tokens. None of them is a mock.
 *
 *   physical    three's MeshPhysicalMaterial transmission. One extra full-scene
 *               pass per frame TOTAL (WebGLRenderer.renderTransmissionPass runs
 *               once per camera, not once per object), so its cost is expected
 *               to be roughly O(1) in layer count plus the per-layer overdraw.
 *
 *   ssr         drei's MeshTransmissionMaterial. Screen-space refraction with
 *               its own frame buffer per material instance, so its cost is
 *               expected to be O(N) in layer count. Included precisely because
 *               it is the route most teams reach for first.
 *
 *   fresnel     No extra pass at all. Fresnel rim plus an analytic path-length
 *               approximation of internal scatter. THIS IS NOT TRANSMISSION and
 *               is labelled as an approximation everywhere it appears, per the
 *               operating contract's ban on claiming material fidelity without
 *               evidence.
 *
 *   baked       The documented tier 2/1 fallback from ASSET_MANIFEST.yaml:
 *               baked thickness + normal, constant opacity, no transmission.
 */

import {
  Color,
  DataTexture,
  DoubleSide,
  FrontSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  MeshPhysicalMaterial,
  RGBAFormat,
  RepeatWrapping,
  type IUniform,
} from 'three'
import { mulberry32 } from './rng'
import type { SceneTokens } from './sceneTokens'

export { MEMBRANE_APPROACHES, APPROACH_LABEL, type MembraneApproach } from './membraneApproaches'
import type { MembraneApproach } from './membraneApproaches'

/**
 * Procedural membrane normal + thickness map.
 *
 * Generated rather than fetched so the spike measures material cost without an
 * asset-pipeline variable in the way. Its byte cost is accounted separately in
 * the benchmark output as `proceduralTextureBytes` and is NOT presented as an
 * asset budget figure.
 */
export function makeMembraneMaps(size = 512, seed = 20260731) {
  const rand = mulberry32(seed)
  const n = size * size

  // Two octaves of value noise, bilinearly sampled. Enough to give the membrane
  // an organic surface without shipping a texture.
  const lattice = (cells: number) => {
    const g = new Float32Array((cells + 1) * (cells + 1))
    for (let i = 0; i < g.length; i++) g[i] = rand()
    return (u: number, v: number) => {
      const x = u * cells
      const y = v * cells
      const x0 = Math.floor(x)
      const y0 = Math.floor(y)
      const fx = x - x0
      const fy = y - y0
      const sx = fx * fx * (3 - 2 * fx)
      const sy = fy * fy * (3 - 2 * fy)
      const idx = (a: number, b: number) => g[(b % (cells + 1)) * (cells + 1) + (a % (cells + 1))]
      const a = idx(x0, y0)
      const b = idx(x0 + 1, y0)
      const c = idx(x0, y0 + 1)
      const d = idx(x0 + 1, y0 + 1)
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
    }
  }
  const n1 = lattice(8)
  const n2 = lattice(24)

  const height = new Float32Array(n)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size
      const v = y / size
      height[y * size + x] = n1(u, v) * 0.7 + n2(u, v) * 0.3
    }
  }

  const normalData = new Uint8Array(n * 4)
  const thicknessData = new Uint8Array(n * 4)
  const strength = 2.2
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x
      const hL = height[y * size + ((x - 1 + size) % size)]
      const hR = height[y * size + ((x + 1) % size)]
      const hD = height[((y - 1 + size) % size) * size + x]
      const hU = height[((y + 1) % size) * size + x]
      let nx = (hL - hR) * strength
      let ny = (hD - hU) * strength
      const nz = 1
      const len = Math.hypot(nx, ny, nz)
      nx /= len
      ny /= len
      normalData[i * 4 + 0] = Math.round((nx * 0.5 + 0.5) * 255)
      normalData[i * 4 + 1] = Math.round((ny * 0.5 + 0.5) * 255)
      normalData[i * 4 + 2] = Math.round((nz / len) * 0.5 * 255 + 127)
      normalData[i * 4 + 3] = 255

      const t = Math.round(height[i] * 255)
      thicknessData[i * 4 + 0] = t
      thicknessData[i * 4 + 1] = t
      thicknessData[i * 4 + 2] = t
      thicknessData[i * 4 + 3] = 255
    }
  }

  const mk = (data: Uint8Array) => {
    const tex = new DataTexture(data, size, size, RGBAFormat)
    tex.wrapS = RepeatWrapping
    tex.wrapT = RepeatWrapping
    tex.minFilter = LinearMipmapLinearFilter
    tex.magFilter = LinearFilter
    tex.generateMipmaps = true
    tex.needsUpdate = true
    return tex
  }

  return {
    normalMap: mk(normalData),
    thicknessMap: mk(thicknessData),
    /** Uncompressed RGBA8 bytes, both maps, mip chain included. */
    bytes: Math.round(size * size * 4 * 2 * 1.3333),
  }
}

export interface MembraneParams {
  approach: MembraneApproach
  tokens: SceneTokens
  /** 0-based index within the stack; outer layers are thinner and clearer. */
  index: number
  layers: number
  normalMap: DataTexture
  thicknessMap: DataTexture
  /** Double-sided membranes cost an extra backside pass per layer in three. */
  doubleSided: boolean
}

/**
 * Shared uniforms for the fresnel approximation, kept out of the material so
 * the state machine can drive them without recompiling a program.
 */
export interface FresnelUniforms {
  uScatterColor: IUniform<Color>
  uRimColor: IUniform<Color>
  uScatterStrength: IUniform<number>
  uRimStrength: IUniform<number>
  uFresnelPower: IUniform<number>
  uBaseAlpha: IUniform<number>
  uFresnelAlpha: IUniform<number>
}

/**
 * MeshPhysicalMaterial configured from tokens/scene.css.
 *
 * Outer layers of a stack are made progressively thinner and rougher: a stack of
 * identical shells reads as a rendering artefact rather than as tissue, and the
 * art direction calls for selective admission surfaces, not glass onions.
 */
export function makePhysicalMembrane(p: MembraneParams): MeshPhysicalMaterial {
  const { tokens, index, layers, normalMap } = p
  const depth = layers > 1 ? index / (layers - 1) : 0
  const mat = new MeshPhysicalMaterial({
    color: new Color('#7f8ea6'),
    transmission: tokens.membraneTransmission,
    thickness: tokens.membraneThickness * (0.7 + depth * 0.9),
    ior: tokens.membraneIor,
    roughness: 0.16 + depth * 0.1,
    metalness: 0,
    attenuationColor: new Color('#22323f'),
    attenuationDistance: 1.4,
    normalMap,
    // NOT transparent, and opacity is never touched.
    //
    // A transmissive MeshPhysicalMaterial already carries its own see-through;
    // adding alpha blending on top double-counts it and the membrane fades to
    // nothing instead of refracting. three routes any material with
    // transmission > 0 into the transmissive render list regardless of the
    // `transparent` flag (WebGLRenderList.push), so nothing is lost by leaving
    // it off. Membrane presence is expressed through thickness instead — see
    // applyPhysicalPresence.
    transparent: false,
    side: p.doubleSided ? DoubleSide : FrontSide,
    depthWrite: false,
  })
  mat.normalScale.set(1.0, 1.0)
  return mat
}

/**
 * Maps the state table's `membrane` column onto a transmissive material.
 *
 * Opacity would be the obvious channel and it is the wrong one: see above. A
 * membrane that is "more present" is physically THICKER — it attenuates and
 * refracts more — so presence drives thickness and attenuation distance, and the
 * token values for transmission and IOR are never altered by a state change.
 */
export function applyPhysicalPresence(mat: MeshPhysicalMaterial, tokens: SceneTokens, presence: number, index: number, layers: number) {
  const depth = layers > 1 ? index / (layers - 1) : 0
  const p = Math.max(0, Math.min(1, presence / 0.55)) // 0.55 is the table maximum
  mat.thickness = tokens.membraneThickness * (0.7 + depth * 0.9) * (0.35 + p * 1.65)
  mat.attenuationDistance = 3.4 - p * 2.2
  mat.roughness = 0.16 + depth * 0.1 + p * 0.06
}

/** The baked tier 2/1 fallback. No transmission, no extra pass. */
export function makeBakedMembrane(p: MembraneParams): MeshPhysicalMaterial {
  const { tokens, index, layers, normalMap, thicknessMap } = p
  const depth = layers > 1 ? index / (layers - 1) : 0
  const mat = new MeshPhysicalMaterial({
    color: new Color('#55657d'),
    transmission: 0,
    roughness: 0.28 + depth * 0.12,
    metalness: 0,
    normalMap,
    // The thickness map still carries the authored variation; it just drives
    // albedo modulation instead of a refraction path length.
    alphaMap: thicknessMap,
    opacity: 0.42 - depth * 0.06,
    transparent: true,
    side: FrontSide,
    depthWrite: false,
    envMapIntensity: tokens.rimIntensity,
  })
  mat.normalScale.set(0.6, 0.6)
  return mat
}

/**
 * Fresnel + analytic scatter. One pass, no render target.
 *
 * The injected fragment code approximates the path length through the shell
 * from the view/normal angle and tints by it. It reproduces the RIM READ of a
 * transmissive membrane and none of its refraction: nothing behind the shell is
 * displaced. That distinction is why it is labelled an approximation in the UI
 * and in every benchmark row it appears in.
 */
export function makeFresnelMembrane(p: MembraneParams): {
  material: MeshPhysicalMaterial
  uniforms: FresnelUniforms
} {
  const { tokens, index, layers, normalMap } = p
  const depth = layers > 1 ? index / (layers - 1) : 0

  const uniforms: FresnelUniforms = {
    uScatterColor: { value: new Color('#3f5f78') },
    uRimColor: { value: new Color(tokens.rimColor) },
    uScatterStrength: { value: 0.34 - depth * 0.08 },
    uRimStrength: { value: 0.55 },
    uFresnelPower: { value: 2.6 },
    uBaseAlpha: { value: 0.2 + depth * 0.04 },
    uFresnelAlpha: { value: 0.6 },
  }

  const mat = new MeshPhysicalMaterial({
    color: new Color('#33445a'),
    transmission: 0,
    roughness: 0.2 + depth * 0.1,
    metalness: 0,
    normalMap,
    transparent: true,
    side: FrontSide,
    depthWrite: false,
  })
  mat.normalScale.set(0.5, 0.5)

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec3 uScatterColor;
        uniform vec3 uRimColor;
        uniform float uScatterStrength;
        uniform float uRimStrength;
        uniform float uFresnelPower;
        uniform float uBaseAlpha;
        uniform float uFresnelAlpha;`,
      )
      .replace(
        '#include <opaque_fragment>',
        `#include <opaque_fragment>
        {
          // The local "normal" is declared by normal_fragment_begin and
          // perturbed by normal_fragment_maps, so the membrane's normal map
          // participates in the fresnel rather than being decorative.
          vec3 nrm = normalize( normal );
          vec3 vdir = normalize( vViewPosition );
          float nv = clamp( dot( nrm, vdir ), 0.0, 1.0 );
          // 1/nv is the path length through a thin shell at grazing angles;
          // clamped so the approximation cannot blow up at the silhouette.
          float pathLength = clamp( 1.0 / max( nv, 0.12 ) - 1.0, 0.0, 3.0 );
          float fres = pow( 1.0 - nv, uFresnelPower );
          gl_FragColor.rgb += uScatterColor * pathLength * uScatterStrength;
          gl_FragColor.rgb += uRimColor * fres * uRimStrength;
          gl_FragColor.a = clamp( uBaseAlpha + fres * uFresnelAlpha, 0.0, 1.0 );
        }`,
      )
  }
  // Without a distinct cache key three would share one compiled program across
  // materials whose injected source differs only by uniform values. It does not
  // here, but relying on that is exactly the kind of silent coupling that makes
  // a scene break when a second variant is added later.
  mat.customProgramCacheKey = () => `neuruh-fresnel-membrane`

  return { material: mat, uniforms }
}
