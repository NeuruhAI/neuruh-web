import type { Metadata } from 'next'
import Link from 'next/link'
import { PUBLIC_OFFERS } from '../../lib/publicOffers'
import styles from '../../components/Commercial.module.css'

export const metadata: Metadata = {
  alternates: { canonical: '/work-with-neuruh' },
  title: 'Work with Neuruh',
  description:
    'Three ways to work with Neuruh: pick a fixed-scope offer, ask which path fits, or talk to the founder about custom work.',
}

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
    body: 'Pilots, custom domain engines, or work that does not fit a card. Mail goes to the person who built the systems.',
    href: '/contact',
    cta: 'Contact',
  },
] as const

export default function WorkWithNeuruhPage() {
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
    </main>
  )
}
