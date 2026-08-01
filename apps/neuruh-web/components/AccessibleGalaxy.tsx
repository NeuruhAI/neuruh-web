import { getPublicObjects, getRelationshipsFor } from '../../../packages/public-truth/client'
import { ContradictionObject, EvidenceDisclosure, RelationshipList, TruthModeBadge } from './TruthPrimitives'

export function AccessibleGalaxy() {
  const objects = getPublicObjects().filter((object) => object.kind === 'organ' || object.kind === 'world')
  const names = new Map(getPublicObjects().map((object) => [object.id, object.name]))
  const relationshipIds = new Set<string>()
  const relationships = objects.flatMap((object) => getRelationshipsFor(object.id)).filter((relationship) => {
    if (relationshipIds.has(relationship.id)) return false
    relationshipIds.add(relationship.id)
    return true
  })
  return (
    <section aria-labelledby="galaxy-ledger-title" className="galaxy-ledger">
      <h2 id="galaxy-ledger-title">Accessible 2D Galaxy</h2>
      <p>No canvas, orbit, or illustrative edge. Select a node with native keyboard controls to inspect its sourced state.</p>
      <div className="galaxy-node-list">
        {objects.map((object) => (
          <details key={object.id} className="galaxy-node">
            <summary><span>{object.name}</span><TruthModeBadge mode={object.truth_mode} /></summary>
            <p>{object.summary}</p>
            <p><strong>State:</strong> {object.status} · <strong>Evidence:</strong> {object.evidence_summary.status}</p>
            {object.contradictions?.map((contradiction) => <ContradictionObject key={contradiction.id} contradiction={contradiction} />)}
            <EvidenceDisclosure object={object} />
          </details>
        ))}
      </div>
      <h2>Relationship ledger</h2>
      <RelationshipList relationships={relationships} names={names} />
    </section>
  )
}

