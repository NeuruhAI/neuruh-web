'use client'

import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import type { ProductMode } from '../../lib/top10'
import { DEMO_BANNER, HARNESS_STAGES } from '../../lib/harnessStages'
import s from './Top10Product.module.css'

export { DEMO_BANNER, HARNESS_STAGES }

type Check = { id: string; group: 'golden' | 'held-out' | 'adversarial'; label: string; ok: boolean; detail: string }

function parse(text: string): Record<string, unknown> | null {
  if (!text.trim()) return null
  try {
    const value = JSON.parse(text)
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function has(parsed: Record<string, unknown> | null, keys: string[], text: string) {
  return keys.some((k) => (parsed ? parsed[k] !== undefined && parsed[k] !== null && parsed[k] !== '' : text.includes(k)))
}

function runChecks(text: string): Check[] {
  const p = parse(text)
  const evidence = p?.evidence ?? p?.evidence_refs
  const evidenceNonEmpty = Array.isArray(evidence) ? evidence.length > 0 : Boolean(evidence)
  const authority = String(p?.authority ?? p?.permission ?? '')
  return [
    { id: 'input', group: 'golden', label: 'Input bound', ok: Boolean(text.trim()), detail: 'An artifact was supplied.' },
    { id: 'json', group: 'golden', label: 'Parses as JSON', ok: Boolean(p), detail: 'Structured artifacts are checked field by field; free text falls back to keyword presence.' },
    { id: 'outcome', group: 'golden', label: 'Outcome field present', ok: has(p, ['outcome', 'result'], text), detail: 'The artifact exposes an outcome or result.' },
    { id: 'identity', group: 'held-out', label: 'Identity bound', ok: has(p, ['sha', 'commit', 'identity', 'version'], text), detail: 'The tested thing is named by sha, commit, version, or identity.' },
    { id: 'evidence', group: 'held-out', label: 'Evidence non-empty', ok: evidenceNonEmpty || (!p && text.includes('evidence')), detail: 'Evidence presence is checked, not assumed.' },
    { id: 'authority', group: 'held-out', label: 'Authority stated and not denied', ok: has(p, ['authority', 'permission'], text) && !/den(y|ied)/i.test(authority), detail: 'Authority or permission is present and is not a denial.' },
    { id: 'secret', group: 'adversarial', label: 'No obvious secret pattern', ok: !/sk_live_|BEGIN PRIVATE KEY|password\s*[:=]/i.test(text), detail: 'Obvious secret patterns are refused.' },
    { id: 'inject', group: 'adversarial', label: 'No instruction-override pattern', ok: !/ignore (all )?(previous|prior) instructions/i.test(text), detail: 'Text that tries to override instructions is flagged.' },
    { id: 'size', group: 'adversarial', label: 'Bounded size', ok: text.length <= 20000, detail: 'Oversized artifacts are refused rather than truncated silently.' },
  ]
}

type Decision = 'PASS' | 'SHADOW' | 'MORE_EVIDENCE' | 'REJECT'

function decide(candidate: Check[], regressions: Check[]): Decision {
  const authority = candidate.find((c) => c.id === 'authority')?.ok
  const evidence = candidate.find((c) => c.id === 'evidence')?.ok
  const adversarial = candidate.filter((c) => c.group === 'adversarial').every((c) => c.ok)
  if (regressions.length || !authority || !adversarial) return 'REJECT'
  if (!evidence) return 'MORE_EVIDENCE'
  if (candidate.every((c) => c.ok)) return 'PASS'
  return 'SHADOW'
}

async function digest(text: string) {
  if (typeof crypto === 'undefined' || !crypto.subtle) return 'unavailable'
  const bytes = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const SAMPLE_BASELINE = '{"sha":"3f2cc79b","evidence":["release-court.json","a11y-report.json"],"permission":"approved","outcome":"PASS"}'
const SAMPLE_CANDIDATE = '{"sha":"e30bb07c","evidence":[],"permission":"approved","outcome":"PASS"}'

export function HarnessDemo() {
  const [baseline, setBaseline] = useState('')
  const [candidate, setCandidate] = useState('')
  const [stage, setStage] = useState(-1)
  const [running, setRunning] = useState(false)
  const [hash, setHash] = useState<string | null>(null)

  const done = stage >= HARNESS_STAGES.length - 1
  const result = useMemo(() => {
    if (!done) return null
    const cand = runChecks(candidate)
    const base = baseline.trim() ? runChecks(baseline) : null
    const regressions = base ? cand.filter((c) => !c.ok && base.find((b) => b.id === c.id)?.ok) : []
    const improvements = base ? cand.filter((c) => c.ok && !base.find((b) => b.id === c.id)?.ok) : []
    return { cand, base, regressions, improvements, decision: decide(cand, regressions), passed: cand.filter((c) => c.ok).length }
  }, [done, candidate, baseline])

  useEffect(() => {
    if (!running) return
    if (stage >= HARNESS_STAGES.length - 1) { setRunning(false); return }
    const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setStage(HARNESS_STAGES.length - 1); return }
    const t = setTimeout(() => setStage((v) => v + 1), 220)
    return () => clearTimeout(t)
  }, [running, stage])

  useEffect(() => {
    if (!done) return
    let live = true
    digest(`${baseline}\n--\n${candidate}`).then((h) => { if (live) setHash(h) })
    return () => { live = false }
  }, [done, baseline, candidate])

  const start = () => { setHash(null); setStage(0); setRunning(true) }
  const reset = () => { setRunning(false); setStage(-1); setHash(null) }

  return (
    <div className={s.demoGrid} data-testid="harness-demo">
      <div>
        <label className={s.label} htmlFor="demo-baseline">Baseline: what the current version produced (optional JSON)</label>
        <textarea id="demo-baseline" className={s.textarea} value={baseline} onChange={(e) => setBaseline(e.target.value)} placeholder={SAMPLE_BASELINE} rows={4} />
        <label className={s.label} htmlFor="demo-candidate">Candidate: what the new version produced (JSON or text)</label>
        <textarea id="demo-candidate" className={s.textarea} value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder={SAMPLE_CANDIDATE} rows={5} />
        <label className={s.fileLabel}>Or choose a local JSON or text file (stays in your browser)
          <input type="file" accept="application/json,.json,text/plain" onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0]?.text().then(setCandidate)} />
        </label>
        <div className={s.buttons}>
          <button type="button" className={s.button} onClick={() => { setBaseline(SAMPLE_BASELINE); setCandidate(SAMPLE_CANDIDATE) }}>Load sample pair</button>
          <button type="button" className={s.button} onClick={start} disabled={running} data-testid="harness-run">Run demonstration</button>
          <button type="button" className={s.buttonGhost} onClick={reset}>Reset</button>
        </div>
        <ol className={s.stages} aria-label="Execution stages" aria-live="polite">
          {HARNESS_STAGES.map((name, i) => (
            <li key={name} className={s.stage} data-state={i < stage ? 'done' : i === stage ? 'active' : 'idle'} data-testid={`harness-stage-${i}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>{name}
            </li>
          ))}
        </ol>
      </div>
      <div className={s.result}>
        {!result ? (
          <>
            <strong>{running ? `Running: ${HARNESS_STAGES[stage]}` : 'Ready.'}</strong>
            <p>Load the sample pair or paste your own, then press run. Each stage lights up as the browser walks the sequence; the result shows the checks, the delta against the baseline, the decision, and an unsigned digest.</p>
          </>
        ) : (
          <>
            <div className={s.score}><strong data-testid="harness-decision">{result.decision}</strong><span>demonstration decision · {result.passed}/{result.cand.length} checks</span></div>
            <div className={s.deltaRow}>
              <div><span className={s.kicker}>DELTA VS BASELINE</span><b>{result.base ? `${result.improvements.length} improved · ${result.regressions.length} regressed` : 'no baseline supplied'}</b></div>
              <div><span className={s.kicker}>REGRESSIONS</span><b>{result.regressions.length ? result.regressions.map((r) => r.label).join(', ') : 'none'}</b></div>
            </div>
            {(['golden', 'held-out', 'adversarial'] as const).map((group) => (
              <div key={group}>
                <span className={s.kicker}>{group.toUpperCase()} CASES</span>
                {result.cand.filter((c) => c.group === group).map((c) => (
                  <div key={c.id} className={s.row}><span>{c.ok ? 'PASS' : 'FAIL'}</span><div><b>{c.label}</b><small>{c.detail}</small></div></div>
                ))}
              </div>
            ))}
            <div className={s.receipt} data-testid="harness-receipt">
              <span className={s.kicker}>RECEIPT CONCEPT · UNSIGNED BROWSER DIGEST</span>
              <code>{hash ?? 'computing…'}</code>
              <small>A production receipt binds the tested identity, the case set, the decision, and a signature from a verifier that is not the thing under test. This digest is computed in your browser over the text above and proves nothing about production.</small>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function ProductDemo({ mode }: { mode: ProductMode }) {
  const [a, setA] = useState('100')
  const [b, setB] = useState('10')
  const [c, setC] = useState('5')
  const n = [Number(a) || 0, Number(b) || 0, Number(c) || 0]

  return (
    <section className={s.demo} aria-label="Browser demonstration" data-testid="product-demo">
      <div className={s.demoHead}>
        <span data-testid="demo-banner">{DEMO_BANNER}</span>
        <small>Runs entirely in your browser on numbers or text you type. Paid work runs in the governed systems described above and returns a receipt; this panel does not.</small>
      </div>

      {mode === 'harness' && <HarnessDemo />}
      {mode === 'scan' && <Calculator title="Opportunity scan illustration" labels={['Assessed value', 'Risk flags', 'Strong signals']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.max(0, Math.min(100, 80 + n[2] * 4 - n[1] * 8))} / 100 illustrative fit`} note="A bounded scoring illustration. The actual scan runs against county evidence in the production system, not in your browser." />}
      {mode === 'dossier' && <Calculator title="Dossier triage illustration" labels={['Target price', 'Known evidence items', 'Open unknowns']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.max(0, Math.min(100, 100 - n[2] * 9 + Math.min(20, n[1])))} / 100 evidence readiness`} note="The real dossier attaches source evidence, underwriting, missing evidence, and the action path." />}
      {mode === 'acquisition' && <Calculator title="Buyability screen illustration" labels={['Annual revenue', 'Seller motivation (1–10)', 'Major unknowns']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.round(n[1] * 8 + Math.min(40, n[0] / 25000) - n[2] * 5)} buyability index`} note="A screening toy, not a valuation. Paid work uses public evidence, entity and property linkage, and explicit unknowns." />}
      {mode === 'rescue' && <Calculator title="Data rescue arithmetic" labels={['Rows received', 'Duplicate rows', 'Exception rows']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.max(0, Math.round(n[0] - n[1] - n[2]))} cleanable rows`} note="The delivered product is the normalized dataset, exception report, provenance, and receipt." />}
      {mode === 'workflow' && <Calculator title="Workflow baseline" labels={['Weekly manual hours', 'Loaded labor $/hr', 'Avoidable error events / week']} values={[a, b, c]} set={[setA, setB, setC]} output={`$${Math.round(n[0] * n[1] * 4.33).toLocaleString()} monthly labor exposure`} note="Use this to establish your own baseline. The sprint is sold against one measurable replacement outcome." />}
      {mode === 'proof' && <Calculator title="Evidence-class arithmetic" labels={['Facts', 'Derived claims', 'Unknowns']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.max(0, n[0] + n[1] - n[2])} decision-ready evidence units`} note="The actual twin labels each claim FACT, DERIVED, HYPOTHESIS, UNKNOWN, or CONFLICTED." />}
      {mode === 'managed' && <Calculator title="Desk economics" labels={['Opportunities reviewed / month', 'Monthly fee', 'Clients']} values={[a, b, c]} set={[setA, setB, setC]} output={`$${Math.round(n[1] * n[2]).toLocaleString()} monthly recurring revenue`} note="Arithmetic for the desk itself, not a forecast of your outcomes. The desk is offered only after a paid scan or dossier produces a real buyer outcome." />}
      {mode === 'resale' && <Calculator title="Buy ceiling" labels={['Expected resale', 'Fees and shipping', 'Target margin %']} values={[a, b, c]} set={[setA, setB, setC]} output={`$${Math.max(0, n[0] - n[1] - (n[0] * n[2]) / 100).toFixed(0)} target buy ceiling`} note="Computed from your own numbers. The real product binds valuation evidence, buy ceiling, disposition, and receipt." />}
    </section>
  )
}

function Calculator({ title, labels, values, set, output, note }: {
  title: string; labels: string[]; values: string[]; set: Array<(v: string) => void>; output: string; note: string
}) {
  return <div className={s.calc}>
    <div className={s.calcForm}><h3>{title}</h3>{labels.map((label, i) => <label className={s.label} key={label}>{label}<input className={s.input} value={values[i]} onChange={(e) => set[i](e.target.value)} inputMode="decimal" /></label>)}<p className={s.note}>{note}</p></div>
    <div className={s.result}><span className={s.kicker}>DEMONSTRATION OUTPUT</span><strong className={s.output}>{output}</strong><span className={s.pass}>BROWSER CALCULATION</span><p>Change the inputs. Deliberately inspectable, deliberately not a black box, deliberately not the product.</p></div>
  </div>
}
