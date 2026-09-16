import Link from 'next/link'
import { ProductDemo } from '../../components/top10/ProductDemo'
import { HARNESS_STAGES } from '../../lib/harnessStages'
import s from '../../components/top10/Top10Product.module.css'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/harnesses',
  title: 'Harnesses — test whether an AI system actually works',
  description: 'A harness engagement tests whether an AI system does what it is supposed to do, using reproducible evidence: baseline, golden, held-out and adversarial cases, delta, regressions, authority and evidence checks, one decision, a signed receipt. With a labeled browser demonstration.',
})

type Status = 'USED ON NEURUH RELEASES' | 'INTERNAL · COURTED' | 'RESEARCH' | 'PROPOSED'

const SUITE: Array<[string, string, Status, string]> = [
  ['Release regression harness', 'Records what your system does today, then fails any new version that silently changes it. Crawl, snapshot, diff, signed report.', 'USED ON NEURUH RELEASES', 'neuruh-verify'],
  ['Evaluation and promotion harness', 'Runs a candidate against held-out and adversarial cases, measures the difference from the baseline, and proposes promote or reject for a human to decide.', 'INTERNAL · COURTED', 'neuruh-factory'],
  ['Evidence court', 'Refuses to accept a result unless the receipt, the execution record, the permission record, and the identity of what ran are all present and bound together.', 'INTERNAL · COURTED', 'neuruh-sentinel-court'],
  ['Context and memory path harness', 'Proves an agent still knows who it is and what it is allowed to do after memory, context, restarts, and a swapped model provider.', 'INTERNAL · COURTED', 'context / memory path'],
  ['Runtime supervision harness', 'Checks health probes, restarts, pinned versions, dependency order, bounded logs, and that the system halts closed when something is wrong.', 'INTERNAL · COURTED', 'runtime supervision'],
  ['Live integration harness', 'Freezes cross-system cases from ingestion through decision and replays them read-only against production to prove the chain still holds.', 'INTERNAL · COURTED', 'neuruh-live-integration'],
  ['Citation grounding harness', 'Checks that what a system cites actually exists and says what is claimed, and keeps a hash-chained record of every check.', 'RESEARCH', 'crucible'],
  ['Repair harness', 'Bounded repair loops that must pass verification before a fix is accepted.', 'RESEARCH', 'ncell'],
  ['Runtime ratification harness', 'Confirms a running system matches its pinned, courted version before it is trusted.', 'INTERNAL · COURTED', 'neuruh-cockpit'],
  ['Customer assurance pack', 'The pilot deliverable: your workflow’s zero-regression receipt, packaged for you rather than kept as internal telemetry.', 'PROPOSED', 'Agent Integrity Suite'],
]

const STAGE_MEANING: Record<(typeof HARNESS_STAGES)[number], string> = {
  INTAKE: 'You name the workflow, the version you want to ship, and who gets to say yes or no.',
  SCOPE: 'One workflow, what it is allowed to do, and what evidence counts, written down.',
  BASELINE: 'How the current version behaves is captured and frozen. That is the yardstick.',
  'GOLDEN CASES': 'Cases you consider correct. The new version must keep passing them.',
  'HELD-OUT CASES': 'Cases the builder never saw, so the test cannot be gamed.',
  'ADVERSARIAL CASES': 'Injected instructions, secrets, oversized input, boundary crossings. They must be refused.',
  RUN: 'The new version and the baseline run the same cases under the same conditions.',
  DELTA: 'What changed, case by case.',
  REGRESSIONS: 'Anything the old version passed and the new one fails. Listed, never averaged away.',
  'AUTHORITY CHECK': 'Did it stay inside its permissions? Stepping outside is a failure, not a footnote.',
  'EVIDENCE CHECK': 'Is the evidence it cites actually there, and does it say what is claimed?',
  DECISION: 'One word: PASS, SHADOW, MORE_EVIDENCE, or REJECT, derived from the checks above.',
  'SIGNED RECEIPT': 'Identity, cases, results, and decision bound together and signed by something that is not the thing under test.',
}

export default function HarnessCatalogPage() {
  return <main className={s.page} id="main">
    <section className={s.hero}><div className={s.wrap}>
      <Link href="/products/top10" className={s.back}>← Top 10 commercial products</Link>
      <div className={s.eyebrow}>Harnesses · verification as a product</div>
      <h1>We test whether an AI system actually works.</h1>
      <p className={s.promise}>Before you ship an agent, accept a vendor’s AI, or let a release touch production, a harness engagement answers one question with reproducible evidence: does it still do only what it is supposed to do? You get one decision and a signed receipt, not a demo and a promise.</p>
      <div className={s.heroGrid}>
        <div><span className={s.label}>Who it is for</span><strong>Teams shipping AI agents into real workflows, and the people who have to accept them.</strong></div>
        <div><span className={s.label}>What you get</span><strong>A baseline, a case set, the delta and regressions, permission and evidence checks, one decision, a signed receipt.</strong></div>
        <div><span className={s.label}>Starting offer</span><strong className={s.price}>$2,500 pilot</strong><small className={s.disclaimer} style={{ marginTop: 6 }}>One workflow · test commercial pricing · quoted by email</small></div>
      </div>
      <div className={s.ctaPair} style={{ marginTop: 22 }}>
        <Link className={s.ctaButton} href="/contact?product=agent-integrity" data-testid="harness-cta">Request a harness pilot →</Link>
        <Link className={s.ctaSecondary} href="/products/top10/agent-integrity">Agent Integrity Suite product page</Link>
      </div>
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>01</span><h2>What happens, in order</h2></div>
      <p className={s.lede}>Every engagement runs these thirteen stages in this order. Nothing is skipped; a stage that cannot run is recorded as blocked.</p>
      <div className={s.evidence} data-testid="harness-sequence">{HARNESS_STAGES.map((stage, i) => <div className={s.evidenceItem} key={stage}><span className={s.rank}>{String(i + 1).padStart(2, '0')}</span><p><b>{stage}</b> — {STAGE_MEANING[stage]}</p></div>)}</div>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>02</span><h2>See it run in your browser</h2></div>
      <p className={s.lede}>Load the sample pair, press run, and watch the thirteen stages. The sample candidate drops the evidence the baseline had, so the demonstration ends in a REJECT with the regression named. The checks are structural, the digest is unsigned, and nothing touches a production system.</p>
      <ProductDemo mode="harness" />
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>03</span><h2>The harnesses behind the product</h2></div>
      <p className={s.lede}>Neuruh runs these on its own systems. A pilot applies the relevant ones to your workflow. None is a self-serve tool today.</p>
      <div className={s.columns}>{SUITE.map(([name, desc, status, lineage]) => <article className={s.card} key={name} data-status={status}><span className={s.label}>{status}</span><b>{name}</b><p>{desc}</p><small className={s.rank}>{lineage}</small></article>)}</div>
      <p className={s.disclaimer}>Status meanings. USED ON NEURUH RELEASES: gates this site or a production system today. INTERNAL · COURTED: exists with its own tests and receipts, runs inside Neuruh only. RESEARCH: exists, not part of a release gate. PROPOSED: not built. None of these harnesses is externally callable; a pilot is run by a founder against your workflow. Repository names refer to private repositories.</p>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.split}>
        <div><div className={s.sectionHead}><span>04</span><h2>What you buy</h2></div><ul><li>One workflow mapped to explicit permissions and expected outcomes.</li><li>Golden, held-out, and adversarial cases written against it.</li><li>A baseline capture and a candidate run under the same conditions.</li><li>Delta, regressions, permission and evidence checks in one report.</li><li>A decision and a signed receipt naming the exact tested version.</li><li>Optional re-runs on each release, quoted.</li></ul></div>
        <div><div className={s.sectionHead}><span>05</span><h2>How you use it</h2></div><ul><li>Bring the agent, workflow, or release candidate and the person who decides.</li><li>Agree the allowed actions and the evidence boundary in writing.</li><li>Neuruh captures the baseline and writes the cases; you review them.</li><li>The run produces the report and the decision.</li><li>Repair, rerun, and seal, or reject and stop.</li></ul></div>
      </div>
      <div className={s.cta}>
        <h2>Evidence that this is how Neuruh already works</h2>
        <p>This site’s own release court records 0 broken links and 0 serious or critical accessibility violations at the shipped version. The DeedSonar production court of 2026-08-23 recorded 1,510 tests green at the version production attested that day. Both are dated and compiled on <Link href="/proof">/proof</Link>. Client engagements are not published; what Neuruh does not claim is listed on <Link href="/refusals">/refusals</Link>.</p>
        <div className={s.ctaPair}>
          <Link className={s.ctaButton} href="/contact?product=agent-integrity">Request a harness pilot →</Link>
          <Link className={s.ctaSecondary} href="/products/top10/ai-estate-forensic">Or start with an estate audit</Link>
        </div>
      </div>
    </div></section>
  </main>
}
