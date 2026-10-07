'use client'

import { ALIVE_TRACE_STEPS } from '../../../packages/public-truth/experience'

export function SandboxTrace({
  step,
  complete,
  onStart,
  onReset,
}: {
  step: number
  complete: boolean
  onStart: () => void
  onReset: () => void
}) {
  return (
    <div className="trace" data-testid="trace">
      <div className="trace__head">
        <div>
          <p className="n-label">SANDBOX decision / receipt trace</p>
          <p>No external write occurs.</p>
        </div>
        <button className="n-btn n-btn--ghost t-ui-sm" onClick={onReset} data-testid="trace-reset" type="button">
          Reset
        </button>
      </div>
      <div className="row">
        <button className="n-btn n-btn--primary t-ui-sm" onClick={onStart} data-testid="trace-start" type="button">
          Run sandbox trace
        </button>
      </div>
      <div className="trace__steps">
        {ALIVE_TRACE_STEPS.map((item, stepIndex) => (
          <div
            key={item.id}
            className={`trace__step${step > stepIndex ? ' is-on' : ''}${stepIndex === ALIVE_TRACE_STEPS.length - 1 && complete ? ' is-receipt' : ''}`}
            data-testid={`trace-step-${item.id}`}
            data-on={step > stepIndex ? 'true' : 'false'}
          >
            <span className="trace__s">{item.id}</span>
            <div>
              <p className="trace__claim">{item.claim}</p>
              <p className="trace__prov">{item.provenance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
