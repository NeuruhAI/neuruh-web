import Link from 'next/link'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/founder',
  title: 'Founder',
  description: 'Jeramie Hicks built Neuruh by asking the operator’s question — how would I know if this were wrong? — until it became infrastructure. The work is the evidence.',
})

const TIMELINE: ReadonlyArray<readonly [string, string, string, boolean]> = [
  ['TWO DECADES', 'Operations, not engineering', 'Roughly twenty-five years operating real businesses. No CS degree claimed, no prior exits claimed — an operator’s habit of asking what a number actually means before acting on it.', false],
  ['2025', 'The land business meets software', 'A vacant-land investment operation needs deal flow, evidence, and discipline. The first CRM and county-data pipelines get built — AI-assisted from day one, stated plainly.', false],
  ['EARLY 2026', 'The discovery that set the direction', 'In its own code, an agent is found minting approvals and consuming them. Closing that — then finding three more fail-opens in the layer meant to prevent it — becomes the company thesis: authority must be checked, and everything must leave a receipt.', true],
  ['MID 2026', 'The machine grows a spine', 'Governance gates, receipts, provenance chains, and courts spread across the estate: DeedSonar reaches production with an attested SHA; the open-source commons is published and audited.', false],
  ['AUG 2026', 'The product wave', 'In one month: FindSellProfit, Bookeit, CurbClaim, ProofOS, and the Liquidity Engine are sealed as court-tested candidates — every claim receipted, every fixture labeled.', false],
  ['NOW', 'The front door opens', 'Neuruh.com goes public: the machine, the products, and the proof — with the boundaries stated as carefully as the claims.', false],
]

export default function FounderPage() {
  return (
    <main id="main">
      <section className="sec">
        <div className="sec-inner" style={{ maxWidth: '58rem' }}>
          <p className="sec-eyebrow">Founder</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)' }}>The pieces were never the problem. Coherence was.</h1>
          <p className="sec-sub" style={{ fontSize: '1.15rem' }}>
            <strong style={{ color: 'var(--v2-text)' }}>Jeramie Hicks.</strong> Benton Harbor, Michigan. Founder of
            Neuruh LLC. An operator who came to autonomous systems from business operations and kept asking the
            question engineering convention skips: <em>how would I know if this were wrong?</em>
          </p>
          <p className="sec-sub">
            The engineering is AI-assisted and always has been — that is a fact of the record, stated up front. What
            makes the work unusual is not who typed it; it is that every capability had to survive courts, custody,
            receipts, and an authority gate before it could call itself real.
          </p>
        </div>
      </section>
      <section className="sec sec-alt" aria-labelledby="tl-h">
        <div className="sec-inner" style={{ maxWidth: '58rem' }}>
          <h2 className="sec-h" id="tl-h">The work, in order</h2>
          <div className="timeline">
            {TIMELINE.map(([date, h, p, brass]) => (
              <div className={brass ? 'tl-item tl-brass' : 'tl-item'} key={h}>
                <p className="tl-d">{date}</p>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec" aria-labelledby="pr-h">
        <div className="sec-inner" style={{ maxWidth: '58rem' }}>
          <h2 className="sec-h" id="pr-h">Principles that survived contact</h2>
          <div className="law-list">
            <div className="law"><span className="ln">01</span><div><h3>Depth is earned, not applied.</h3><p>No surface ships before the machinery under it exists.</p></div></div>
            <div className="law"><span className="ln">02</span><div><h3>The strongest evidence is what the system caught itself doing wrong.</h3><p>The defect ledger is part of the product — disclosed, dated, and closed with contracts.</p></div></div>
            <div className="law"><span className="ln">03</span><div><h3>Honest incompleteness beats polished fiction.</h3><p>Blocked, degraded, planned, and unknown are first-class states — on the systems and on this site.</p></div></div>
          </div>
          <div className="hero-ctas" style={{ marginTop: 28 }}>
            <Link className="v2-btn v2-btn-primary" href="/contact">Talk to the founder</Link>
            <Link className="v2-btn v2-btn-secondary" href="/proof">See the receipts</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
