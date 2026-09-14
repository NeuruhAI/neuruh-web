import Link from 'next/link'
import { PipelineTrace } from '../../components/PipelineTrace'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/how-it-works',
  title: 'How it works',
  description: 'The Neuruh pipeline in plain language: signal → evidence → decision → authority → action → receipt → outcome, and what each stage refuses to skip.',
})

const STAGES = [
  ['Signal', 'Messy real-world inputs arrive: county records, parcel geometry, photos, listings, field reports.', 'DeedSonar ingests county evidence; FindSellProfit reads photos and listings; the Liquidity Engine reads field signals.'],
  ['Evidence', 'Inputs become claims with sources kept. Missing facts stay missing — they are never quietly turned into zeros.', 'Every product renders its evidence with provenance; contradictions are preserved side by side.'],
  ['Decision', 'Economics and options are computed before anything is committed — including the routes that do not work.', 'FindSellProfit computes the absolute maximum buy; the Liquidity Engine ranks options least-destructive first.'],
  ['Authority', 'A checked gate decides what is allowed. A model can propose; only authority can permit.', 'Approvals are scoped and one-shot. Refusals are recorded with the same care as actions.'],
  ['Action', 'Only authorized work executes, reversible by default wherever possible.', 'Offers prepare, workflows run, dispositions route — inside the granted scope and nowhere else.'],
  ['Receipt', 'Everything that ran leaves a verifiable record: what, when, under whose authority, at which SHA.', 'DeedSonar production attests its own SHA; each ProofOS court writes a machine-readable receipt.'],
  ['Outcome', 'Results are recorded against expectations, so the system can be calibrated on reality — not vibes.', 'The Liquidity Engine records expected vs actual for every synthetic close; the learning loop stays honest.'],
] as const

export default function HowItWorksPage() {
  return (
    <main className="sec" id="main">
      <div className="sec-inner">
        <p className="sec-eyebrow">How it works</p>
        <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Seven stages. No skipped steps.</h1>
        <p className="sec-sub">
          This is the whole idea, in order. Each stage exists because skipping it is how AI systems fail in the real
          world.
        </p>
        <div className="law-list">
          {STAGES.map(([name, plain, products], i) => (
            <div className="law" key={name}>
              <span className="ln">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{name}</h2>
                <p>{plain}</p>
                <p style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--v2-steel-ink)' }}>{products}</p>
              </div>
            </div>
          ))}
        </div>
        <PipelineTrace />
        <div className="row" style={{ marginTop: 28 }}>
          <Link className="v2-btn v2-btn-primary" href="/offers">See the offers</Link>
          <Link className="v2-btn v2-btn-secondary" href="/products">Explore the systems</Link>
          <Link className="v2-btn v2-btn-ghost" href="/organism">See the architecture</Link>
        </div>
      </div>
    </main>
  )
}
