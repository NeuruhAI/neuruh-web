import Link from 'next/link'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/contact',
  title: 'Contact',
  description:
    'Route the work: pick a scoped offer, ask Neuruh which public path fits, or email the founder for custom engagements.',
})

const ROUTES = [
  {
    title: 'A scoped offer',
    body: 'Data Rescue, Opportunity Dossier, or Workflow Sprint — fixed scope, live checkout.',
    href: '/offers',
    cta: 'See offers',
  },
  {
    title: 'Not sure which',
    body: 'Ask Neuruh returns three public cards: FASTEST, BEST VALUE, CUSTOM.',
    href: '/ask',
    cta: 'Ask Neuruh',
  },
  {
    title: 'Already checked out',
    body: 'This static site has no payment webhook. The handoff page tells you what happens next.',
    href: '/thank-you',
    cta: 'Open the handoff',
  },
] as const

export default function ContactPage() {
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">Contact</p>
        <h1>Start with the right path.</h1>
        <p className="t-lede">
          Most work should go through a scoped offer. If it does not fit a card, mail goes to the founder — there is
          no sales team, no CRM form, and no autoresponder.
        </p>
      </header>

      <section className="semantic-section" aria-labelledby="contact-routes">
        <h2 id="contact-routes">Route the work</h2>
        <dl className="zeros-ledger">
          {ROUTES.map((route) => (
            <div key={route.href}>
              <dt>{route.title}</dt>
              <dd>
                {route.body}{' '}
                <Link className="text-link" href={route.href}>{route.cta} →</Link>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="semantic-section" aria-labelledby="contact-path">
        <h2 id="contact-path">The direct path</h2>
        <p className="contact-address">
          <a className="n-btn n-btn--primary" href="mailto:jeramie@neuruh.com">jeramie@neuruh.com</a>
        </p>
        <p>Useful things to include, so the first reply is substantive:</p>
        <ul>
          <li>What you operate — domain, scale, and the decision you want governed or evidenced.</li>
          <li>What a good outcome looks like in 90 days.</li>
          <li>Any constraint that matters up front: data locality, compliance, budget shape.</li>
        </ul>
      </section>

      <section className="semantic-section" aria-labelledby="engagements">
        <h2 id="engagements">What an engagement can be</h2>
        <dl className="zeros-ledger">
          <div>
            <dt>Governed execution and evidence systems</dt>
            <dd>Authority gates, receipts, and claim discipline applied to an AI system you already run — or one designed from zero.</dd>
          </div>
          <div>
            <dt>Real-estate intelligence</dt>
            <dd>County-record acquisition intelligence in the DeedSonar lineage: evidence, ownership, risk, and decision packages.</dd>
          </div>
          <div>
            <dt>Custom domain engines</dt>
            <dd>A world of your own on the shared substrate — intake to evidence to decision to receipt, scoped as a pilot.</dd>
          </div>
        </dl>
        <p className="claim-boundary">
          <strong>Claim boundary:</strong> engagement categories describe capability and architecture, not existing
          customer results — the zeros on <Link className="text-link" href="/refusals">/refusals</Link> apply until
          receipts change them.
        </p>
      </section>
    </main>
  )
}
