'use client'

/**
 * The membrane stack — Direction A's entire material argument.
 *
 * Geometry follows ASSET_MANIFEST.yaml `membrane_sheets`: subdivided sheets with
 * PROCEDURAL DISPLACEMENT AT RUNTIME, not baked geometry. They are curved
 * canopies over the tissue, not closed glass spheres: a stack of concentric
 * spheres is the cheap way to make transmission look impressive and it is not
 * what the direction asks for.
 *
 * All four candidate approaches render the same geometry under the same lights
 * from the same tokens, so the benchmark compares materials and nothing else.
 */

import { useEffect, useMemo, useRef } from 'react'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { BufferAttribute, Group, SphereGeometry, type Material } from 'three'
import { mulberry32 } from '@/lib/rng'
import {
  applyPhysicalPresence,
  makeBakedMembrane,
  makeFresnelMembrane,
  makePhysicalMembrane,
  makeMembraneMaps,
  type MembraneApproach,
} from '@/lib/membraneMaterials'
import type { MeshPhysicalMaterial } from 'three'
import type { SceneTokens } from '@/lib/sceneTokens'

export interface MembraneReport {
  approach: MembraneApproach
  layers: number
  /** Triangles across the whole stack. */
  triangles: number
  /** Bytes of procedurally generated texture, uncompressed RGBA8 + mips. */
  proceduralTextureBytes: number
  segments: [number, number]
}

/**
 * One membrane sheet. Displacement is seeded, so a screenshot taken with the
 * same ?seed= is byte-comparable — the visual-regression requirement in
 * ENGINEERING_HANDOFF.md §5.
 */
function makeSheetGeometry(radius: number, widthSeg: number, heightSeg: number, seed: number) {
  const g = new SphereGeometry(radius, widthSeg, heightSeg, -Math.PI * 0.62, Math.PI * 1.24, 0, Math.PI * 0.66)
  const pos = g.attributes.position as BufferAttribute
  const rand = mulberry32(seed)

  // Two-frequency radial displacement. The membrane must read as a grown
  // surface admitting selectively, not as a machined dome.
  const offsets = new Float32Array(pos.count)
  for (let i = 0; i < pos.count; i++) offsets[i] = rand()

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const len = Math.hypot(x, y, z) || 1
    const d =
      Math.sin(x * 2.6 + offsets[i] * 0.6) * 0.045 +
      Math.sin(z * 3.9 + y * 1.7) * 0.028 +
      (offsets[i] - 0.5) * 0.012
    const k = (len + d) / len
    pos.setXYZ(i, x * k, y * k, z * k)
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
  return g
}

export function Membranes({
  approach,
  layers,
  tokens,
  seed,
  presence,
  segments,
  doubleSided,
  ssrResolution,
  ssrSamples,
  onReport,
}: {
  approach: MembraneApproach
  layers: number
  tokens: SceneTokens
  seed: number
  /** 0.18..0.55 from the state table's `membrane` column. */
  presence: number
  segments: [number, number]
  doubleSided: boolean
  ssrResolution: number
  ssrSamples: number
  onReport?: (r: MembraneReport) => void
}) {
  const group = useRef<Group>(null)

  const maps = useMemo(() => makeMembraneMaps(512, seed), [seed])

  const sheets = useMemo(() => {
    const out: Array<{ geometry: SphereGeometry; radius: number; index: number }> = []
    for (let i = 0; i < layers; i++) {
      // Radii start outside the tier-3 block's half-diagonal (2.39) so every
      // sheet encloses the tissue. A sheet inside the block is not a membrane,
      // it is an invisible cost.
      const radius = 2.55 + i * 0.36
      out.push({ geometry: makeSheetGeometry(radius, segments[0], segments[1], seed + i * 977), radius, index: i })
    }
    return out
  }, [layers, segments, seed])

  const materials = useMemo(() => {
    if (approach === 'ssr') return null // built as JSX below; drei owns its lifecycle
    return sheets.map(({ index }) => {
      const params = {
        approach,
        tokens,
        index,
        layers,
        normalMap: maps.normalMap,
        thicknessMap: maps.thicknessMap,
        doubleSided,
      }
      if (approach === 'physical') return makePhysicalMembrane(params)
      if (approach === 'baked') return makeBakedMembrane(params)
      return makeFresnelMembrane(params).material
    })
  }, [approach, sheets, tokens, layers, maps, doubleSided])

  useEffect(() => {
    if (!materials) return
    materials.forEach((m, index) => {
      if (approach === 'physical') {
        // Thickness, not opacity — a transmissive material already carries its
        // own see-through and alpha-blending it as well erases the refraction.
        applyPhysicalPresence(m as MeshPhysicalMaterial, tokens, presence, index, layers)
      } else {
        // The alpha-blended approaches genuinely do express presence as opacity.
        ;(m as Material).opacity = Math.min(1, presence * 1.9)
        ;(m as Material).transparent = true
      }
    })
  }, [materials, presence, approach, tokens, layers])

  useEffect(() => {
    const triangles = sheets.reduce((sum, s) => sum + (s.geometry.index?.count ?? 0) / 3, 0)
    onReport?.({
      approach,
      layers,
      triangles: Math.round(triangles),
      proceduralTextureBytes: maps.bytes,
      segments,
    })
  }, [sheets, approach, layers, maps.bytes, segments, onReport])

  useEffect(
    () => () => {
      sheets.forEach((s) => s.geometry.dispose())
      materials?.forEach((m) => m.dispose())
    },
    [sheets, materials],
  )

  useEffect(
    () => () => {
      maps.normalMap.dispose()
      maps.thicknessMap.dispose()
    },
    [maps],
  )

  if (layers === 0) return null

  return (
    <group ref={group} position={[0, 0.06, 0]}>
      {sheets.map(({ geometry, index }) =>
        approach === 'ssr' ? (
          <mesh key={index} geometry={geometry} renderOrder={10 - index}>
            {/*
              drei's MeshTransmissionMaterial keeps its OWN frame buffer per
              material instance and renders the scene into it every frame, so the
              stack cost is expected to scale with layer count. That is the whole
              reason it is measured separately from three's built-in transmission.
            */}
            <MeshTransmissionMaterial
              transmission={tokens.membraneTransmission}
              thickness={
                tokens.membraneThickness *
                (0.7 + (layers > 1 ? index / (layers - 1) : 0) * 0.9) *
                (0.35 + Math.min(1, presence / 0.55) * 1.65)
              }
              ior={tokens.membraneIor}
              roughness={0.18}
              chromaticAberration={0.035}
              anisotropicBlur={0.4}
              distortion={0.15}
              distortionScale={0.3}
              temporalDistortion={0}
              resolution={ssrResolution}
              samples={ssrSamples}
              backside={false}
              opacity={1}
              normalMap={maps.normalMap}
              normalScale={[0.5, 0.5]}
            />
          </mesh>
        ) : (
          <mesh
            key={index}
            geometry={geometry}
            material={materials![index]}
            renderOrder={10 - index}
            visible={presence > 0.001}
          />
        ),
      )}
    </group>
  )
}
