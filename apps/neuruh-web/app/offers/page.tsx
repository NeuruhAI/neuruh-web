import { OffersGrid } from '../../components/OffersGrid'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/offers',
  title: 'Offers',
  description:
    'Four founder-delivered offers: Data Rescue, Opportunity Intelligence Dossier, Workflow Replacement Sprint, and the Forensic System Audit — plus a free qualifying call.',
})

export default function OffersPage() {
  return (
    <main id="main">
      <section className="sec" aria-labelledby="offers-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Start here</p>
          <h1 className="sec-h" id="offers-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            Four ways to put Neuruh to work.
          </h1>
          <p className="sec-sub">
            Each offer is fixed in scope: what you send, what you receive, and what happens next. Timing is agreed
            at intake, not promised on a page. The three cashiers are the live payment links — not new ones; the
            Forensic audit is scoped in a booked session and has no cashier.
          </p>
          <OffersGrid />
        </div>
      </section>
    </main>
  )
}
