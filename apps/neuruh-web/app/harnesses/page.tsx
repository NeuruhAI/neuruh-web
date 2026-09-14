import Link from 'next/link'
import { ProductDemo } from '../../components/top10/ProductDemo'
import { HARNESS_STAGES } from '../../lib/harnessStages'
import s from '../../components/top10/Top10Product.module.css'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/harnesses',
  title: 'Harnesses — verification as a product',
  description: 'How a Neuruh harness engagement runs: intake, scope, baseline, golden, held-out and adversarial cases, run, delta, regressions, authority and evidence checks, decision, signed receipt. With a labeled browser demonstration.',
})

type Status = 'USED ON NEURUH RELEASES' | 'INTERNAL · COURTED' | 'RESEARCH' | 'PROPOSED'

const SUITE: Array<[string, string, Status, string]> = [
  ['Release regression harness', 'Crawl, snapshot, diff, signed report. Baseline-first: whatever production renders today becomes the assertion set, and a candidate that drops or changes it fails before promotion.', 'USED ON NEURUH RELEASES', 'neuruh-verify'],
  ['Evaluation and promotion harness', 'Freeze a baseline, run held-out and adversarial benchmarks, quantify the delta, list regressions, and emit a promotion proposal a human accepts or rejects.', 'INTERNAL · COURTED', 'neuruh-factory'],
  ['Evidence court', 'Require a sealed runtime receipt, an execution record, a governance allow record, and a mutually bound identity before evidence can pass. Fails closed on any missing element.', 'INTERNAL · COURTED', 'neuruh-sentinel-court'],
  ['Context and memory path harness', 'Prove mission identity survives composition with memory and context, that authority is checked, that receipts are emitted, and that identity survives restart and provider replacement.', 'INTERNAL · COURTED', 'context / memory path'],
  ['Runtime supervision harness', 'Verify health probes, re-entry ticks, canonical pins, restart and backoff, dependency order, bounded logs, and fail-closed halt.', 'INTERNAL · COURTED', 'runtime supervision'],
  ['Live integration harness', 'Freeze cross-system cases from ingestion through decision, validate the delivery contract, receipt chains, and governance decisions with a read-only production tape.', 'INTERNAL · COURTED', 'neuruh-live-integration'],
  ['Citation grounding harness', 'Exercise citation-grounding logic against fixed cases and retain a hash-chained receipt record.', 'RESEARCH', 'crucible'],
  ['Repair harness', 'Freeze files, guard the record, run bounded repair loops, and require verification before a repair is accepted.', 'RESEARCH', 'ncell'],
  ['Runtime ratification harness', 'Ratify read-only cockpit and runtime state against canonical pins and operational evidence.', 'INTERNAL · COURTED', 'neuruh-cockpit'],
  ['Customer assurance pack', 'Package a tenant-specific zero-regression receipt as the deliverable of a pilot rather than as internal telemetry.', 'PROPOSED', 'Agent Integrity Suite'],
]

const STAGE_MEANING: Record<(typeof HARNESS_STAGES)[number], string> = {
  INTAKE: 'You name the workflow, the release candidate, and who can say promote or reject.',
  SCOPE: 'One workflow, its allowed actions, and its evidence boundary are written down.',
  BASELINE: 'The current behavior is captured and frozen. The baseline is the assertion set.',
  'GOLDEN CASES': 'Cases you consider correct. The candidate must keep passing them.',
  'HELD-OUT CASES': 'Cases the builder did not see. They catch fitting to the test.',
  'ADVERSARIAL CASES': 'Injection, secrets, oversized input, boundary crossings. They must be refused.',
  RUN: 'Candidate and baseline run against the same cases under the same conditions.',
  DELTA: 'What changed, case by case, between baseline and candidate.',
  REGRESSIONS: 'Anything the baseline passed and the candidate fails. Listed, not averaged away.',
  'AUTHORITY CHECK': 'Did the agent act only within its stated permission? A denial is a failure, not a note.',
  'EVIDENCE CHECK': 'Is the evidence the agent cites actually present, and does it say what is claimed?',
  DECISION: 'PASS, SHADOW, MORE_EVIDENCE, or REJECT — one word, derived from the checks above.',
  'SIGNED RECEIPT': 'Identity, case set, results, and decision bound together and signed by a verifier that is not the thing under test.',
}

export default function HarnessCatalogPage() {
  return <main className={s.page} id="main">
    <section className={s.hero}><div className={s.wrap}>
      <Link href="/products/top10" className={s.back}>← Top 10 commercial products</Link>
      <div className={s.eyebrow}>HARNESSES · VERIFICATION AS A PRODUCT</div>
      <h1>Proof that the agent you ship today is the agent you authorized yesterday.</h1>
      <p className={s.promise}>A harness engagement turns “can we promote this?” into an evidence packet with one decision and a signed receipt. Neuruh runs this pattern on its own releases. This page explains how a buyer uses it, which harnesses exist, and what each one is and is not.</p>
      <div className={s.heroGrid}>
        <div><span className={s.label}>PRIMARY BUYER</span><strong>AI teams shipping agents into real workflows, and the people who have to accept them.</strong></div>
        <div><span className={s.label}>WHAT YOU GET</span><strong>Baseline, case corpus, delta and regression report, authority and evidence checks, a decision, a signed receipt.</strong></div>
        <div><span className={s.label}>STARTING OFFER</span><strong>$2,500 pilot against one workflow — test commercial pricing, quoted by email.</strong></div>
      </div>
      <div className={s.ctaPair} style={{ marginTop: 22 }}>
        <Link className={s.ctaButton} href="/contact?product=agent-integrity" data-testid="harness-cta">Request a harness pilot →</Link>
        <Link className={s.ctaSecondary} href="/products/top10/agent-integrity">Agent Integrity Suite product page</Link>
      </div>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>01</span><h2>The execution sequence</h2></div>
      <p className={s.promise}>Every engagement runs these thirteen stages in this order. Nothing is skipped; a stage that cannot run is recorded as blocked.</p>
      <div className={s.evidence} data-testid="harness-sequence">{HARNESS_STAGES.map((stage, i) => <div className={s.evidenceItem} key={stage}><span className={s.rank}>{String(i + 1).padStart(2, '0')}</span><p><b>{stage}</b> — {STAGE_MEANING[stage]}</p></div>)}</div>
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>02</span><h2>Browser demonstration</h2></div>
      <p className={s.promise}>Paste a baseline and a candidate artifact, or load the sample pair, and watch the thirteen stages run. The checks are structural, the digest is unsigned, and none of it touches a production system.</p>
      <ProductDemo mode="harness" />
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>03</span><h2>The harnesses that exist, and their status</h2></div>
      <div className={s.columns}>{SUITE.map(([name, desc, status, lineage]) => <article className={s.card} key={name} data-status={status}><span className={s.label}>{status}</span><b>{name}</b><p>{desc}</p><small className={s.rank}>{lineage}</small></article>)}</div>
      <p className={s.disclaimer}>Status meanings. USED ON NEURUH RELEASES: gates this site or a production system today. INTERNAL · COURTED: exists with its own tests and receipts, runs inside Neuruh only. RESEARCH: exists, not part of a release gate. PROPOSED: not built. None of these harnesses is externally callable; a pilot is run by a founder against your workflow. Repository names refer to private repositories.</p>
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.split}>
        <div><div className={s.sectionHead}><span>04</span><h2>What the customer buys</h2></div><ul><li>One workflow mapped to explicit permissions and expected outcomes.</li><li>Golden, held-out, and adversarial cases written against it.</li><li>A baseline capture and a candidate run under the same conditions.</li><li>Delta, regressions, authority and evidence checks in one report.</li><li>A decision and a signed receipt naming the exact tested identity.</li><li>Optional recurring re-runs on each release (quoted).</li></ul></div>
        <div><div className={s.sectionHead}><span>05</span><h2>How a buyer uses it</h2></div><ul><li>Bring the agent, workflow, or release candidate and the person who decides.</li><li>Agree the allowed actions and the evidence boundary in writing.</li><li>Neuruh captures the baseline and writes the cases; you review them.</li><li>The run produces the report and the decision.</li><li>Repair, rerun, and seal — or reject and stop.</li></ul></div>
      </div>
      <div className={s.cta}>
        <h2>Evidence that this is how Neuruh already works</h2>
        <p>This site’s own release court records 0 broken links and 0 serious or critical accessibility violations at the shipped SHA. The DeedSonar production court records 1,510 tests green at the SHA production attests. Both are dated and compiled on <Link className={s.back} href="/proof">/proof</Link>. No external customer pilot has been run yet; hard zeros on <Link className={s.back} href="/refusals">/refusals</Link> apply.</p>
        <div className={s.ctaPair}>
          <Link className={s.ctaButton} href="/contact?product=agent-integrity">Request a harness pilot →</Link>
          <Link className={s.ctaSecondary} href="/products/top10/ai-estate-forensic">Or start with an estate audit</Link>
        </div>
      </div>
    </div></section>
  </main>
}
