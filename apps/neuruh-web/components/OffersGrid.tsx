import { PUBLIC_OFFERS } from '../lib/publicOffers'

export function OffersGrid() {
  return (
    <div className="prod-grid" data-testid="offers-grid">
      {PUBLIC_OFFERS.map((offer) => (
        <article
          key={offer.id}
          className="prod-card pc-span-4"
          data-offer-id={offer.id}
          data-testid={`offer-${offer.id}`}
        >
          <div className="pc-body">
            <p className="metric-strip__value">{offer.price}</p>
            <h3>{offer.name}</h3>
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
  )
}
