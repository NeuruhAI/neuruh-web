import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublicObject, getPublicObjects } from '../../../../packages/public-truth/client'
import { SemanticPage } from '../../components/SemanticPage'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'The Neuruh product portfolio: DeedSonar in production, plus receipt-sealed built candidates — Find Sell Profit, Bookeit, CurbClaim, ProofOS — and the Autonomous Venture Factory.',
}

const PORTFOLIO_ORDER = ['deedsonar', 'find-sell-profit', 'bookeit', 'curbclaim', 'proof-os'] as const

export default function ProductsPage() {
  const worlds = getPublicObjects('world')
  const portfolio = PORTFOLIO_ORDER.map((id) => worlds.find((world) => world.id === id)).filter(
    (world): world is NonNullable<typeof world> => Boolean(world),
  )
  const factory = getPublicObject('venture-factory')!
  return (
    <SemanticPage
      eyebrow="Products"
      title="One product in production. Four sealed candidates. One factory."
      intro="Every status below is backed by a dated receipt, and every card carries its own limitations. DeedSonar operates in production at app.deedsonar.com; the rest are built, court-tested candidates that have not been publicly deployed — and are labeled that way."
      objects={[...portfolio, factory]}
    >
      <section className="semantic-section" aria-labelledby="portfolio-reading">
        <h2 id="portfolio-reading">How to read this page</h2>
        <p>
          A world is a commercial product domain on the shared governed substrate. STABLE + SHIP_CANDIDATE means the
          code, tests, and courts are sealed in custody with receipts, and the product runs locally — it does not mean
          you can sign up today. Where a product uses fixture data, the product itself labels it, and so do we.
        </p>
        <p>
          <Link className="text-link" href="/refusals">
            Read what we refuse to claim →
          </Link>
        </p>
      </section>
    </SemanticPage>
  )
}
