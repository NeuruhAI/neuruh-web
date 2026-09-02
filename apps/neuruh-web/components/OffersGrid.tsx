import { OFFER_NEXT_STEPS, PUBLIC_OFFERS } from '../lib/publicOffers'
import styles from './OffersGrid.module.css'

export function OffersGrid() {
  return (
    <div className={styles.shell}>
      <div className={styles.grid} data-testid="offers-grid">
        {PUBLIC_OFFERS.map((offer) => (
          <article
            key={offer.id}
            className={styles.card}
            data-offer-id={offer.id}
            data-testid={`offer-${offer.id}`}
          >
            <div className={styles.cardHead}>
              <p className={styles.scope}>{offer.scope}</p>
              <p className={styles.price}>{offer.price}</p>
            </div>

            <div className={styles.cardCopy}>
              <h2>{offer.name}</h2>
              <p className={styles.promise}>{offer.promise}</p>
            </div>

            <dl className={styles.facts}>
              <div>
                <dt>You provide:</dt>
                <dd>{offer.provide}</dd>
              </div>
              <div>
                <dt>You receive:</dt>
                <dd>{offer.receive}</dd>
              </div>
              <div>
                <dt>Turnaround:</dt>
                <dd>{offer.turnaround}</dd>
              </div>
              <div>
                <dt>Proof:</dt>
                <dd>{offer.proof}</dd>
              </div>
            </dl>

            <a
              className={`v2-btn v2-btn-primary ${styles.cta}`}
              href={offer.href}
              rel="noopener noreferrer"
              data-testid={`offer-cta-${offer.id}`}
            >
              {offer.cta}
            </a>
          </article>
        ))}
      </div>

      <section className={styles.next} data-testid="offers-next" aria-labelledby="offers-next-h">
        <div className={styles.nextIntro}>
          <p className={styles.scope}>What happens next</p>
          <h2 id="offers-next-h">Simple by design.</h2>
        </div>
        <ol className={styles.steps}>
          {OFFER_NEXT_STEPS.map((step, index) => (
            <li key={step.title}>
              <span className={styles.stepNo}>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <p className={styles.scope} style={{ marginTop: '1.35rem' }}>
        Not sure which path? <a className="v2-link" href="/ask">Ask Neuruh</a>
        {' · '}
        After checkout, the handoff is <a className="v2-link" href="/thank-you">/thank-you</a>
        {' — this site does not receive payment webhooks.'}
      </p>
    </div>
  )
}
