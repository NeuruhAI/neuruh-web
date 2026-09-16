import { ThankYouHandoff } from '../../components/ThankYouHandoff'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/thank-you',
  title: 'Thank you',
  description:
    'Post-checkout handoff for Neuruh offers. This static site does not receive Stripe webhooks — a founder replies to the checkout address from jeramie@neuruh.com.',
})

export default function ThankYouPage() {
  return (
    <main id="main">
      <section className="sec" aria-labelledby="thanks-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Handoff</p>
          <h1 className="sec-h" id="thanks-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            Checkout is done. Intake is next.
          </h1>
          <p className="sec-sub">
            No webhook lands here. If you paid, keep the checkout email handy. A founder replies to that address from
            jeramie@neuruh.com to collect inputs and agree scope and timing before the work starts.
          </p>
          <ThankYouHandoff />
        </div>
      </section>
    </main>
  )
}
