'use client'

/**
 * Evidence channels — the evidence-signal trace through the object, and the
 * only interactive scene element (SCENE_CONTRACT.md §5).
 *
 * Accessibility note. The canvas is aria-hidden, so a channel cannot be the
 * accessible control. The keyboard-reachable buttons live in the DOM overlay and
 * drive the same trace state; this component renders the visual consequence.
 * That is the contract's requirement — every scene interaction reachable — met
 * without putting essential affordances inside WebGL.
 */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CatmullRomCurve3,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  TubeGeometry,
  Vector3,
} from 'three'
import { buildChannelCurves } from '@/lib/tissue'
import type { SceneTokens } from '@/lib/sceneTokens'

export function Channels({
  count,
  seed,
  extentX,
  tokens,
  presence,
  liveCount,
  traceProgress,
  traceComplete,
  paused,
  onPointerDown,
}: {
  count: number
  seed: number
  extentX: number
  tokens: SceneTokens
  /** 0..1 from the state table's `channels` column. */
  presence: number
  /** Integer from the state table's `live channels` column. */
  liveCount: number
  traceProgress: number
  traceComplete: boolean
  paused: boolean
  onPointerDown?: () => void
}) {
  const group = useRef<Group>(null)

  const built = useMemo(() => {
    const curves = buildChannelCurves(count, seed, extentX)
    return curves.map((pts, i) => {
      const curve = new CatmullRomCurve3(pts as Vector3[])
      const geometry = new TubeGeometry(curve, 34, 0.026, 6, false)
      const material = new MeshStandardMaterial({
        color: new Color('#4c5f78'),
        roughness: 0.24,
        metalness: 0.1,
        emissive: new Color(tokens.emissiveDormant),
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0,
      })
      return { geometry, material, index: i }
    })
  }, [count, seed, extentX, tokens])

  useEffect(() => {
    built.forEach(({ material, index }) => {
      material.opacity = presence
      const isLive = index < liveCount
      const isTraced = index === 0 && traceProgress > 0

      if (isTraced) {
        // The traced channel holds spectral green and does not fade. It is the
        // only sustained green in the site because it is the only place
        // something is finished (SCENE_CONTRACT.md §6).
        material.emissive.set(tokens.emissiveVerified)
        material.emissiveIntensity = traceComplete ? 1.5 : 0.4 + traceProgress * 1.0
      } else if (isLive) {
        material.emissive.set(tokens.emissiveIlluminated)
        material.emissiveIntensity = 0.5 * presence
      } else {
        material.emissive.set(tokens.emissiveDormant)
        material.emissiveIntensity = 0
      }
    })
  }, [built, presence, liveCount, traceProgress, traceComplete, tokens])

  useFrame((state) => {
    if (paused || !group.current) return
    // Live channels carry a slow transport pulse. Dormant ones do not move —
    // motion here means something is travelling, not that the page is alive.
    built.forEach(({ material, index }) => {
      if (index >= liveCount || (index === 0 && traceComplete)) return
      const phase = state.clock.elapsedTime * 0.9 + index * 1.7
      material.emissiveIntensity = (0.34 + 0.22 * (0.5 + 0.5 * Math.sin(phase))) * presence
    })
  })

  useEffect(
    () => () => {
      built.forEach(({ geometry, material }) => {
        geometry.dispose()
        material.dispose()
      })
    },
    [built],
  )

  return (
    <group ref={group} onPointerDown={onPointerDown}>
      {built.map(({ geometry, material, index }) => (
        <mesh key={index} geometry={geometry} material={material} visible={presence > 0.001} />
      ))}
    </group>
  )
}

/** Receipt filaments — inbound proof, present only in `receipt` and `entry`. */
export function Filaments({
  presence,
  tokens,
  seed,
  paused,
}: {
  presence: number
  tokens: SceneTokens
  seed: number
  paused: boolean
}) {
  const group = useRef<Group>(null)
  const built = useMemo(() => {
    const items: Array<{ geometry: TubeGeometry; material: MeshStandardMaterial }> = []
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + (seed % 7) * 0.11
      const curve = new CatmullRomCurve3([
        new Vector3(Math.cos(a) * 3.6, 1.7, Math.sin(a) * 3.6),
        new Vector3(Math.cos(a) * 2.2, 1.0, Math.sin(a) * 2.2),
        new Vector3(Math.cos(a) * 1.0, 0.5, Math.sin(a) * 1.0),
        new Vector3(0, 0.32, 0),
      ])
      items.push({
        geometry: new TubeGeometry(curve, 24, 0.013, 5, false),
        material: new MeshStandardMaterial({
          color: new Color('#2a3140'),
          emissive: new Color(tokens.emissiveVerified),
          emissiveIntensity: 0,
          roughness: 0.4,
          transparent: true,
          opacity: 0,
        }),
      })
    }
    return items
  }, [tokens, seed])

  useEffect(() => {
    built.forEach(({ material }) => {
      material.opacity = presence
      material.emissiveIntensity = 0.9 * presence
    })
  }, [built, presence])

  useFrame((state) => {
    if (paused || !group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  useEffect(
    () => () => {
      built.forEach(({ geometry, material }) => {
        geometry.dispose()
        material.dispose()
      })
    },
    [built],
  )

  return (
    <group ref={group}>
      {built.map(({ geometry, material }, i) => (
        <mesh key={i} geometry={geometry} material={material} visible={presence > 0.001} />
      ))}
    </group>
  )
}

export type { Mesh }
