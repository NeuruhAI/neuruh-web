'use client'

import { useEffect } from 'react'
import { ALIVE_TRACE_STEPS } from '../../../packages/public-truth/experience'
import { useTrace } from '@/lib/useTrace'

/**
 * The governed-trace demo: a sandboxed walk from signal to receipt in which
 * the authority gate withholds the production action. Preserves the trace
 * contract testids (trace-start / trace-step-* / R to reset).
 */
export function PipelineTrace({ reduced = false }: { reduced?: boolean }) {
  const trace = useTrace(reduced, false)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null
      if (el && /input|textarea|select/i.test(el.tagName)) return
      if (event.key === 'r' || event.key === 'R') trace.reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [trace])
  return (
    <div className="trace" data-testid="trace">
      <div className="trace__head">
        <div>
          <p className="n-label">Illustrative trace — scripted in your browser</p>
          <p className="sec-sub" style={{ margin: 0 }}>Six scripted steps that show the shape of a governed run. Nothing here touches a Neuruh system: no signal is registered, no gate is consulted, no receipt is written.</p>
        </div>
        <button className="v2-btn v2-btn-secondary t-ui-sm" onClick={trace.reset} data-testid="trace-reset">Reset</button>
      </div>
      <div className="row">
        <button className="v2-btn v2-btn-primary t-ui-sm" onClick={trace.start} data-testid="trace-start">Play the illustration</button>
      </div>
      <div className="trace__steps">
        {ALIVE_TRACE_STEPS.map((step, stepIndex) => (
          <div
            key={step.id}
            className={`trace__step${trace.step > stepIndex ? ' is-on' : ''}${stepIndex === ALIVE_TRACE_STEPS.length - 1 && trace.complete ? ' is-receipt' : ''}`}
            data-testid={`trace-step-${step.id}`}
            data-on={trace.step > stepIndex ? 'true' : 'false'}
          >
            <span className="trace__s">{step.id}</span>
            <div><p className="trace__claim">{step.claim}</p><p className="trace__prov">{step.provenance}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}
