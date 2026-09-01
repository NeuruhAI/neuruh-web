import type { Metadata } from 'next'
import { OffersGrid } from '../../components/OffersGrid'

export const metadata: Metadata = {
  alternates: { canonical: '/offers' },
  title: 'Offers',
  description:
    'Buy a Neuruh offer: Data Rescue ($299), Opportunity Dossier ($499), or Workflow Sprint ($1250). Each checkout is a live cashier.',
}

export default function OffersPage() {
  return (
    <main id="main">
      <section className="sec" aria-labelledby="offers-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Offers</p>
          <h1 className="sec-h" id="offers-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            Three ways to start. Pay and we work.
          </h1>
          <p className="sec-sub">
            Each card is a live checkout. Pick the offer that matches the work you need done.
          </p>
          <OffersGrid />
        </div>
      </section>
    </main>
  )
}
