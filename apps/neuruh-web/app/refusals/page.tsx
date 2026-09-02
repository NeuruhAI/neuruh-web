import Link from 'next/link'
import { PUBLIC_HARD_ZEROS } from '../../lib/publicHardZeros'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/refusals',
  title: 'Boundaries',
  description: 'What Neuruh refuses to fake — the operating laws that keep every other number on this site worth believing, plus the hard zeros stated unprompted.',
})

const LAWS = [
  ['No fake live status.', 'If a number is a dated snapshot, it says so on the surface that shows it. Nothing on this site pretends to be a live feed — live connectivity is NONE and labeled.'],
  ['No missing data turned into zero.', 'An unknown stays UNKNOWN. The truth compiler fails closed on unclassified numbers rather than guessing.'],
  ['No AI output becomes authority by itself.', 'A model can propose. Only a checked authority gate can permit — approvals are scoped and one-shot, and a refusal is receipted with the same care as an action.'],
  ['No real-money claim without a real transaction.', 'Demo economics are labeled synthetic inside the products and here. The Liquidity Engine’s closes say "no real money moved" on every row.'],
  ['No production claim without a deployed, attested release.', 'DeedSonar may say "in production" because its health endpoint attests its own SHA. Nothing else on this site carries that label.'],
  ['No fabricated case studies, customers, or partners.', 'The site shows sample-labeled and synthetic-labeled product surfaces — never invented logos or testimonials.'],
] as const

const ZEROS = [
  ['Revenue, ever', '$0'],
  ['Customers', '0'],
  ['People contacted by anything we built', '0'],
  ['Employees', '0 — founder only'],
  ['Outside capital raised', '$0'],
  ['External security reviews / SOC 2', '0'],
] as const

export default function BoundariesPage() {
  return (
    <main id="main">
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow">Boundaries</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)' }}>What Neuruh refuses to fake.</h1>
          <p className="sec-sub">
            Our product is the credibility of a refusal. One unsupported claim would teach you to re-verify every
            honest number on this site — so the boundaries are published, and they bind this website too.
          </p>
          <div className="law-list">
            {LAWS.map(([h, p], i) => (
              <div className="law" key={h}>
                <span className="ln">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{h}</h3><p>{p}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec sec-alt" aria-labelledby="zeros-h">
        <div className="sec-inner" style={{ maxWidth: '56rem' }}>
          <h2 className="sec-h" id="zeros-h">The hard zeros — as of {PUBLIC_HARD_ZEROS.asOf}</h2>
          <p className="sec-sub">Dated public snapshot, not a live Stripe readout. They change on this page when receipts change them.</p>
          <dl className="zeros-ledger">
            {ZEROS.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          <p className="sec-sub" style={{ marginTop: 22 }}>
            Everything we do claim carries evidence on <Link className="v2-link" href="/proof">/proof</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}
