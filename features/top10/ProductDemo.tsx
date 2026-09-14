'use client'

import { useMemo, useState, type ChangeEvent } from 'react'
import type { ProductMode } from './Top10Data'
import s from './Top10Product.module.css'

const pass = (label: string) => <span className={s.pass}>{label}</span>

export function ProductDemo({ mode }: { mode: ProductMode }) {
  const [fileText, setFileText] = useState('')
  const [ran, setRan] = useState(false)
  const [a, setA] = useState('100')
  const [b, setB] = useState('10')
  const [c, setC] = useState('5')

  const harnessResult = useMemo(() => {
    if (!ran) return null
    let parsed: Record<string, unknown> | null = null
    if (fileText.trim()) {
      try { parsed = JSON.parse(fileText) } catch { parsed = null }
    }
    const checks = [
      ['Input bound', Boolean(parsed || fileText.trim()), 'A test artifact or pasted JSON was supplied.'],
      ['Evidence field', Boolean(parsed?.evidence || parsed?.evidence_refs || fileText.includes('evidence')), 'Evidence presence is checked, not assumed.'],
      ['Authority field', Boolean(parsed?.authority || parsed?.permission || fileText.includes('permission')), 'Authority/permission presence is checked.'],
      ['Outcome field', Boolean(parsed?.outcome || parsed?.result || fileText.includes('outcome')), 'The artifact exposes an outcome/result.'],
      ['No obvious secret', !/sk_live_|BEGIN PRIVATE KEY|password\s*:/i.test(fileText), 'The demo blocks obvious secret patterns.'],
    ]
    const passed = checks.filter((x) => x[1]).length
    return { checks, passed, total: checks.length }
  }, [fileText, ran])

  const numbers = [Number(a) || 0, Number(b) || 0, Number(c) || 0]

  return (
    <section className={s.demo} aria-label="Interactive product demo">
      <div className={s.demoHead}>
        <span>LIVE PRODUCT DEMO</span>
        <small>Browser-only demonstration. Production customer work uses the underlying governed systems and evidence courts.</small>
      </div>

      {mode === 'harness' && (
        <div className={s.demoGrid}>
          <div>
            <label className={s.label}>Paste JSON or evidence text</label>
            <textarea className={s.textarea} value={fileText} onChange={(e) => setFileText(e.target.value)} placeholder='{"evidence":["source-1"],"permission":"approved","outcome":"PASS"}' />
            <label className={s.fileLabel}>Or choose a local JSON file<input type="file" accept="application/json,.json,text/plain" onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0]?.text().then(setFileText)} /></label>
            <button className={s.button} onClick={() => setRan(true)}>Run harness</button>
          </div>
          <div className={s.result}>
            {!harnessResult ? <><strong>Ready.</strong><p>Supply an artifact, then run the checks.</p></> : <>
              <div className={s.score}><strong>{harnessResult.passed}/{harnessResult.total}</strong><span>checks passed</span></div>
              {harnessResult.checks.map(([label, ok, detail]) => <div key={String(label)} className={s.row}><span>{ok ? 'PASS' : 'REVIEW'}</span><div><b>{String(label)}</b><small>{String(detail)}</small></div></div>)}
            </>}
          </div>
        </div>
      )}

      {mode === 'scan' && <Calculator title="Opportunity scan" labels={['Property value', 'Risk flags', 'Strong signals']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.max(0, 80 + numbers[2] * 4 - numbers[1] * 8)} / 100 opportunity fit`} note="This demo illustrates bounded scoring; the actual scan uses evidence-backed property and signal contracts." />}
      {mode === 'dossier' && <Calculator title="Dossier triage" labels={['Target price', 'Known evidence items', 'Open unknowns']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.max(0, 100 - numbers[2] * 9 + Math.min(20, numbers[1]))} / 100 evidence readiness`} note="The real dossier attaches source evidence, underwriting, missing evidence, and the action path." />}
      {mode === 'acquisition' && <Calculator title="Buyability screen" labels={['Annual revenue', 'Seller motivation (1–10)', 'Major unknowns']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.round((numbers[1] * 8) + Math.min(40, numbers[0] / 25000) - numbers[2] * 5)} buyability index`} note="A screening toy, not a valuation. Paid work uses public evidence, entity/property linkage, and explicit unknowns." />}
      {mode === 'rescue' && <Calculator title="Data rescue" labels={['Rows received', 'Duplicate rows', 'Exception rows']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.max(0, Math.round(numbers[0] - numbers[1] - numbers[2]))} cleanable rows`} note="The delivered product includes the normalized dataset, exception report, provenance, and receipt." />}
      {mode === 'workflow' && <Calculator title="Workflow replacement" labels={['Weekly manual hours', 'Loaded labor $/hr', 'Avoidable error events']} values={[a, b, c]} set={[setA, setB, setC]} output={`$${Math.round(numbers[0] * numbers[1] * 4.33).toLocaleString()} monthly labor exposure`} note="Use this to establish a baseline. The sprint is sold against one measurable replacement outcome." />}
      {mode === 'proof' && <Calculator title="ProofOS truth ledger" labels={['Facts', 'Derived claims', 'Unknowns']} values={[a, b, c]} set={[setA, setB, setC]} output={`${Math.max(0, numbers[0] + numbers[1] - numbers[2])} decision-ready evidence units`} note="The actual twin distinguishes FACT, DERIVED, HYPOTHESIS, UNKNOWN, and CONFLICTED." />}
      {mode === 'managed' && <Calculator title="Managed desk economics" labels={['Opportunities / month', 'Avg monthly fee', 'Clients']} values={[a, b, c]} set={[setA, setB, setC]} output={`$${Math.round(numbers[1] * numbers[2]).toLocaleString()} monthly recurring revenue`} note="The model becomes recurring only after a paid scan/dossier produces a real buyer outcome." />}
      {mode === 'resale' && <Calculator title="FindSellProfit" labels={['Expected resale', 'Fees / shipping', 'Desired margin %']} values={[a, b, c]} set={[setA, setB, setC]} output={`$${Math.max(0, numbers[0] - numbers[1] - (numbers[0] * numbers[2] / 100)).toFixed(0)} target buy ceiling`} note="The real product binds valuation evidence, buy ceiling, disposition, and receipt." />}
    </section>
  )
}

function Calculator({ title, labels, values, set, output, note }: {
  title: string; labels: string[]; values: string[]; set: Array<(v: string) => void>; output: string; note: string
}) {
  return <div className={s.calc}>
    <div className={s.calcForm}><h3>{title}</h3>{labels.map((label, i) => <label className={s.label} key={label}>{label}<input className={s.input} value={values[i]} onChange={(e) => set[i](e.target.value)} inputMode="decimal" /></label>)}<p className={s.note}>{note}</p></div>
    <div className={s.result}><span className={s.kicker}>CURRENT MODEL OUTPUT</span><strong className={s.output}>{output}</strong>{pass('CALCULATED')}<p>Change the inputs. This is deliberately inspectable rather than a black box.</p></div>
  </div>
}
