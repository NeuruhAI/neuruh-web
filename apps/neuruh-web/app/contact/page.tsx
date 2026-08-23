import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Work with Neuruh: pilots on governed execution and evidence systems, real-estate intelligence, and custom domain engines. Direct line to the founder.',
}

export default function ContactPage() {
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">Contact</p>
        <h1>Talk to the founder.</h1>
        <p className="t-lede">
          Neuruh is founder-operated. There is no sales team, no form that feeds a CRM, and no autoresponder — mail
          goes to the person who built the systems on this site.
        </p>
      </header>

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
