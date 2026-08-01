'use client'

/**
 * Camera rig — five named positions, dolly and rack-focus only.
 *
 * DESIGN_LOCK.md: "Orbit is forbidden — it is Direction B's language and using
 * it here breaks the claim that you are inside the tissue."
 *
 * This module enforces that structurally rather than by convention: the camera's
 * azimuth and elevation are CONSTANTS. The only quantities that animate are the
 * dolly distance along a fixed view axis and the pivot the camera looks at.
 * There is no code path here that can orbit, so a later edit that tries to will
 * have to delete this comment first.
 */

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Vector3 } from 'three'
import { BASE_DISTANCE, CAMERA_POSES, type CameraName } from '@/lib/sceneStates'

/** Fixed viewing axis. Not a variable, not a prop, not exported. */
const AZIMUTH = Math.PI * 0.18
const ELEVATION = Math.PI * 0.17

export function CameraRig({
  pose,
  fov,
  damping,
  /** Reduced motion turns camera transitions into cuts (SCENE_CONTRACT.md §8). */
  cut,
  onFocus,
}: {
  pose: CameraName
  fov: number
  damping: number
  cut: boolean
  onFocus?: (focus: number) => void
}) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const target = useRef(new Vector3())
  const desired = useRef(new Vector3())
  const pivot = useRef(new Vector3())
  const initialised = useRef(false)

  useEffect(() => {
    camera.fov = fov
    camera.near = 0.1
    camera.far = 120
    camera.updateProjectionMatrix()
  }, [camera, fov])

  useEffect(() => {
    onFocus?.(CAMERA_POSES[pose].focus)
  }, [pose, onFocus])

  useFrame((_, delta) => {
    const p = CAMERA_POSES[pose]
    const distance = BASE_DISTANCE / p.scale
    pivot.current.set(p.pivot[0], p.pivot[1] + 0.22, p.pivot[2])

    desired.current.set(
      pivot.current.x + Math.sin(AZIMUTH) * Math.cos(ELEVATION) * distance,
      pivot.current.y + Math.sin(ELEVATION) * distance,
      pivot.current.z + Math.cos(AZIMUTH) * Math.cos(ELEVATION) * distance,
    )

    if (cut || !initialised.current) {
      camera.position.copy(desired.current)
      target.current.copy(pivot.current)
      initialised.current = true
    } else {
      // Frame-rate independent damping. A raw lerp factor would make the camera
      // travel at a different speed on a 120 Hz display, which is exactly the
      // kind of thing that reads as "the animation feels wrong on my machine".
      const k = 1 - Math.pow(damping, delta * 60)
      camera.position.lerp(desired.current, k)
      target.current.lerp(pivot.current, k)
    }
    camera.lookAt(target.current)
  })

  return null
}
