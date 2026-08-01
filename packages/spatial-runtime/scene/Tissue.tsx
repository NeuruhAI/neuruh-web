'use client'

/**
 * The internal structural layer: hexagonally packed engineered tissue.
 *
 * One InstancedMesh, one draw call, per-cell state in an instanced attribute.
 * This is the layer the membrane refracts, so it is also the thing that makes a
 * transmission measurement meaningful — refracting an empty scene would be a
 * cheap and dishonest benchmark.
 */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CylinderGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
} from 'three'
import { buildTissue, type TissueData } from '@/lib/tissue'
import { makeTissueMaterial, type TissueUniforms } from '@/lib/tissueMaterial'
import type { SceneTokens } from '@/lib/sceneTokens'
import type { TierProfile } from '@/lib/capability'

export interface TissueHandle {
  uniforms: TissueUniforms
  data: TissueData
}

export function Tissue({
  profile,
  seed,
  tokens,
  focusRadius,
  traceProgress,
  emissiveGain = 1,
  paused,
  pinnedTime = null,
  onBuilt,
}: {
  profile: TierProfile
  seed: number
  tokens: SceneTokens
  focusRadius: number
  traceProgress: number
  emissiveGain?: number
  paused: boolean
  /**
   * `?frame=N` pins the shader clock to N/60 s so a capture is reproducible —
   * the visual-regression requirement in ENGINEERING_HANDOFF.md §5. Null runs
   * the clock normally.
   */
  pinnedTime?: number | null
  onBuilt?: (h: TissueHandle) => void
}) {
  const ref = useRef<InstancedMesh>(null)

  const { geometry, material, uniforms, data } = useMemo(() => {
    const d = buildTissue(profile, seed)
    // A 6-sided cylinder is a hexagonal prism. `openEnded: false` keeps the caps,
    // which the key light needs to read the block as machined rather than as a
    // field of tubes.
    const g = new CylinderGeometry(d.hexRadius * 0.92, d.hexRadius * 0.96, 1, 6, 1, false)
    const { material: m, uniforms: u } = makeTissueMaterial(tokens)
    return { geometry: g, material: m, uniforms: u, data: d }
  }, [profile, seed, tokens])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m4 = new Matrix4()
    for (let i = 0; i < data.count; i++) {
      m4.fromArray(data.matrices, i * 16)
      mesh.setMatrixAt(i, m4)
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.geometry.setAttribute('aState', new InstancedBufferAttribute(data.state, 1))
    mesh.geometry.setAttribute('aSeed', new InstancedBufferAttribute(data.seed, 1))
    mesh.geometry.setAttribute('aDistance', new InstancedBufferAttribute(data.distance, 1))
    mesh.frustumCulled = false
    onBuilt?.({ uniforms, data })
  }, [data, uniforms, onBuilt])

  useEffect(() => {
    uniforms.uFocusRadius.value = focusRadius
    uniforms.uTraceProgress.value = traceProgress
    uniforms.uEmissiveGain.value = emissiveGain
  }, [uniforms, focusRadius, traceProgress, emissiveGain])

  useEffect(() => {
    if (pinnedTime !== null) uniforms.uTime.value = pinnedTime
  }, [uniforms, pinnedTime])

  useFrame((state) => {
    // On the reduced-motion route the clock stops: the state change survives,
    // the travel does not (SCENE_CONTRACT.md §8). A pinned frame freezes it at
    // an exact instant instead.
    if (!paused && pinnedTime === null) uniforms.uTime.value = state.clock.elapsedTime
  })

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  return <instancedMesh ref={ref} args={[geometry, material, data.count]} castShadow={false} receiveShadow={false} />
}
