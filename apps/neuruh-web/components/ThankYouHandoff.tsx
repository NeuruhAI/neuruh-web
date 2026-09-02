'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { OFFER_BY_ID, OFFER_NEXT_STEPS, PUBLIC_OFFERS, type PublicOfferId } from '../lib/publicOffers'
import styles from './Commercial.module.css'

function isOfferId(value: string | null): value is PublicOfferId {
  return value === 'O01' || value === 'O02' || value === 'O05'
}

export function ThankYouHandoff() {
  const [offerId, setOfferId] = useState<string | null>(null)

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('offer')
    setOfferId(value)
  }, [])

  const offer = isOfferId(offerId) ? OFFER_BY_ID[offerId] : null

  return (
    <div data-testid="thank-you-handoff">
      <p className={styles.note}>
        This site is a static export. It does not receive Stripe webhooks and cannot confirm a payment from here.
        A live cashier is not automated fulfillment. If you checked out, the receipt went to the address you used
        at checkout — a founder follows up from that address.
      </p>

      {offer ? (
        <article className={styles.card} data-testid={`thank-you-offer-${offer.id}`}>
          <p className={styles.kicker}>Selected offer · {offer.id}</p>
          <h2 className={styles.title}>{offer.name}</h2>
          <p className={styles.lede}>{offer.promise}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Have ready</dt>
              <dd>{offer.provide}</dd>
            </div>
            <div>
              <dt>You will receive</dt>
              <dd>{offer.receive}</dd>
            </div>
            <div>
              <dt>Typical turnaround</dt>
              <dd>{offer.turnaround}</dd>
            </div>
          </dl>
        </article>
      ) : (
        <div className={styles.grid} data-testid="thank-you-all-offers">
          {PUBLIC_OFFERS.map((item) => (
            <article key={item.id} className={styles.card}>
              <p className={styles.kicker}>{item.id}</p>
              <h2 className={styles.title}>{item.name}</h2>
              <p className={styles.lede}>{item.provide}</p>
            </article>
          ))}
        </div>
      )}

      <ol className={styles.facts} data-testid="thank-you-next" style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
        {OFFER_NEXT_STEPS.map((step, index) => (
          <li key={step.title}>
            <p className={styles.kicker}>{String(index + 1).padStart(2, '0')} · {step.title}</p>
            <p className={styles.lede}>{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="hero-ctas" style={{ marginTop: '1.5rem' }}>
        <a className="v2-btn v2-btn-primary" href="mailto:jeramie@neuruh.com">Email the founder</a>
        <Link className="v2-btn v2-btn-secondary" href="/offers">Back to offers</Link>
        <Link className="v2-btn v2-btn-ghost" href="/ask">Ask Neuruh</Link>
      </div>
    </div>
  )
}
