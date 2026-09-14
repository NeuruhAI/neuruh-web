import Link from 'next/link'
import { getPublicObject } from '../../../../packages/public-truth/client'
import { EvidenceDisclosure, MetricStrip } from '../../components/TruthPrimitives'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/products',
  title: 'Products',
  description: 'The Neuruh systems: DeedSonar in production, plus the Liquidity Engine, FindSellProfit, Bookeit, CurbClaim, ProofOS, and the Venture Factory — each with real visuals and truthful status.',
})

function ProductBlock({
  id, name, status, statusClass, line, media, alt, span = 'pc-span-6',
}: {
  id: string; name: string; status: string; statusClass: string; line: string; media?: string; alt?: string; span?: string
}) {
  const obj = getPublicObject(id)
  return (
    <article className={`prod-card ${span}`} id={id}>
      {media && <div className="pc-media"><img src={media} alt={alt ?? name} loading="lazy" style={{ height: 230 }} /></div>}
      <div className="pc-body">
        <span className={`pc-status ${statusClass}`}>{status}</span>
        <h3>{name}</h3>
        <p className="pc-line">{line}</p>
        {obj?.metrics?.length ? <MetricStrip metrics={obj.metrics} /> : null}
        {obj ? <EvidenceDisclosure object={obj} /> : null}
        {obj && obj.public_route !== '/products' ? <Link className="v2-link" href={obj.public_route}>Open the deep record →</Link> : null}
      </div>
    </article>
  )
}

export default function ProductsPage() {
  const ds = getPublicObject('deedsonar')!
  return (
    <main id="main">
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow">Products</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Real systems. Truthful status. Receipts attached.</h1>
          <p className="sec-sub">
            One product operates in production today. Five more are sealed, court-tested release candidates in private
            custody — labeled exactly as what they are.
          </p>
        </div>
      </section>

      <section className="sec sec-alt" aria-labelledby="ds-h">
        <div className="sec-inner">
          <div className="flagship">
            <div className="pframe">
              <div className="pframe-bar"><span className="dot" /><span className="name">DeedSonar · Acquisition desk</span><span className="ptag ptag-live">IN PRODUCTION</span></div>
              <img src="/media/products/deedsonar-dashboard.png" alt="DeedSonar acquisition desk: pipeline, dispositions, revenue, and due-diligence tasks (sample data)" />
            </div>
            <div>
              <span className="pc-status ptag-live">IN PRODUCTION</span>
              <h2 className="sec-h" id="ds-h" style={{ marginTop: 10 }}>DeedSonar</h2>
              <p className="sec-sub">
                Real-estate opportunity intelligence from public evidence: find it, understand why it matters, and rank
                it with the evidence attached. Outreach and deal execution stay behind a human decision and are not
                claimed here — the dated production tape below says how far the system reaches today.
              </p>
              {ds.metrics?.length ? <MetricStrip metrics={ds.metrics} /> : null}
              <div style={{ marginTop: 14 }}><EvidenceDisclosure object={ds} /></div>
              <div className="hero-ctas" style={{ marginTop: 18 }}>
                <Link className="v2-btn v2-btn-primary" href="/worlds/deedsonar">Explore DeedSonar</Link>
                <Link className="v2-btn v2-btn-ghost" href="/proof">View the proof →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" aria-label="All systems">
        <div className="sec-inner">
          <div className="prod-grid">
            <ProductBlock id="liquidity-engine" name="Neuruh Liquidity Engine" status="SYNTHETIC DEMO" statusClass="ptag-demo"
              line="Field signals become verified, underwritten liquidity options — ranked least-destructive first, through authorization to a synthetic close. In the farm scenario, equipment liquidation (+$22.5k) outranks the $555k farm sale."
              media="/media/products/liquidity-outcomes.png" alt="Neuruh Liquidity outcomes ledger; every close labeled synthetic" />
            <ProductBlock id="find-sell-profit" name="FindSellProfit" status="SEALED CANDIDATE" statusClass="ptag-demo"
              line="The autonomous merchant OS: photos, URLs, UPCs, or whole lots become evidence-backed economics, a target buy, an absolute maximum buy, and a disposition decision."
              media="/media/products/fsp-home.png" alt="FindSellProfit: know what it is worth before your money is in it" />
            <ProductBlock id="bookeit" name="Bookeit" status="SEALED CANDIDATE" statusClass="ptag-demo" span="pc-span-4"
              line="Agentic local commerce: a guest sentence becomes structured demand, qualified supply, an authorized transaction, and a receipted outcome."
              media="/media/products/bookeit-home.png" alt="Bookeit: make almost anything around a stay bookable" />
            <ProductBlock id="curbclaim" name="CurbClaim" status="SEALED CANDIDATE" statusClass="ptag-demo" span="pc-span-4"
              line="Physical-asset routing with honest, zero-crossing economics: sell, donate, scrap, haul, or dispose — the recoverable lines pay for the ones that cost."
              media="/media/products/curbclaim-jobsite.png" alt="CurbClaim job-site routing table with per-line economics" />
            <ProductBlock id="proof-os" name="ProofOS" status="SEALED CANDIDATE" statusClass="ptag-demo" span="pc-span-4"
              line="Claims become structured evidence and proof surfaces; each of its fourteen courts writes a machine-readable receipt." />
            <ProductBlock id="venture-factory" name="Autonomous Venture Factory" status="IN DEVELOPMENT" statusClass="ptag-dev" span="pc-span-6"
              line="Compiles reusable capabilities into deterministic venture plans, governed execution stages, sealed packages, and drift-checked handoffs." />
            <ProductBlock id="datum" name="DATUM" status="IN DEVELOPMENT" statusClass="ptag-dev" span="pc-span-6"
              line="Evidence-bearing valuation and decision architecture shared by the commercial worlds." />
          </div>
          <p className="sec-sub" style={{ marginTop: 26 }}>
            Statuses come from dated receipts, not ambition — <Link className="v2-link" href="/refusals">what we refuse to claim</Link> governs this page.
          </p>
        </div>
      </section>
    </main>
  )
}
