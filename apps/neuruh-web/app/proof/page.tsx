import Link from 'next/link'
import signature from '../../../../public/truth/signature.json'
import { getPublicObject, getPublicObjects, getPublicSnapshot } from '../../../../packages/public-truth/client'
import { ProofCardGrid } from '../../components/ProofCardGrid'
import { ContradictionObject } from '../../components/TruthPrimitives'
import { PUBLIC_HARD_ZEROS } from '../../lib/publicHardZeros'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/proof',
  title: 'Proof',
  description: 'Claim–evidence pairs for everything Neuruh asserts: production identity, dated courts, the audited commons, the operating census — and what is deliberately not claimed.',
})

function EvidenceCard({ claim, k, lines, refLink }: { claim: string; k?: string; lines: string[]; refLink?: [string, string] }) {
  return (
    <div className="ev-card">
      <p className="ev-k">Claim</p>
      <p className="claim">{claim}</p>
      <p className="ev-k">Evidence</p>
      {lines.map((line) => <p className="ev-line" key={line} dangerouslySetInnerHTML={{ __html: line }} />)}
      {refLink && <Link className="v2-link" href={refLink[1]}>{refLink[0]}</Link>}
      {k && <p className="ev-line" style={{ color: 'var(--v2-steel-ink)' }}>{k}</p>}
    </div>
  )
}

export default function ProofPage() {
  const snapshot = getPublicSnapshot()
  const ds = getPublicObject('deedsonar')!
  const commons = getPublicObject('public-commons')!
  const census = getPublicObject('organism-census')!
  const liquidity = getPublicObject('liquidity-engine')!
  const fsp = getPublicObject('find-sell-profit')!
  const galaxy = getPublicObject('galaxy')!
  const court = getPublicObject('release-court')!
  const claude = getPublicObject('dist-claude-code')!
  const n = (o: typeof ds, name: string) => o.metrics?.find((m) => m.name === name)?.value
  const d = (o: typeof ds) => o.metrics?.[0]?.as_of.slice(0, 10)
  return (
    <main id="main">
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow">Proof</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Here is the claim. Here is the evidence.</h1>
          <p className="sec-sub">
            Every number on this site is compiled from dated receipts by a fail-closed truth system — numbers without a
            classification, a date, and a source do not build. This page is the primary ledger; the raw snapshot is
            open below it.
          </p>
          <div className="ev-grid">
            <EvidenceCard
              claim="DeedSonar runs in production and its court is green."
              lines={[`health endpoint attests <b>sha e2b71fa</b> (observed 2026-08-24)`, `<b>${n(ds, 'tests_green_at_production_sha')?.toLocaleString('en-US')}</b> tests green at that SHA · court ${d(ds)}`]}
              refLink={['DeedSonar record →', '/worlds/deedsonar']}
            />
            <EvidenceCard
              claim="The Liquidity Engine is a sealed, court-tested candidate — synthetic by contract."
              lines={[`<b>${n(liquidity, 'tests')}</b> tests · <b>${n(liquidity, 'operating_court_cases')}/18</b> operating court · <b>${n(liquidity, 'browser_page_checks')}/100</b> browser checks`, `custody NeuruhAI/neuruh-liquidity-engine @ <b>7f2af00</b> · ${d(liquidity)}`]}
              refLink={['Liquidity record →', '/worlds/liquidity-engine']}
            />
            <EvidenceCard
              claim="Four more products are sealed with dated courts."
              lines={[`FindSellProfit <b>${n(fsp, 'tests')}</b> tests · Bookeit <b>161</b> + <b>133</b> E2E · CurbClaim <b>202</b> · ProofOS <b>14</b> courts`, `receipts vendored in-repo · 2026-08-22`]}
              refLink={['All products →', '/products']}
            />
            <EvidenceCard
              claim="The open-source commons is real and audited."
              lines={[`<b>${n(commons, 'public_code_repositories')}</b> public repos · <b>${n(commons, 'passing_tests')?.toLocaleString('en-US')}</b> passing tests · <b>0</b> secret-scan hits · audited ${d(commons)}`]}
              refLink={['Open source →', '/open-source']}
            />
            <EvidenceCard
              claim="The operating estate is counted under published rules."
              lines={[`<b>${n(census, 'canonical_active_runtimes')}</b> operating-estate services · <b>${n(census, 'repositories_under_custody')}</b> repositories · <b>${n(census, 'git_worktrees')}</b> worktrees · census ${d(census)} · not live organ products`]}
            />
            <EvidenceCard
              claim="Every public distribution surface is named with its real state."
              lines={[`<b>${getPublicObjects('system').length}</b> surfaces · release court <b>${n(court, 'broken_links')}</b> broken links · <b>${n(court, 'serious_accessibility_violations')}</b> serious and <b>${n(court, 'critical_accessibility_violations')}</b> critical accessibility violations · ${d(court)}`, `submitted is not accepted · installing the plugin registers <b>${n(claude, 'plugin_skills')}</b> skills but does not install the Python package`]}
              refLink={['Distribution proof →', '/proof/distribution']}
            />
            <EvidenceCard
              claim="This snapshot itself is verifiable."
              lines={[`truth mode <b>${snapshot.dataset.truth_mode}</b> · verified <b>${snapshot.dataset.last_verified_at.slice(0, 10)}</b> · stale <b>${snapshot.dataset.stale ? 'TRUE' : 'FALSE'}</b> · living state <b>${snapshot.living_state}</b> · live connectivity <b>NONE</b>`, `snapshot sha256 <b>${signature.snapshot_sha256.slice(0, 16)}…</b> · ${snapshot.dataset.limitation}`]}
              k={signature.signature_kind}
            />
          </div>
        </div>
      </section>

      <section className="sec sec-alt" aria-labelledby="proof-cards-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Public-safe cards</p>
          <h2 className="sec-h" id="proof-cards-h">Show the magic. Never ship the factory.</h2>
          <p className="sec-sub">
            Merged is not live. IN_REVIEW is not listed. A live cashier is not automated fulfillment. SHIP-001 on
            neuruh.com is SHIPPED_LIVE. JGI, Switchboard, Honey Pot, and Cockpit are merged/courted — not live
            products. No private-repo links. No factory internals.
          </p>
          <ProofCardGrid />
        </div>
      </section>

      <section className="sec" aria-labelledby="not-h">
        <div className="sec-inner">
          <h2 className="sec-h" id="not-h">What is not claimed</h2>
          <p className="sec-sub">
            Revenue: {PUBLIC_HARD_ZEROS.revenue}. Customers: {PUBLIC_HARD_ZEROS.customers}. Outreach performed by
            anything we built: {PUBLIC_HARD_ZEROS.outreach}. External security reviews:{' '}
            {PUBLIC_HARD_ZEROS.securityReviews}. As of {PUBLIC_HARD_ZEROS.asOf} — {PUBLIC_HARD_ZEROS.source}. Not a
            live Stripe readout. These are stated unprompted, because a site whose numbers you must double-check is
            worthless.
          </p>
          <ContradictionObject contradiction={galaxy.contradictions![0]} />
          <div className="row" style={{ marginTop: 22 }}>
            <Link className="v2-btn v2-btn-secondary" href="/refusals">Read every boundary</Link>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="deep-h">
        <div className="sec-inner">
          <h2 className="sec-h" id="deep-h">Deep inspection</h2>
          <details className="evidence-disclosure">
            <summary>Open the raw snapshot ledger (sources, objects, limitations)</summary>
            <p className="ev-line" style={{ marginTop: 10 }}>
              The compiled snapshot serves at <a className="v2-link" href="/truth/snapshot.json">/truth/snapshot.json</a>{' '}
              with its checksum at <a className="v2-link" href="/truth/signature.json">/truth/signature.json</a>. Every
              object carries truth mode, claim class, source, dated metrics, and explicit limitations. Gate ledger:
              G1 device validation BLOCKED_EXTERNAL_DEVICES · G2 renderer certification NOT_CERTIFIED · public launch
              AUTHORIZED_BY_FOUNDER_CONSTITUTION_2026-08-23.
            </p>
          </details>
        </div>
      </section>
    </main>
  )
}
