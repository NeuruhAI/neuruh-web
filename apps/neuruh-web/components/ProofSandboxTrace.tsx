'use client'

import { useTrace } from '@/lib/useTrace'
import { SandboxTrace } from './SandboxTrace'

export function ProofSandboxTrace() {
  const trace = useTrace(false, false)
  return <SandboxTrace step={trace.step} complete={trace.complete} onStart={trace.start} onReset={trace.reset} />
}
