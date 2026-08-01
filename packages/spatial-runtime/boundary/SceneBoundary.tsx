'use client'

/**
 * The tier gate — the outermost edge of the WebGL boundary.
 *
 * This module and everything it imports are three-free by construction, and that
 * is the whole point. Capability detection has to happen BEFORE the scene chunk
 * is requested, otherwise a device with no WebGL context downloads the entire
 * WebGL runtime in order to discover it cannot use it.
 *
 * That was a measured defect, not a hypothetical: with detection inside the
 * dynamically imported scene module, tier 0 still pulled 399.7 KB, of which
 * 236.6 KB was a renderer it would never construct.
 *
 * So the order here is load-bearing:
 *   1. render the DOM layer (already parsed and screen-readable)
 *   2. detect capability — no WebGL code involved
 *   3. tier 0 -> authored static composition, and STOP. Nothing else is fetched.
 *   4. tier 1-3 -> now, and only now, request the scene chunk
 */

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { detectCapability, type Capability, type MotionRoute, type Tier } from '@/lib/capability'
import { getHarness } from '@/lib/metrics'
import { Tier0 } from '@/components/dom/Tier0'

export function SceneBoundary({
  children,
  onCapability,
  forcedTier,
  forcedMotion,
}: {
  /** Called only when a scene should exist. */
  children: (capability: Capability, onFailure: (reason: string) => void) => ReactNode
  onCapability?: (c: Capability) => void
  forcedTier?: Tier
  forcedMotion?: MotionRoute
}) {
  const [capability, setCapability] = useState<Capability | null>(null)
  const [failure, setFailure] = useState<string | null>(null)

  useEffect(() => {
    const detected = detectCapability()
    const cap: Capability = {
      ...detected,
      ...(forcedTier === undefined ? {} : { tier: forcedTier, overridden: true, reason: `route override tier=${forcedTier}` }),
      ...(forcedMotion === undefined ? {} : { motion: forcedMotion, motionOverridden: true }),
    }
    getHarness().mark('capabilityResolved')
    setCapability(cap)
  }, [forcedMotion, forcedTier])

  const onFailure = useCallback((reason: string) => setFailure(reason), [])

  const effective: Capability | null = capability
    ? failure
      ? { ...capability, tier: 0, reason: failure }
      : capability
    : null

  useEffect(() => {
    if (!effective) return
    document.documentElement.setAttribute('data-scene-tier', String(effective.tier))
    document.documentElement.setAttribute('data-motion-route', effective.motion)
    getHarness().meta = {
      ...getHarness().meta,
      tier: effective.tier,
      tierReason: effective.reason,
      motion: effective.motion,
      gpu: effective.gpu,
      dpr: effective.dpr,
    }
    onCapability?.(effective)
  }, [effective, onCapability])

  if (!effective) return null
  if (effective.tier === 0) return <Tier0 reason={effective.reason} />
  return <>{children(effective, onFailure)}</>
}
