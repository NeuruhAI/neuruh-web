import Link from 'next/link'
import { PUBLIC_FAQ, PUBLIC_FAQ_JSON_LD } from '../../lib/publicFaq'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/faq',
  title: 'Questions',
  description: 'Straight answers: what Neuruh does, what you can buy, where real-estate buyers start, what is live (nothing), what is automated, and how to check a figure.',
})

export default function FaqPage() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PUBLIC_FAQ_JSON_LD) }} />
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow">Questions</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Straight answers.</h1>
          <div className="law-list" data-testid="faq">
            {PUBLIC_FAQ.map(({ q, a }, index) => (
              <div className="law" key={q}>
                <span className="ln">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{q}</h2>
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 26 }}>
            <Link className="v2-btn v2-btn-primary" href="/solve">Give Neuruh a target</Link>
            <Link className="v2-btn v2-btn-secondary" href="/offers">See offers</Link>
            <Link className="v2-btn v2-btn-secondary" href="/proof">See the proof</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
