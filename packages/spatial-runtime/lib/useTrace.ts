'use client'

/**
 * The signature interaction — trace the evidence channel.
 *
 * SCENE_CONTRACT.md §6: six hops, each with real provenance, advancing on a
 * 760 ms cadence (220 ms on the reduced-motion route). On completion the traced
 * channel holds spectral green and does not fade.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { TRACE_CADENCE_MS, TRACE_STEPS } from './sceneStates'

export function useTrace(reducedMotion: boolean, autoStart = false) {
  const [step, setStep] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (timer.current !== null) {
      clearInterval(timer.current)
      timer.current = null
    }
  }, [])

  const start = useCallback(() => {
    stop()
    setStep(1)
    const cadence = reducedMotion ? TRACE_CADENCE_MS.reduced : TRACE_CADENCE_MS.full
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= TRACE_STEPS.length) {
          stop()
          return s
        }
        return s + 1
      })
    }, cadence)
  }, [reducedMotion, stop])

  const reset = useCallback(() => {
    stop()
    setStep(0)
  }, [stop])

  useEffect(() => {
    if (autoStart) start()
    return stop
  }, [autoStart, start, stop])

  useEffect(() => stop, [stop])

  const complete = step >= TRACE_STEPS.length
  // Progress reaches 1 only on the receipt hop, so the trace front in the shader
  // and the DOM step list can never disagree about whether it finished.
  const progress = step === 0 ? 0 : step / TRACE_STEPS.length

  return { step, progress, complete, start, reset }
}
