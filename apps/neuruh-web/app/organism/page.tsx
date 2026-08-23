import type { Metadata } from 'next'
import { getPublicObjects, getPublicSnapshot } from '../../../../packages/public-truth/client'
import { RelationshipList } from '../../components/TruthPrimitives'
import { SemanticPage } from '../../components/SemanticPage'

export const metadata: Metadata = {
  title: 'Organism',
  description: 'Specialized organs under shared law: memory, evidence, governance, execution, and receipt relationships across the Neuruh system.',
}

export default function OrganismPage() {
  const snapshot = getPublicSnapshot()
  const objects = getPublicObjects().filter((object) => object.kind === 'organ' || object.id === 'neuruh')
  const names = new Map(getPublicObjects().map((object) => [object.id, object.name]))
  return (
    <SemanticPage eyebrow="Organism" title="Specialized organs. Shared law." intro="Neuruh coordinates independent systems through explicit memory, evidence, governance, execution, and receipt relationships." objects={objects}>
      <section className="semantic-section">
        <h2>Functional relationship ledger</h2>
        <RelationshipList relationships={snapshot.relationships.filter((relationship) => objects.some((object) => object.id === relationship.source_id || object.id === relationship.target_id))} names={names} />
      </section>
    </SemanticPage>
  )
}

