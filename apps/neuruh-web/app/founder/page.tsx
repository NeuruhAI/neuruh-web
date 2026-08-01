import { getPublicObject } from '../../../../packages/public-truth/client'
import { SemanticPage } from '../../components/SemanticPage'

export default function FounderPage() {
  const object = getPublicObject('founder-architecture')!
  return (
    <SemanticPage eyebrow="Founder architecture" title="The pieces were never the problem. Coherence was." intro="The work crossed products, agents, frameworks, documents, repositories, terminals, and changing tools. The durable answer was not one larger app; it was an organization capable of showing its own state." objects={[object]}>
      <blockquote className="founder-close">Depth is earned, not applied.</blockquote>
      <p className="boundary-note">This is not a completion claim. Honest incompleteness—blocked, degraded, planned, and unknown—remains part of the architecture.</p>
    </SemanticPage>
  )
}

