import { notFound } from 'next/navigation'
import { getPublicObject, getRelationshipsFor, getPublicObjects, WORLD_IDS } from '../../../../../packages/public-truth/client'
import { ContradictionObject, RelationshipList } from '../../../components/TruthPrimitives'
import { SemanticPage } from '../../../components/SemanticPage'

export function generateStaticParams() {
  return WORLD_IDS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const world = getPublicObject(slug)
  if (!world) return {}
  return { title: world.name, description: world.summary }
}

export default async function WorldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!WORLD_IDS.includes(slug as (typeof WORLD_IDS)[number])) notFound()
  const world = getPublicObject(slug)
  if (!world) notFound()
  const names = new Map(getPublicObjects().map((object) => [object.id, object.name]))
  return (
    <SemanticPage eyebrow={`World · ${world.claim_class.replaceAll('_', ' ')}`} title={world.name} intro={world.summary} objects={[world]}>
      {world.contradictions?.map((contradiction) => <ContradictionObject key={contradiction.id} contradiction={contradiction} />)}
      <section className="semantic-section">
        <h2>Sourced relationships</h2>
        <RelationshipList relationships={getRelationshipsFor(world.id)} names={names} />
      </section>
    </SemanticPage>
  )
}

