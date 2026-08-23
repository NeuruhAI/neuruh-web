import type { Metadata } from 'next'
import signature from '../../../../public/truth/signature.json'

export const metadata: Metadata = {
  title: 'Proof',
  description: 'The receipt bank: current snapshot, classified measurements, contradictions, checksum receipt, and the gates that remain open.',
}
import { getPublicObject, getPublicSnapshot } from '../../../../packages/public-truth/client'
import { ContradictionObject, TruthModeBadge } from '../../components/TruthPrimitives'
import { SemanticPage } from '../../components/SemanticPage'

export default function ProofPage() {
  const proof = getPublicObject('p0-foundation')!
  const census = getPublicObject('organism-census')!
  const galaxy = getPublicObject('galaxy')!
  const snapshot = getPublicSnapshot()
  return (
    <SemanticPage eyebrow="Proof boundary" title="Evidence first. Certification only where earned." intro="This route exposes the current snapshot, classified measurements, contradictions, checksum receipt, and the gates that remain open." objects={[proof, census]}>
      <section className="semantic-section proof-status" aria-labelledby="current-status">
        <h2 id="current-status">Current public truth</h2>
        <TruthModeBadge mode={snapshot.dataset.truth_mode} />
        <dl>
          <dt>Living state</dt><dd>{snapshot.living_state}</dd>
          <dt>Live connectivity</dt><dd>NONE</dd>
          <dt>Checksum kind</dt><dd>{signature.signature_kind}</dd>
          <dt>Snapshot SHA-256</dt><dd><code>{signature.snapshot_sha256}</code></dd>
        </dl>
      </section>
      <section className="semantic-section" id="sandbox-trace">
        <h2>Sandbox decision / receipt trace</h2>
        <TruthModeBadge mode="SANDBOX" />
        <p>Signal → evidence → contradiction → reversible scenario → authority refusal → sandbox receipt. No external action occurs.</p>
      </section>
      {galaxy.contradictions?.map((contradiction) => <ContradictionObject key={contradiction.id} contradiction={contradiction} />)}
      <section className="semantic-section gate-ledger">
        <h2>Gate ledger</h2>
        <p>G1_DEVICE_VALIDATION: BLOCKED_EXTERNAL_DEVICES</p>
        <p>G2_RENDERER_CERTIFICATION: NOT_CERTIFIED</p>
        <p>PUBLIC_LAUNCH: AUTHORIZED_BY_FOUNDER_CONSTITUTION_2026-08-23</p>
        <p className="claim-boundary"><strong>Claim boundary:</strong> launch authorization publishes this site; it does not close G1 or G2, and both remain disclosed above and in the snapshot itself.</p>
      </section>
    </SemanticPage>
  )
}
