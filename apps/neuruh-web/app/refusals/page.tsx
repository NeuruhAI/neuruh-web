import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refusals',
  description:
    'What Neuruh does not claim yet, stated first and unprompted: the hard zeros, and the capabilities that are architecture rather than delivered results.',
}

const HARD_ZEROS = [
  ['Revenue, ever', '$0'],
  ['Customers', '0'],
  ['Closed transactions through any product', '0'],
  ['People contacted by anything we built — calls, SMS, email, e-signature', '0'],
  ['Attributed outcomes, so the learning loop has never closed', '0'],
  ['Employees', '0 — founder only'],
  ['Outside capital raised', '$0'],
  ['External security reviews, penetration tests, SOC 2', '0'],
  ['GitHub stars across the public repositories (as of 2026-08-20)', '1'],
] as const

const ARCHITECTURE_NOT_RESULTS = [
  {
    capability: 'Self-improvement / the learning loop',
    state:
      'Exists in code with passing tests and has never executed on a real outcome. The calibration ledger refuses entries that arrive without a pre-registered outcome; the honest result of the first real run was DEFERRED_BY_CONTRACT.',
    gate: 'One real decision producing a real, attributed outcome — then 30 samples before any claim.',
  },
  {
    capability: 'Automatic production promotion',
    state: 'Classification runs in shadow; nothing is written to production automatically.',
    gate: 'Founder adoption of the graduation contract for the production write path.',
  },
  {
    capability: 'Private / on-prem deployment',
    state: 'The architecture supports it. It has never been deployed for anyone.',
    gate: 'A customer environment and a delivered deployment.',
  },
  {
    capability: 'Outreach — dialing, SMS, email',
    state: 'Surfaces exist. Nothing we built has ever contacted a person.',
    gate: 'Contact enrichment, a compliance stack, and explicit founder authorization.',
  },
  {
    capability: 'A second production vertical',
    state: 'Named and tested against a published five-condition framework. Not opened.',
    gate: 'At least 20 attributed outcomes from at least 2 customers in the first vertical.',
  },
  {
    capability: 'Outcome-based or success-fee pricing',
    state: 'Modelled. Not offered.',
    gate: 'The same 20 attributed outcomes.',
  },
] as const

export default function RefusalsPage() {
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">Refusals</p>
        <h1>What we do not claim yet.</h1>
        <p className="t-lede">
          Our product is the credibility of a refusal. A single unsupported claim would teach you that every honest
          number on this site requires re-verification — so the zeros come first, stated plainly, before anything else.
        </p>
      </header>

      <section className="semantic-section" aria-labelledby="hard-zeros">
        <h2 id="hard-zeros">The hard zeros — as of 2026-08-23</h2>
        <dl className="zeros-ledger">
          {HARD_ZEROS.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="source-line">
          Source: the dated receipt bank behind <Link className="text-link" href="/proof">/proof</Link>. These are
          simply where we are. They will change on this page when receipts change them.
        </p>
      </section>

      <section className="semantic-section" aria-labelledby="architecture-not-results">
        <h2 id="architecture-not-results">Architecture, not results</h2>
        <p>
          Each capability below is real as design and code, demoable as architecture, and never sold as a running
          outcome. The gate that would move it to a result is published next to it.
        </p>
        <div className="refusal-ledger">
          {ARCHITECTURE_NOT_RESULTS.map((item) => (
            <article key={item.capability} className="refusal-item">
              <h3>{item.capability}</h3>
              <p>{item.state}</p>
              <p className="refusal-gate">
                <strong>Gate to a result:</strong> {item.gate}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="semantic-section" aria-labelledby="why-refusals">
        <h2 id="why-refusals">Why publish this</h2>
        <p>
          Most systems record what they did. Neuruh also records what it declined to do, and why — an authority gate
          that withholds an action writes a receipt just like one that permits it. This page is the same discipline
          applied to marketing: the claims we refuse to make, kept as visible as the ones we make.
        </p>
        <p>
          <Link className="text-link" href="/proof">Inspect the receipts →</Link>
        </p>
      </section>
    </main>
  )
}
