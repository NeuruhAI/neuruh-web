import Link from 'next/link'
import { getPublicObject } from '../../../../packages/public-truth/client'
import { SemanticPage } from '../../components/SemanticPage'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/open-source',
  title: 'Open source',
  description:
    'The Neuruh public commons: governance primitives, receipts, connectors, and sovereign-agent infrastructure published under Apache-2.0 with per-repository test evidence.',
})

const COMMONS_AREAS = [
  ['Governance primitives', 'Policy gates, promotion gates, canonical-state revision contracts, and reversibility scaffolding.'],
  ['Receipts and provenance', 'Outcome records, agent run manifests, receipt schemas, and drift detection.'],
  ['Agent infrastructure', 'Sovereign-agent starters, capability registries, adapter SDKs, and event-bus layers.'],
  ['Connectors and tooling', 'Exporters, validators, deploy harnesses, and repository bootstrap tooling.'],
] as const

export default function OpenSourcePage() {
  const commons = getPublicObject('public-commons')!
  return (
    <SemanticPage
      eyebrow="Open source"
      title="The private organism runs on public rails."
      intro="The governance and receipt primitives underneath Neuruh's commercial worlds are published, tested, and Apache-2.0 licensed. What is open is the law of the system; what stays private is the commercial application of it."
      objects={[commons]}
    >
      <section className="semantic-section" aria-labelledby="commons-areas">
        <h2 id="commons-areas">What is published</h2>
        <dl className="zeros-ledger">
          {COMMONS_AREAS.map(([area, detail]) => (
            <div key={area}>
              <dt>{area}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
        <p>
          <a className="text-link" href="https://github.com/NeuruhAI" rel="noopener noreferrer">
            github.com/NeuruhAI →
          </a>
        </p>
        <p className="source-line">
          Counts on this page come from the dated 2026-08-20 commons audit, including its known blemish — one
          repository with a broken README, disclosed rather than hidden. See{' '}
          <Link className="text-link" href="/refusals">/refusals</Link> for the discipline behind that choice.
        </p>
      </section>
    </SemanticPage>
  )
}
