import type { Metadata } from 'next'
import { PUBLIC_OFFERS } from '../../lib/publicOffers'

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
          <div className="prod-grid" data-testid="offers-grid">
            {PUBLIC_OFFERS.map((offer) => (
              <article
                key={offer.id}
                className="prod-card pc-span-4"
                data-offer-id={offer.id}
                data-testid={`offer-${offer.id}`}
              >
                <div className="pc-body">
                  <p className="offer-price">{offer.price}</p>
                  <h2>{offer.name}</h2>
                  <p className="pc-line">{offer.promise}</p>
                  <a
                    className="v2-btn v2-btn-primary"
                    href={offer.href}
                    rel="noopener noreferrer"
                    data-testid={`offer-cta-${offer.id}`}
                  >
                    {offer.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
