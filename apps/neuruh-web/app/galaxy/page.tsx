import { getPublicObject } from '../../../../packages/public-truth/client'
import { AccessibleGalaxy } from '../../components/AccessibleGalaxy'
import { ContradictionObject, LastVerified, TruthModeBadge } from '../../components/TruthPrimitives'

export default function GalaxyPage() {
  const galaxy = getPublicObject('galaxy')!
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">Cockpit / Galaxy</p>
        <h1>The portfolio can show what it knows—and what it cannot prove.</h1>
        <p className="t-lede">A manifest-defined operating view of products, organs, evidence, dependencies, state, and decision boundaries.</p>
        <TruthModeBadge mode={galaxy.truth_mode} />
        <LastVerified at={galaxy.last_verified_at} />
      </header>
      {galaxy.contradictions?.map((contradiction) => <ContradictionObject key={contradiction.id} contradiction={contradiction} />)}
      <AccessibleGalaxy />
    </main>
  )
}

