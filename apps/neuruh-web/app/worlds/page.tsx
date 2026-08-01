import Link from 'next/link'
import { getPublicObjects } from '../../../../packages/public-truth/client'
import { EvidenceDisclosure, TruthModeBadge } from '../../components/TruthPrimitives'

export default function WorldsPage() {
  const worlds = getPublicObjects('world')
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">World Emitter</p>
        <h1>Different promises. One evidence and governance law.</h1>
        <p className="t-lede">These are bounded commercial worlds, not an interchangeable product-card portfolio.</p>
      </header>
      <div className="world-stream">
        {worlds.map((world, index) => (
          <article key={world.id} data-world={world.id} className={`world-entry world-entry--${index % 3}`}>
            <div><p className="n-label">{world.claim_class.replaceAll('_', ' ')}</p><TruthModeBadge mode={world.truth_mode} /></div>
            <h2>{world.name}</h2>
            <p>{world.summary}</p>
            <EvidenceDisclosure object={world} />
            <Link className="text-link" href={world.public_route}>Enter {world.name} →</Link>
          </article>
        ))}
      </div>
    </main>
  )
}

