import Link from 'next/link'
import { PUBLIC_PROOF_CARDS } from '../lib/publicProofCards'
import styles from './Commercial.module.css'

export function ProofCardGrid() {
  return (
    <div className={styles.grid2} data-testid="proof-cards">
      {PUBLIC_PROOF_CARDS.map((card) => (
        <article key={card.id} className={styles.card} data-testid={`proof-card-${card.id}`}>
          <div className={styles.head}>
            <p className={styles.kicker}>{card.subject}</p>
            <p className={`${styles.kicker} ${card.status === 'IN_REVIEW' || card.status === 'MERGED / COURTED' ? styles.kickerWarn : styles.kickerIce}`}>
              {card.status}
            </p>
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>Claim</dt>
              <dd>{card.claim}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{card.evidence}</dd>
            </div>
            <div>
              <dt>Limitation</dt>
              <dd>{card.limitation}</dd>
            </div>
          </dl>
          <div className={styles.actions}>
            <Link className="v2-link" href={card.href}>{card.hrefLabel} →</Link>
          </div>
        </article>
      ))}
    </div>
  )
}
