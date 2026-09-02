import type { Metadata } from 'next'
import { ThankYouHandoff } from '../../components/ThankYouHandoff'

export const metadata: Metadata = {
  alternates: { canonical: '/thank-you' },
  title: 'Thank you',
  description:
    'Post-checkout handoff for Neuruh offers. This static site does not receive Stripe webhooks — we email the checkout address within one business day.',
}

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
            No webhook lands here. If you paid, keep the checkout email handy. We write that address within one
            business day to collect inputs and start the scoped work.
          </p>
          <ThankYouHandoff />
        </div>
      </section>
    </main>
  )
}
