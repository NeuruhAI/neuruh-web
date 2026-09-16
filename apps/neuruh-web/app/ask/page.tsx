import { AskNeuruh } from '../../components/AskNeuruh'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/ask',
  title: 'Ask Neuruh',
  description:
    'Ask Neuruh returns three public paths — FASTEST, BEST VALUE, and CUSTOM — with what you provide, what you receive, price, proof, and a checkout or founder CTA.',
})

export default function AskPage() {
  return (
    <main id="main">
      <section className="sec" aria-labelledby="ask-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Ask Neuruh</p>
          <h1 className="sec-h" id="ask-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            Tell us the job. Take one of three public paths.
          </h1>
          <p className="sec-sub">
            Output is capped at three cards: FASTEST, BEST VALUE, and CUSTOM. No scores. No hidden ranking. No factory
            internals.
          </p>
          <AskNeuruh />
        </div>
      </section>
    </main>
  )
}
