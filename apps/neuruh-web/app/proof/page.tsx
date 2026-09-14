import Link from 'next/link'
import signature from '../../../../public/truth/signature.json'
import { getPublicObject, getPublicObjects, getPublicSnapshot } from '../../../../packages/public-truth/client'
import { ProofCardGrid } from '../../components/ProofCardGrid'
import { ContradictionObject } from '../../components/TruthPrimitives'
import { NOT_CLAIMED } from '../../lib/publicNotClaimed'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/proof',
  title: 'Proof',
  description: 'The Neuruh proof ledger: every published figure with the date it was verified, the receipt it came from, and the method that produced it — plus what is deliberately not claimed.',
})

/**
 * /proof — Layer 4 (Evidence and Trust).
 * This is the only surface that carries machine state. Monospace is correct here:
 * identifiers, receipts, dates, checksums. Every figure is read from the compiled
 * truth snapshot, which fails closed on any number without a classification, a
 * date, and a source.
 */

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

const day = (iso: string) => iso.slice(0, 10)

export default function ProofPage() {
  const snapshot = getPublicSnapshot()
  const ds = getPublicObject('deedsonar')!
  const loop = getPublicObject('governed-execution-loop')!
  const commons = getPublicObject('public-commons')!
  const census = getPublicObject('organism-census')!
  const liquidity = getPublicObject('liquidity-engine')!
  const fsp = getPublicObject('find-sell-profit')!
  const bookeit = getPublicObject('bookeit')!
  const curbclaim = getPublicObject('curbclaim')!
  const proofOs = getPublicObject('proof-os')!
  const factory = getPublicObject('venture-factory')!
  const galaxy = getPublicObject('galaxy')!
  const court = getPublicObject('release-court')!
  const claude = getPublicObject('dist-claude-code')!
  const m = (o: typeof ds, name: string) => o.metrics?.find((x) => x.name === name)
  const n = (o: typeof ds, name: string) => m(o, name)?.value
  const d = (o: typeof ds, name: string) => { const x = m(o, name); return x ? day(x.as_of) : '' }
  const fmt = (v?: number) => v?.toLocaleString('en-US') ?? ''
  const verifiedAsOf = day(snapshot.dataset.last_verified_at)
  return (
    <main id="main">
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow">Proof</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Here is the claim. Here is the evidence.</h1>
          <p className="ev-line verified-line" data-testid="verified-as-of">
            Verified as of <time dateTime={snapshot.dataset.last_verified_at}>{verifiedAsOf}</time> · snapshot {snapshot.dataset.id} · checksum {signature.snapshot_sha256.slice(0, 16)}…
          </p>
          <div className="method" data-testid="proof-method">
            <h2 className="method-h">How these figures are produced</h2>
            <p className="sec-sub">
              Each figure below is read from a compiled snapshot of dated receipts. A receipt is a file written by the
              system that did the work — a test court, a health endpoint, a census, a custody record — and stored with
              this site&apos;s source, so anyone can read the same file. The compiler refuses to build if a number lacks
              a classification, an as-of date, or a source reference. Nothing on this page is connected to a live
              system: the verification date above is the date the receipts were last re-read, and each figure keeps its
              own date. When a newer receipt exists, the older figure is kept with its date rather than silently
              replaced.
            </p>
          </div>
          <div className="ev-grid">
            <EvidenceCard
              claim="DeedSonar runs in production and attests its own release identity."
              lines={[
                `production tree <b>06cbb841</b> · repository main identical to production · read-only customer tape <b>${d(ds, 'customer_tape_steps_reachable')}</b>`,
                `tape reached <b>${n(ds, 'customer_tape_steps_reachable')} of 15</b> steps and stopped at the contact ladder — a human courthouse research step`,
                `earlier court: <b>${fmt(n(ds, 'tests_green_at_production_sha'))}</b> tests green at release <b>e2b71fa</b> · court ${d(ds, 'tests_green_at_production_sha')}`,
              ]}
              refLink={['DeedSonar record →', '/worlds/deedsonar']}
            />
            <EvidenceCard
              claim="The governed execution loop is converged and supervised — autonomous execution is not yet proven."
              lines={[
                `organism activation court <b>${day(loop.last_verified_at)}</b> · organs merged at exact heads · supervision pins converged · bounded ratification renewed`,
                `verdict recorded as <b>AUTONOMOUS_EXECUTION_NOT_PROVEN</b>: the live mission stayed parked at the Governance gate pending a founder-only qualification`,
              ]}
              refLink={['Read the boundary →', '/refusals']}
            />
            <EvidenceCard
              claim="The Liquidity Engine is a sealed, court-tested candidate — synthetic by contract."
              lines={[`<b>${n(liquidity, 'tests')}</b> tests · <b>${n(liquidity, 'operating_court_cases')}/18</b> operating court · <b>${n(liquidity, 'browser_page_checks')}/100</b> browser checks`, `custody NeuruhAI/neuruh-liquidity-engine @ <b>7f2af00</b> · ${d(liquidity, 'tests')}`]}
              refLink={['Liquidity record →', '/worlds/liquidity-engine']}
            />
            <EvidenceCard
              claim="Four more products are sealed with dated courts."
              lines={[
                `FindSellProfit <b>${n(fsp, 'tests')}</b> tests · Bookeit <b>${n(bookeit, 'unit_and_integration_tests')}</b> unit and integration + <b>${n(bookeit, 'e2e_assertions')}</b> E2E · CurbClaim <b>${n(curbclaim, 'tests')}</b> tests · ProofOS <b>${n(proofOs, 'courts')}</b> courts`,
                `Venture Factory <b>${n(factory, 'tests')}</b> tests · receipts vendored in this site&apos;s source · ${d(fsp, 'tests')}`,
              ]}
              refLink={['All products →', '/products']}
            />
            <EvidenceCard
              claim="The open-source commons is real and audited."
              lines={[
                `<b>${n(commons, 'public_code_repositories')}</b> public code repositories · <b>${n(commons, 'secret_scan_hits')}</b> secret-scan hits · audit ${d(commons, 'public_code_repositories')}`,
                `<b>${fmt(n(commons, 'passing_tests'))}</b> passing tests re-run across <b>${n(commons, 'python_packages_tested')}</b> Python packages at their advertised tags · <b>${n(commons, 'zero_dependency_packages')}</b> zero-dependency packages · re-verified ${d(commons, 'passing_tests')}`,
              ]}
              refLink={['Open source →', '/open-source']}
            />
            <EvidenceCard
              claim="The operating estate is counted under published rules."
              lines={[`<b>${n(census, 'canonical_active_runtimes')}</b> operating-estate services · <b>${n(census, 'repositories_under_custody')}</b> repositories · <b>${n(census, 'git_worktrees')}</b> worktrees · census ${d(census, 'canonical_active_runtimes')} · a point-in-time count of one host, not live organ products`]}
            />
            <EvidenceCard
              claim="Every public distribution surface is named with its real state."
              lines={[`<b>${getPublicObjects('system').length}</b> surfaces · release court <b>${n(court, 'broken_links')}</b> broken links · <b>${n(court, 'serious_accessibility_violations')}</b> serious and <b>${n(court, 'critical_accessibility_violations')}</b> critical accessibility violations · ${d(court, 'broken_links')}`, `submitted is not accepted · installing the plugin registers <b>${n(claude, 'plugin_skills')}</b> skills but does not install the Python package`]}
              refLink={['Distribution proof →', '/proof/distribution']}
            />
            <EvidenceCard
              claim="This snapshot itself is verifiable."
              lines={[`truth mode <b>${snapshot.dataset.truth_mode}</b> · last re-read <b>${verifiedAsOf}</b> · live connectivity <b>NONE</b>`, `snapshot sha256 <b>${signature.snapshot_sha256.slice(0, 16)}…</b> · ${snapshot.dataset.limitation}`]}
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
            These are stated unprompted, because a site whose claims you must double-check is worthless. Neuruh does
            not claim:
          </p>
          <ul className="not-claimed" data-testid="not-claimed">
            {NOT_CLAIMED.map((item) => <li key={item}>{item}</li>)}
          </ul>
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
