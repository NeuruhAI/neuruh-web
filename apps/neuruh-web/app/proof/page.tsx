import Link from 'next/link'
import signature from '../../../../public/truth/signature.json'
import { EVIDENCE_MODES, evidenceMode, getPublicObject, getPublicObjects, getPublicSnapshot } from '../../../../packages/public-truth/client'
import { ProofCardGrid } from '../../components/ProofCardGrid'
import { ContradictionObject } from '../../components/TruthPrimitives'
import { NOT_CLAIMED } from '../../lib/publicNotClaimed'
import { LADDER, LADDER_RECORD, RUNG_LABEL, TOP10 } from '../../lib/top10'
import t10 from '../../components/top10/Top10Product.module.css'
import { pageMeta } from '../../lib/publicSeo'
import { ProofReceipts } from '../../components/ProofReceipts'

export const metadata = pageMeta({
  path: '/proof',
  title: 'Proof',
  description: 'Every claim I make in public, traced to a dated receipt. If the link dies, the claim goes with it.',
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
  // Every evidence line opens with the mode of the figure it cites (VERIFIED SNAPSHOT · ATTESTED · HISTORICAL).
  const mode = (o: typeof ds, name: string) => {
    const x = m(o, name)
    const label = x ? evidenceMode(x) : 'ATTESTED'
    return `<span class="ev-mode" data-evidence-mode="${label}">${label}</span> · `
  }
  const verifiedAsOf = day(snapshot.dataset.last_verified_at)
  return (
    <main id="main">
      <ProofReceipts />
      <section className="sec" id="ledger">
        <div className="sec-inner">
          <p className="sec-eyebrow">Proof</p>
          <h2 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Here is the claim. Here is the evidence.</h2>
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
            <p className="sec-sub" data-testid="evidence-modes">
              Every evidence line is labelled with its mode. <b>VERIFIED SNAPSHOT</b>: re-read within a day of the
              verification date above. <b>ATTESTED</b>: an earlier dated receipt that is still the newest for that
              figure. <b>HISTORICAL</b>: superseded by a newer receipt and kept with its date — never the current state.
              No figure on this site is live.
            </p>
          </div>
          <div className="ev-grid">
            <EvidenceCard
              claim="DeedSonar runs in production, and its current state was re-read end to end."
              lines={[
                `${mode(ds, 'current_estate_properties')}current estate <b>${fmt(n(ds, 'current_estate_properties'))}</b> properties · <b>${fmt(n(ds, 'qualified_properties'))}</b> qualified · contact authority on <b>${n(ds, 'contact_authorized_rows')}</b> rows — production cannot record contact permission · ${d(ds, 'current_estate_properties')}`,
                `${mode(ds, 'customer_tape_steps_reachable')}read-only customer tape: the product&apos;s own top opportunity reached <b>${n(ds, 'customer_tape_steps_reachable')} of 15</b> steps and stopped at the contact ladder — a human courthouse research step · ${d(ds, 'customer_tape_steps_reachable')}`,
                `${mode(ds, 'customer_tape_steps_reachable_20260914')}the same tape on ${d(ds, 'customer_tape_steps_reachable_20260914')} reached <b>${n(ds, 'customer_tape_steps_reachable_20260914')} of 15</b> at an earlier production release`,
              ]}
              refLink={['DeedSonar record →', '/worlds/deedsonar']}
            />
            <EvidenceCard
              claim="One bounded mission chain completed end to end — general autonomous execution is not claimed."
              lines={[
                `${mode(loop, 'missions_completed_end_to_end')}<b>${n(loop, 'missions_completed_end_to_end')}</b> missions (a parent and its follow-on) each passed their own approval, scheduled dispatch, an independent court and a verified receipt · ${d(loop, 'missions_completed_end_to_end')} · re-derived by the convergence registrar ${day(loop.last_verified_at)}`,
                `${mode(loop, 'open_review_gates')}an independent post-hoc review left <b>${n(loop, 'open_review_gates')}</b> founder gates open on how completion evidence is trusted · ${d(loop, 'open_review_gates')}`,
                `<span class="ev-mode" data-evidence-mode="HISTORICAL">HISTORICAL</span> · the 2026-09-14 activation court recorded <b>AUTONOMOUS_EXECUTION_NOT_PROVEN</b> with the mission parked at the governance gate`,
              ]}
              refLink={['Read the boundary →', '/refusals']}
            />
            <EvidenceCard
              claim="The Liquidity Engine is a sealed, court-tested candidate — synthetic by contract."
              lines={[`${mode(liquidity, 'tests')}<b>${n(liquidity, 'tests')}</b> tests · <b>${n(liquidity, 'operating_court_cases')}/18</b> operating court · <b>${n(liquidity, 'browser_page_checks')}/100</b> browser checks`, `custody NeuruhAI/neuruh-liquidity-engine @ <b>7f2af00</b> · ${d(liquidity, 'tests')}`]}
              refLink={['Liquidity record →', '/worlds/liquidity-engine']}
            />
            <EvidenceCard
              claim="Four more products are sealed with dated courts."
              lines={[
                `${mode(fsp, 'tests')}FindSellProfit <b>${n(fsp, 'tests')}</b> tests · Bookeit <b>${n(bookeit, 'unit_and_integration_tests')}</b> unit and integration + <b>${n(bookeit, 'e2e_assertions')}</b> E2E · CurbClaim <b>${n(curbclaim, 'tests')}</b> tests · ProofOS <b>${n(proofOs, 'courts')}</b> courts`,
                `${mode(factory, 'tests')}Venture Factory <b>${n(factory, 'tests')}</b> tests · receipts vendored in this site&apos;s source · ${d(fsp, 'tests')}`,
              ]}
              refLink={['All products →', '/products']}
            />
            <EvidenceCard
              claim="The open-source commons is real and audited."
              lines={[
                `${mode(commons, 'public_code_repositories')}<b>${n(commons, 'public_code_repositories')}</b> public code repositories · <b>${n(commons, 'secret_scan_hits')}</b> secret-scan hits · audit ${d(commons, 'public_code_repositories')}`,
                `${mode(commons, 'passing_tests')}<b>${fmt(n(commons, 'passing_tests'))}</b> passing tests re-run across <b>${n(commons, 'python_packages_tested')}</b> Python packages at their advertised tags · <b>${n(commons, 'zero_dependency_packages')}</b> zero-dependency packages · re-verified ${d(commons, 'passing_tests')}`,
              ]}
              refLink={['Open source →', '/open-source']}
            />
            <EvidenceCard
              claim="The operating estate is counted under published rules."
              lines={[`${mode(census, 'canonical_active_runtimes')}<b>${n(census, 'canonical_active_runtimes')}</b> operating-estate services · <b>${n(census, 'repositories_under_custody')}</b> repositories · <b>${n(census, 'git_worktrees')}</b> worktrees · census ${d(census, 'canonical_active_runtimes')} · a point-in-time count of one host, not live organ products`]}
            />
            <EvidenceCard
              claim="Every public distribution surface is named with its real state."
              lines={[`${mode(court, 'broken_links')}<b>${getPublicObjects('system').length}</b> surfaces · release court <b>${n(court, 'broken_links')}</b> broken links · <b>${n(court, 'serious_accessibility_violations')}</b> serious and <b>${n(court, 'critical_accessibility_violations')}</b> critical accessibility violations · ${d(court, 'broken_links')}`, `${mode(claude, 'plugin_skills')}submitted is not accepted · installing the plugin registers <b>${n(claude, 'plugin_skills')}</b> skills but does not install the Python package`]}
              refLink={['Distribution proof →', '/proof/distribution']}
            />
            <EvidenceCard
              claim="This snapshot itself is verifiable."
              lines={[`truth mode <b>${snapshot.dataset.truth_mode}</b> · last re-read <b>${verifiedAsOf}</b> · not connected to a live system · modes in use: ${EVIDENCE_MODES.join(' / ')}`, `snapshot sha256 <b>${signature.snapshot_sha256.slice(0, 16)}…</b> · ${snapshot.dataset.limitation}`]}
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

      <section className="sec" id="commercial-ladder" aria-labelledby="ladder-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Commercial ladder</p>
          <h2 className="sec-h" id="ladder-h">Where each product stands, rung by rung.</h2>
          <p className="sec-sub">
            Product → Offer → Checkout or quote → Intake → Fulfillment → Delivery → Receipt → Outcome. A rung is
            PROVEN LIVE only when it has been exercised on the public site and courted. Fulfillment, delivery, and
            receipt are founder-operated and become PROVEN LIVE only with a delivered, receipted engagement.
          </p>
          <p className="ev-line" data-testid="ladder-record">
            Recorded {LADDER_RECORD.asOf} · Top 10 commercial court · receipt {LADDER_RECORD.receipt} · not a live feed
          </p>
          {TOP10.map((p) => (
            <div key={p.slug} style={{ marginTop: 18 }} data-testid={`ladder-${p.slug}`}>
              <p className="ev-k"><Link className="v2-link" href={`/products/top10/${p.slug}`}>{p.name}</Link> · {p.status}</p>
              <div className={t10.ladder}>{LADDER.map((rung) => <div className={t10.rung} key={rung} data-status={p.ladder[rung]}><span>{rung}</span><b>{RUNG_LABEL[p.ladder[rung]]}</b></div>)}</div>
            </div>
          ))}
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
