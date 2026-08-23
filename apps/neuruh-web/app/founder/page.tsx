import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublicObject } from '../../../../packages/public-truth/client'
import { SemanticPage } from '../../components/SemanticPage'

export const metadata: Metadata = {
  title: 'Founder',
  description:
    'Jeramie Hicks, founder of Neuruh LLC: an operator who came at autonomous systems from business operations and kept asking the operator’s question — how would I know if this were wrong?',
}

export default function FounderPage() {
  const object = getPublicObject('founder-architecture')!
  return (
    <SemanticPage
      eyebrow="Founder"
      title="The pieces were never the problem. Coherence was."
      intro="The work crossed products, agents, frameworks, documents, repositories, terminals, and changing tools. The durable answer was not one larger app; it was an organization capable of showing its own state."
      objects={[object]}
    >
      <section className="semantic-section" aria-labelledby="founder-facts">
        <h2 id="founder-facts">The facts, stated plainly</h2>
        <ul>
          <li><strong>Jeramie Hicks.</strong> Benton Harbor, Michigan. Founder of Neuruh LLC.</li>
          <li>Background is business operations, not engineering — roughly two and a half decades of operating and executing in real businesses. No degree, title, or prior exit is claimed.</li>
          <li>The engineering is AI-assisted and always has been. That is a fact of the record, stated up front — not an admission extracted later.</li>
          <li>What exists: a governed agent runtime, commercial product worlds with dated court receipts, a published open-source commons, and a documented corpus of defects found in his own systems.</li>
          <li>What does not exist yet: revenue, customers, a team, outside capital, or an external security review. See <Link className="text-link" href="/refusals">/refusals</Link>.</li>
        </ul>
      </section>

      <section className="semantic-section" aria-labelledby="founder-thesis">
        <h2 id="founder-thesis">Why an operator built this</h2>
        <p>
          An operator asks a different question than an engineer. When a call returns success, the engineering
          convention is to proceed; the operator convention is to ask what the number actually means for the decision
          about to be made — and how you would know if it were wrong. Neuruh is that question turned into
          architecture: authority that must be checked, receipts that must be produced, and refusals recorded as
          carefully as actions.
        </p>
        <p>
          The strongest evidence on this site is not a capability claim. It is the list of things the system caught
          itself doing wrong — including an agent that was minting its own approvals — and the contracts that now make
          those failures structurally impossible to repeat quietly.
        </p>
      </section>

      <blockquote className="founder-close">Depth is earned, not applied.</blockquote>
      <p className="boundary-note">This is not a completion claim. Honest incompleteness—blocked, degraded, planned, and unknown—remains part of the architecture.</p>
    </SemanticPage>
  )
}
