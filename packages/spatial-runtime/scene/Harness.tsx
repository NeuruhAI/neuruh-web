'use client'

/**
 * Binds the measurement harness to the live R3F renderer.
 *
 * Lives inside <Canvas> so it sees the real renderer, scene and camera rather
 * than a reconstruction. Everything the benchmarks report flows through here.
 */

import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { getHarness } from '@/lib/metrics'

export function Harness({ onReady }: { onReady?: () => void }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const setFrameloop = useThree((s) => s.setFrameloop)

  useEffect(() => {
    const h = getHarness()
    h.attach(gl, scene, camera)
    h.mark('sceneBuilt')
    h.setFrameloop = setFrameloop

    // Shader compile is measured once, before the first animated frame, so the
    // stall is attributed to compilation instead of hiding inside frame 1.
    try {
      h.compileAndMeasure()
    } catch (err) {
      h.recordError(`compileAndMeasure: ${String(err)}`)
    }

    const raf = requestAnimationFrame(() => {
      h.mark('firstFrame')
      h.ready = true
      onReady?.()
    })
    return () => cancelAnimationFrame(raf)
  }, [gl, scene, camera, setFrameloop, onReady])

  // One tick per rendered frame. The harness times the interval itself.
  useFrame(() => {
    getHarness().tick()
  })

  return null
}
