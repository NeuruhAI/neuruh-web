import { getPublicObject } from '../../../../../packages/public-truth/client'
import { TruthModeBadge } from '../../../components/TruthPrimitives'
import { SemanticPage } from '../../../components/SemanticPage'
import { pageMeta } from '../../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/research/case-zero',
  title: 'Case Zero',
  description: 'Latent Cross-Domain Emergence is a hypothesis, not a conclusion. Case Zero tests temporal precedence and predictive usefulness through sealed predictions and controls.',
})

export default function CaseZeroPage() {
  const object = getPublicObject('lcde-case-zero')!
  return (
    <SemanticPage eyebrow="Research · Case Zero" title="Latent Cross-Domain Emergence is a hypothesis, not a conclusion." intro="Case Zero tests temporal precedence and predictive usefulness through blind extraction, sealed predictions, domain ablations, competing hypotheses, and controls." objects={[object]}>
      <section className="semantic-section research-protocol">
        <TruthModeBadge mode="CONCEPTUAL" />
        <h2>Ruling paths</h2>
        <ul><li>Provisional support</li><li>Narrowed support</li><li>Inconclusive</li><li>Rejected</li><li>Reframed</li></ul>
        <p className="boundary-note">No completed Case Zero result is present. This route is not empirical proof, clinical guidance, or a claim of universal law.</p>
      </section>
    </SemanticPage>
  )
}

