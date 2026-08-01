'use client'

/**
 * Fragments — the unrecognised signal, present in `fragmented` and fading as the
 * cell awakens. One InstancedMesh, one draw call.
 *
 * They are deliberately dull and unlit: an unrecognised fragment has not earned
 * illumination, and making the "broken data" state pretty would undercut the
 * argument the chapter is making.
 */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Euler, InstancedMesh, Matrix4, MeshStandardMaterial, TetrahedronGeometry } from 'three'
import { mulberry32 } from '@/lib/rng'

export function Fragments({
  count,
  seed,
  presence,
  paused,
}: {
  count: number
  seed: number
  /** 0..1 from the state table's `fragments` column. */
  presence: number
  paused: boolean
}) {
  const ref = useRef<InstancedMesh>(null)

  const { geometry, material, placements } = useMemo(() => {
    const rand = mulberry32(seed ^ 0x5f356495)
    const g = new TetrahedronGeometry(0.07, 0)
    const m = new MeshStandardMaterial({
      color: new Color('#39424f'),
      roughness: 0.82,
      metalness: 0.04,
      flatShading: true,
      transparent: true,
      opacity: 0,
    })
    const p = Array.from({ length: count }, () => {
      const a = rand() * Math.PI * 2
      const r = 2.9 + rand() * 2.2
      return {
        x: Math.cos(a) * r,
        y: 0.3 + rand() * 2.4,
        z: Math.sin(a) * r,
        rx: rand() * Math.PI,
        ry: rand() * Math.PI,
        drift: 0.2 + rand() * 0.5,
      }
    })
    return { geometry: g, material: m, placements: p }
  }, [count, seed])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m4 = new Matrix4()
    const euler = new Euler()
    placements.forEach((p, i) => {
      euler.set(p.rx, p.ry, 0, 'XYZ')
      m4.makeRotationFromEuler(euler)
      m4.setPosition(p.x, p.y, p.z)
      mesh.setMatrixAt(i, m4)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.frustumCulled = false
  }, [placements])

  useEffect(() => {
    material.opacity = presence
  }, [material, presence])

  useFrame((state) => {
    const mesh = ref.current
    if (paused || !mesh || presence < 0.001) return
    // Drift, not orbit: fragments are adrift, they are not in a system yet.
    mesh.rotation.y = state.clock.elapsedTime * 0.03
  })

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, count]}
      visible={presence > 0.001}
    />
  )
}
