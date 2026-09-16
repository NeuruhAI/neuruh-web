import { calHref } from '../lib/attribution'
import { PUBLIC_CALLS } from '../lib/publicOffers'
import styles from './Commercial.module.css'

/**
 * The Cal.com ladder. Rates for the paid tiers are shown by Cal.com at booking,
 * never printed here (they are not in canon). One action per tier.
 */
export function CallLadder({ surface }: { surface: 'root' }) {
  return (
    <div className={styles.strip} data-testid="call-ladder">
      {PUBLIC_CALLS.map((call) => (
        <article key={call.id} data-call-id={call.id}>
          <p className={styles.kicker}>{call.length} · {call.rate}</p>
          <h3>{call.name}</h3>
          <p>{call.note}</p>
          <a className="v2-link" href={calHref(call.slug, `${surface}-${call.id}`)} rel="noopener noreferrer" data-surface={surface}>Book on Cal.com →</a>
        </article>
      ))}
    </div>
  )
}
