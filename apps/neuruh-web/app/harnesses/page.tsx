import Link from 'next/link'
import { ProductDemo } from '../../features/top10/ProductDemo'
import s from '../../features/top10/Top10Product.module.css'
import { pageMeta } from '../lib/publicSeo'

export const metadata = pageMeta({
  path: '/harnesses',
  title: 'Neuruh Harnesses',
  description: 'The Neuruh harness catalog: release verification, adversarial evaluation, evidence courts, permission checks, runtime supervision, recovery, and customer assurance.',
})

const suites = [
  ['VERIFY', 'Release Regression Harness', 'Crawl → snapshot → diff → signed report. Designed to catch UI, DOM, readiness, auth, and deployment regressions before promotion.'],
  ['FACTORY', 'Evaluation + Promotion Harness', 'Freeze baselines, run held-out and adversarial benchmarks, quantify delta, report regressions, and emit a promotion proposal.'],
  ['SENTINEL', 'Evidence Court', 'Require sealed runtime receipt, execution ledger, governance allow record, and mutually bound identity before evidence can pass.'],
  ['AXON', 'Context / Memory Path Harness', 'Prove mission identity, composition after memory/context mux, governance authority, receipt emission, restart identity, and provider replacement behavior.'],
  ['SOPS', 'Runtime Supervision Harness', 'Verify health probes, re-entry ticks, canonical pins, restart/backoff, dependency ordering, bounded logs, and fail-closed HALT behavior.'],
  ['LIVE', 'Integration Harness', 'Freeze cross-system cases from LandOS → Recipe → DeedSonar, validate CRM-ready contracts, receipt chains, governance decisions, and router behavior.'],
  ['CRUCIBLE', 'Citation Grounding Harness', 'Exercise citation-grounding logic against fixed cases and retain a hash-chained receipt ledger.'],
  ['NCELL', 'Agent / Repair Harness', 'Freeze files, guard ledgers, run repair loops, and require verification before a repair is accepted.'],
  ['COCKPIT', 'Runtime Ratification Harness', 'Ratify read-only cockpit and runtime state against canonical pins and operational evidence.'],
  ['WHITE-LABEL', 'Customer Assurance Pack', 'Package a tenant-specific zero-regression receipt as a deliverable, not merely as internal engineering telemetry.'],
]

export default function HarnessCatalogPage() {
  return <main className={s.page} id="main">
    <section className={s.hero}><div className={s.wrap}>
      <Link href="/products/top10" className={s.back}>← Commercial products</Link>
      <div className={s.eyebrow}>HARNESS CATALOG · NEURUH ASSURANCE</div>
      <h1>Make the invisible part of AI quality visible.</h1>
      <p className={s.promise}>Neuruh already has a family of harnesses for release verification, evaluation, evidence, authority, runtime supervision, integration, repair, and ratification. This page turns that engineering substrate into a commercial product surface.</p>
      <div className={s.heroGrid}><div><span className={s.label}>PRIMARY BUYER</span><strong>AI teams shipping agents into real workflows</strong></div><div><span className={s.label}>BUYER OUTPUT</span><strong>Signed, inspectable assurance instead of “it passed on my machine”</strong></div><div><span className={s.label}>STARTING OFFER</span><strong>$2,500 pilot against one workflow</strong></div></div>
    </div></section>
    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>01</span><h2>The suite</h2></div>
      <div className={s.columns}>{suites.map(([tag,name,desc]) => <article className={s.card} key={tag}><span className={s.label}>{tag}</span><b>{name}</b><p>{desc}</p></article>)}</div>
    </div></section>
    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>02</span><h2>Try the assurance surface</h2></div>
      <ProductDemo mode="harness" />
    </div></section>
    <section className={s.section}><div className={s.wrap}>
      <div className={s.split}><div><div className={s.sectionHead}><span>03</span><h2>What the customer buys</h2></div><ul><li>One workflow mapped to explicit permissions and expected outcomes.</li><li>Golden, held-out, and adversarial test cases.</li><li>Automated evidence collection and failure reports.</li><li>Release or acceptance receipt with the exact tested identity.</li><li>Optional recurring monitoring and re-runs.</li></ul></div><div><div className={s.sectionHead}><span>04</span><h2>How to use it</h2></div><ul><li>Bring the agent, workflow, or release candidate.</li><li>Define the allowed actions and evidence boundary.</li><li>Capture a baseline.</li><li>Run the harness against the candidate.</li><li>Repair, rerun, and seal the result.</li></ul></div></div>
      <div className={s.cta}><h2>Do not sell “AI safety.” Sell a decision.</h2><p>“Can we promote this agent?” “Can we accept this vendor?” “Can this release touch production?” The harness turns those questions into an evidence packet.</p><Link className={s.ctaButton} href="/contact?product=agent-integrity">Start a harness pilot →</Link></div>
    </div></section>
  </main>
}
