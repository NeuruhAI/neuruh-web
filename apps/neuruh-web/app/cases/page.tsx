import Link from 'next/link'
import { CaseStudyGrid } from '../../components/CaseStudyGrid'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/cases',
  title: 'Cases',
  description:
    'Public-safe case studies from dated receipts: DeedSonar in production, the neuruh.com launch, sealed product courts, and the audited commons. No customer stories.',
})

export default function CasesPage() {
  return (
    <main id="main">
      <section className="sec" aria-labelledby="cases-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Cases</p>
          <h1 className="sec-h" id="cases-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            What ran. What the receipt shows.
          </h1>
          <p className="sec-sub">
            These are not customer testimonials — Neuruh claims no revenue and no customers it cannot receipt. Merged is not
            live. A live cashier is not automated fulfillment. SHIP-001 on neuruh.com is SHIPPED_LIVE; ORDER→FR remains draft.
            Each case is a public-safe projection from dated evidence already on this site.
          </p>
          <CaseStudyGrid />
          <div className="row" style={{ marginTop: 28 }}>
            <Link className="v2-btn v2-btn-primary" href="/offers">Start with an offer</Link>
            <Link className="v2-btn v2-btn-secondary" href="/proof">Inspect the proof cards</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
