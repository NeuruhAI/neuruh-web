import type { Metadata } from 'next'
import { getPublicObject } from '../../../../packages/public-truth/client'
import { AccessibleGalaxy } from '../../components/AccessibleGalaxy'
import { ContradictionObject, LastVerified, TruthModeBadge } from '../../components/TruthPrimitives'
import { GalaxyImmersive } from '../../components/GalaxyImmersive'

export const metadata: Metadata = {
  alternates: { canonical: '/galaxy' },
  title: 'Galaxy',
  description: 'The portfolio self-model: products, organs, evidence, dependencies, state, and decision boundaries — with its one unresolved contradiction preserved in view.',
}

export default function GalaxyPage() {
  const galaxy = getPublicObject('galaxy')!
  return (
    <main className="semantic-page" id="main">
      <GalaxyImmersive />
      <header className="semantic-hero">
        <p className="n-label">Cockpit / Galaxy</p>
        <h1>Everything that exists, and how it relates.</h1>
        <p className="t-lede">The live system map of Neuruh — products, organs, evidence, and decision boundaries — including the one relationship it refuses to overstate.</p>
        <TruthModeBadge mode={galaxy.truth_mode} />
        <LastVerified at={galaxy.last_verified_at} />
      </header>
      {galaxy.contradictions?.map((contradiction) => <ContradictionObject key={contradiction.id} contradiction={contradiction} />)}
      <AccessibleGalaxy />
    </main>
  )
}

