import Link from 'next/link'
import { PUBLIC_OFFERS, QUOTED_ENGAGEMENTS } from '../lib/publicOffers'
import styles from './Commercial.module.css'

const PATHS = [
  {
    kicker: 'Scoped',
    title: 'Pick an offer',
    body: 'Data Rescue, Opportunity Dossier, or Workflow Sprint. Fixed scope, live checkout, founder-operated delivery.',
    href: '/offers',
    cta: 'See offers',
  },
  {
    kicker: 'Chooser',
    title: 'Ask Neuruh',
    body: 'Not sure which offer fits. Ask Neuruh returns three public cards — FASTEST, BEST VALUE, CUSTOM — and nothing else.',
    href: '/ask',
    cta: 'Ask Neuruh',
  },
  {
    kicker: 'Direct',
    title: 'Talk to the founder',
    body: 'Pilots, quoted engagements, custom domain engines, or work that does not fit a card. Mail goes to the person who built the systems.',
    href: '/contact',
    cta: 'Contact',
  },
] as const

export function WorkWithHub() {
  return (
    <main id="main">
      <section className="sec" aria-labelledby="work-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Work with Neuruh</p>
          <h1 className="sec-h" id="work-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            Buy a scoped piece of work — or talk before you do.
          </h1>
          <p className="sec-sub">
            Neuruh is founder-operated. The public path is three fixed-scope offers. Everything else is a conversation,
            not a catalog.
          </p>
          <div className={styles.grid}>
            {PATHS.map((path) => (
              <article key={path.href} className={styles.card}>
                <p className={styles.kicker}>{path.kicker}</p>
                <h2 className={styles.title}>{path.title}</h2>
                <p className={styles.lede}>{path.body}</p>
                <div className={styles.actions}>
                  <Link className="v2-btn v2-btn-primary" href={path.href}>{path.cta}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-alt" aria-labelledby="work-offers-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Live offers</p>
          <h2 className="sec-h" id="work-offers-h">The three cashiers already on neuruh.com.</h2>
          <div className={styles.strip}>
            {PUBLIC_OFFERS.map((offer) => (
              <article key={offer.id}>
                <p className={styles.kicker}>{offer.id} · {offer.price}</p>
                <h3>{offer.name}</h3>
                <p>{offer.promise}</p>
                <a className="v2-link" href={offer.href} rel="noopener noreferrer">{offer.cta} →</a>
              </article>
            ))}
          </div>
          <div className="row" style={{ marginTop: 26 }}>
            <Link className="v2-btn v2-btn-secondary" href="/cases">Read public-safe cases</Link>
            <Link className="v2-btn v2-btn-ghost" href="/proof">Inspect proof →</Link>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="work-quoted-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Quoted work</p>
          <h2 className="sec-h" id="work-quoted-h">Two products that are built, but priced by quote.</h2>
          <p className="sec-sub">
            These fulfil today. They have no checkout button because their price is not set — pricing is a founder
            decision, and this site does not invent one. Ask for a quote and a person answers.
          </p>
          <div className={styles.grid}>
            {QUOTED_ENGAGEMENTS.map((engagement) => (
              <article key={engagement.id} className={styles.card}>
                <p className={styles.kicker}>{engagement.scope} · {engagement.pricing}</p>
                <h3 className={styles.title}>{engagement.name}</h3>
                <p className={styles.lede}>{engagement.promise}</p>
                <p className={styles.lede}><strong>You provide:</strong> {engagement.provide}</p>
                <p className={styles.lede}><strong>You receive:</strong> {engagement.receive}</p>
                <p className={styles.lede}>{engagement.excludes}</p>
                <div className={styles.actions}>
                  <Link className="v2-btn v2-btn-primary" href={engagement.href}>{engagement.cta}</Link>
                </div>
              </article>
            ))}
          </div>
          <p className="claim-boundary" style={{ marginTop: 22 }}>
            <strong>Claim boundary:</strong> both products are built and courted, and neither has a public price or a
            cashier. Nothing here reports a customer result — the zeros on{' '}
            <Link className="text-link" href="/refusals">/refusals</Link> still apply.
          </p>
        </div>
      </section>
    </main>
  )
}
