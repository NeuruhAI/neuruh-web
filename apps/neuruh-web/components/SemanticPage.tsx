import Link from 'next/link'
import type { PublicObject } from '../../../packages/public-truth/types'
import { EvidenceDisclosure, LastVerified, TruthModeBadge } from './TruthPrimitives'

export function SemanticPage({ eyebrow, title, intro, objects, children }: {
  eyebrow: string
  title: string
  intro: string
  objects?: PublicObject[]
  children?: React.ReactNode
}) {
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="t-lede">{intro}</p>
      </header>
      {children}
      {objects?.length ? (
        <div className="object-ledger">
          {objects.map((object) => (
            <article key={object.id} id={object.id} className="truth-object" data-kind={object.kind}>
              <div className="truth-object__head">
                <p className="n-label">{object.kind} · {object.claim_class.replaceAll('_', ' ')}</p>
                <TruthModeBadge mode={object.truth_mode} />
              </div>
              <h2>{object.name}</h2>
              <p>{object.summary}</p>
              <dl className="fact-row">
                <div><dt>State</dt><dd>{object.status}</dd></div>
                <div><dt>Maturity</dt><dd>{object.maturity}</dd></div>
                <div><dt>Evidence</dt><dd>{object.evidence_summary.status}</dd></div>
              </dl>
              <LastVerified at={object.last_verified_at} />
              <EvidenceDisclosure object={object} />
              {object.public_route !== '/' && <Link className="text-link" href={object.public_route}>Open public route →</Link>}
            </article>
          ))}
        </div>
      ) : null}
    </main>
  )
}

