import type { Metadata } from 'next'
import { OffersGrid } from '../../components/OffersGrid'

export const metadata: Metadata = {
  alternates: { canonical: '/offers' },
  title: 'Offers',
  description:
    'Three fixed-scope ways to put Neuruh to work: Data Rescue, Opportunity Dossier, and Workflow Sprint.',
}

export default function OffersPage() {
  return (
    <main id="main">
      <section className="sec" aria-labelledby="offers-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Start here</p>
          <h1 className="sec-h" id="offers-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            Three ways to put Neuruh to work.
          </h1>
          <p className="sec-sub">
            Each offer is fixed in scope: what you send, what you receive, typical turnaround, and what happens after
            checkout. The cashiers below are the live payment links — not new ones.
          </p>
          <OffersGrid />
        </div>
      </section>
    </main>
  )
}
