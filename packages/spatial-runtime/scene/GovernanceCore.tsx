'use client'

/**
 * The governance core.
 *
 * ASSET_MANIFEST.yaml is unambiguous about what this object is: "Hard-edged and
 * machined by design. It must remain visually opposite to everything around it —
 * a smooth or glowing core is a direction violation, not a style choice."
 *
 * So: faceted, flat-shaded, brass, high metalness. It lights only in `gating`,
 * `receipt` and `entry` (SCENE_CONTRACT.md §1, `core lit` column) and even then
 * the emissive is the authority token, not an arbitrary glow.
 */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, DodecahedronGeometry, Mesh, MeshStandardMaterial } from 'three'
import type { SceneTokens } from '@/lib/sceneTokens'

export function GovernanceCore({
  tokens,
  presence,
  lit,
  paused,
}: {
  tokens: SceneTokens
  /** 0.25..1.0 from the state table's `core` column. */
  presence: number
  lit: boolean
  paused: boolean
}) {
  const ref = useRef<Mesh>(null)

  const { geometry, material } = useMemo(() => {
    // Detail 0 keeps the facets large enough to read as machined planes rather
    // than as a sphere approximation.
    const g = new DodecahedronGeometry(0.42, 0)
    const m = new MeshStandardMaterial({
      color: new Color('#8d7136'),
      roughness: tokens.metalRoughness,
      metalness: tokens.metalMetalness,
      emissive: new Color(tokens.emissiveIlluminated),
      emissiveIntensity: 0,
      flatShading: true,
    })
    return { geometry: g, material: m }
  }, [tokens])

  useEffect(() => {
    material.emissiveIntensity = lit ? 0.55 * presence : 0
    const s = 0.72 + presence * 0.42
    ref.current?.scale.setScalar(s)
  }, [material, lit, presence])

  useFrame((state) => {
    if (paused || !ref.current) return
    // A slow settle, not a spin. "Neuruh does not bounce; it settles."
    ref.current.rotation.y = state.clock.elapsedTime * 0.06
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.11) * 0.05
  })

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  return <mesh ref={ref} geometry={geometry} material={material} position={[0, 0.3, 0]} />
}
