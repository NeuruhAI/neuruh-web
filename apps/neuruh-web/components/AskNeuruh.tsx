'use client'

import { useState } from 'react'
import { ASK_CARDS, ASK_INTENTS, type AskLane } from '../lib/askRecommendations'
import styles from './Commercial.module.css'

export function AskNeuruh() {
  const [intent, setIntent] = useState<(typeof ASK_INTENTS)[number]['id'] | null>(null)
  const highlight: AskLane | null = ASK_INTENTS.find((item) => item.id === intent)?.highlight ?? null

  return (
    <div data-testid="ask-neuruh">
      <p className={styles.note}>
        Choose the job. Ask Neuruh always returns three public paths — FASTEST, BEST VALUE, and CUSTOM.
        It does not score you, and it does not expose how the work is done.
      </p>
      <div className={styles.chooser} role="group" aria-label="What do you need Neuruh to work on?">
        {ASK_INTENTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.choice}
            aria-pressed={intent === item.id}
            data-testid={`ask-intent-${item.id}`}
            onClick={() => setIntent(item.id)}
          >
            <strong>{item.label}</strong>
            <span>{item.hint}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid} data-testid="ask-output">
        {ASK_CARDS.map((card) => (
          <article
            key={card.lane}
            className={styles.card}
            data-lane={card.lane}
            data-highlight={highlight === card.lane}
            data-testid={`ask-card-${card.lane.replace(' ', '-').toLowerCase()}`}
          >
            <div className={styles.head}>
              <p className={`${styles.kicker} ${highlight === card.lane ? styles.kickerIce : ''}`}>{card.lane}</p>
              <p className={styles.price}>{card.priceRange}</p>
            </div>
            <h2 className={styles.title}>{card.offer.name}</h2>
            <p className={styles.lede}>{card.why}</p>
            <dl className={styles.facts}>
              <div>
                <dt>You provide:</dt>
                <dd>{card.offer.provide}</dd>
              </div>
              <div>
                <dt>You receive:</dt>
                <dd>{card.offer.receive}</dd>
              </div>
              <div>
                <dt>Proof:</dt>
                <dd>{card.offer.proof}</dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <a className="v2-btn v2-btn-primary" href={card.ctaHref} rel="noopener noreferrer">
                {card.ctaLabel}
              </a>
              <a className="v2-btn v2-btn-secondary" href={card.secondaryHref}>
                {card.secondaryLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
