'use client'

import { useEffect } from 'react'

/** Marks the reduced-motion route on <html> (SCENE_CONTRACT §8: a route, not a disabled animation). */
export function MotionRoute({ mode }: { mode: 'reduced' }) {
  useEffect(() => {
    document.documentElement.dataset.motionRoute = mode
    return () => { delete document.documentElement.dataset.motionRoute }
  }, [mode])
  return null
}
