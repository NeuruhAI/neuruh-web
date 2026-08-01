import { getPublicObject } from '../../../../../packages/public-truth/client'
import { SemanticPage } from '../../../components/SemanticPage'

const lifecycle = ['raw', 'extracted', 'candidate', 'hypothesis', 'tested', 'canonical / rejected / superseded / quarantined']

export default function AdaptiveIntelligencePage() {
  const object = getPublicObject('adaptive-intelligence')!
  return (
    <SemanticPage eyebrow="Research · Adaptive Intelligence" title="A claim changes state only when evidence earns it." intro="Contradiction, review, promotion, quarantine, rollback, and receipts are parts of learning—not exceptions hidden from view." objects={[object]}>
      <section className="semantic-section" aria-labelledby="claim-lifecycle">
        <h2 id="claim-lifecycle">Claim lifecycle</h2>
        <ol className="claim-lifecycle">{lifecycle.map((stage) => <li key={stage}>{stage}</li>)}</ol>
        <p className="boundary-note">Emergence remains outside this guaranteed loop. A structural change requires before/after state, decision receipt, validation status, and rollback.</p>
      </section>
    </SemanticPage>
  )
}

