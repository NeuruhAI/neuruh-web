'use client'

/**
 * The three-light rig from tokens/scene.css.
 *
 * Key is brass because, in the design system's words, illumination IS the brand
 * accent — the same semantic that governs the DOM governs the scene. Nothing
 * here is a magic number; every value is read from the tokens.
 */

import { useMemo } from 'react'
import type { SceneTokens } from '@/lib/sceneTokens'

export function LightRig({ tokens, intensityScale = 1 }: { tokens: SceneTokens; intensityScale?: number }) {
  const rig = useMemo(
    () => ({
      key: { color: tokens.keyColor, intensity: tokens.keyIntensity * intensityScale },
      fill: { color: tokens.fillColor, intensity: tokens.fillIntensity * intensityScale },
      rim: { color: tokens.rimColor, intensity: tokens.rimIntensity * intensityScale },
      ambient: tokens.ambient * intensityScale,
    }),
    [tokens, intensityScale],
  )

  return (
    <>
      <ambientLight intensity={rig.ambient} />
      {/* Key — motivated by the cell's own recognition event (ASSET_MANIFEST). */}
      <directionalLight position={[3.4, 5.2, 2.6]} color={rig.key.color} intensity={rig.key.intensity} />
      {/* Fill — cool mineral bounce. */}
      <directionalLight position={[-4.2, 1.1, -1.4]} color={rig.fill.color} intensity={rig.fill.intensity} />
      {/* Rim — cold separation edge, behind and above. */}
      <directionalLight position={[-1.2, 2.8, -5.6]} color={rig.rim.color} intensity={rig.rim.intensity} />
    </>
  )
}
