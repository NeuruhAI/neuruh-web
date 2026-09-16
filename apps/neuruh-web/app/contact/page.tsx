import Link from 'next/link'
import { CallLadder } from '../../components/CallLadder'
import { estateHref } from '../../lib/attribution'
import { pageMeta } from '../../lib/publicSeo'
import { ProductInquiry } from '../../components/ProductInquiry'

export const metadata = pageMeta({
  path: '/contact',
  title: 'Contact',
  description:
    'Route the work: pick one of four scoped offers, ask which path fits, book a call, or write to the founder at jeramie@neuruh.com.',
})

const ROUTES = [
  {
    title: 'A scoped offer',
    body: 'Data Rescue, Opportunity Intelligence Dossier, Workflow Replacement Sprint, or a Forensic System Audit — fixed scope, founder-delivered.',
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
    title: 'A Top 10 product',
    body: 'Ten products with truthful status: three with live checkout, the rest quoted by email.',
    href: '/products/top10',
    cta: 'See the Top 10',
  },
  {
    title: 'Real estate',
    body: 'One property, parcel, market, portfolio, or dataset. The real-estate front door is re.neuruh.com: a free call, a $100 scan, a $499 dossier, then custom.',
    href: estateHref('re', 'contact-re'),
    cta: 'Open re.neuruh.com',
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
          Most work should go through a scoped offer. If it does not fit a card, book a call or write to the founder —
          there is no sales team, no CRM form, and no autoresponder.
        </p>
      </header>

      <ProductInquiry />

      <section className="semantic-section" aria-labelledby="contact-routes">
        <h2 id="contact-routes">Route the work</h2>
        <dl className="zeros-ledger zeros-ledger--prose">
          {ROUTES.map((route) => (
            <div key={route.href}>
              <dt>{route.title}</dt>
              <dd>
                {route.body}{' '}
                {route.href.startsWith('http')
                  ? <a className="text-link" href={route.href} rel="noopener noreferrer">{route.cta} →</a>
                  : <Link className="text-link" href={route.href}>{route.cta} →</Link>}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="semantic-section" aria-labelledby="contact-calls">
        <h2 id="contact-calls">Book a call</h2>
        <p>A free ten-minute qualifying call, or a paid working session. Cal.com shows the rate before any paid booking is confirmed.</p>
        <CallLadder surface="root" />
      </section>

      <section className="semantic-section" aria-labelledby="contact-path">
        <h2 id="contact-path">The direct path</h2>
        <p className="contact-address">
          <a className="n-btn n-btn--primary" href="mailto:jeramie@neuruh.com">jeramie@neuruh.com</a>{' '}
          <a className="n-btn n-btn--secondary" href="tel:+12695001768">269-500-1768</a>
        </p>
        <p>Mail is forwarded to the founder&apos;s inbox and answered by a person. No autoresponder.</p>
        <p>Useful things to include, so the first reply is substantive:</p>
        <ul>
          <li>What you operate — domain, scale, and the decision you want governed or evidenced.</li>
          <li>What a good outcome looks like in 90 days.</li>
          <li>Any constraint that matters up front: data locality, compliance, budget shape.</li>
        </ul>
      </section>

      <section className="semantic-section" aria-labelledby="engagements">
        <h2 id="engagements">What an engagement can be</h2>
        <dl className="zeros-ledger zeros-ledger--prose">
          <div>
            <dt>Governed execution and evidence systems</dt>
            <dd>Authority gates, receipts, and claim discipline applied to an AI system you already run — or one designed from zero.</dd>
          </div>
          <div>
            <dt>Real-estate intelligence</dt>
            <dd>County-record opportunity intelligence in the DeedSonar lineage: evidence, ownership, risk, and decision packages — the public front door is re.neuruh.com.</dd>
          </div>
          <div>
            <dt>Forensic System Audit</dt>
            <dd>An evidence-backed report on a system you already run: what is true, what state it is in, where the gaps are, how to recover.</dd>
          </div>
          <div>
            <dt>Custom domain engines</dt>
            <dd>A world of your own on the shared substrate — intake to evidence to decision to receipt, scoped as a pilot.</dd>
          </div>
        </dl>
        <p className="claim-boundary">
          <strong>Claim boundary:</strong> engagement categories describe capability and architecture, not existing
          customer results — see what is <Link className="text-link" href="/refusals">not claimed</Link>.
        </p>
      </section>
    </main>
  )
}
