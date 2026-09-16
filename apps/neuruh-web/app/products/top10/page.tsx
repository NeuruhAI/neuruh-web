import Link from 'next/link'
import { CATEGORIES, CATEGORY_BLURB, PRICE_STATUS_LABEL, TOP10, productsIn } from '../../../lib/top10'
import s from '../../../components/top10/Top10Product.module.css'
import { pageMeta } from '../../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/products/top10',
  title: 'Top 10 commercial products',
  description: 'Ten Neuruh products a buyer can act on today: what each does, who it is for, what it costs, what is real, what is demonstration, and the next step. Three have live checkout; the rest are quoted.',
})

const STATUS_SHORT: Record<string, string> = {
  LIVE_CASHIER: 'Live checkout',
  FOUNDER_SET_NO_CASHIER: 'Order by email',
  TEST_PRICING: 'Quoted',
}

export default function Top10Index() {
  const live = TOP10.filter((p) => p.priceStatus === 'LIVE_CASHIER')
  return <main className={s.page} id="main">
    <section className={s.hero}><div className={s.wrap}>
      <Link href="/products" className={s.back}>← All Neuruh products</Link>
      <div className={s.eyebrow}>Commercial catalog · ten products</div>
      <h1>Ten things you can buy from Neuruh, each labeled by what is real.</h1>
      <p className={s.promise}>Evidence-backed intelligence for property buyers, AI teams, acquirers, and operators. Every page says who it is for, what you provide, what you receive, what it costs, and what is proven versus demonstrated.</p>
      <div className={s.heroGrid}>
        <div><span className={s.label}>Live checkout today</span><strong>{live.map((p) => `${p.name} ${p.price.split(' ')[0]}`).join(' · ')}. Founder-fulfilled after checkout.</strong></div>
        <div><span className={s.label}>Priced, ordered by email</span><strong>Property Opportunity Scan $100 per parcel, invoiced once scoped. Real-estate buyers can also start on re.neuruh.com.</strong></div>
        <div><span className={s.label}>What this site does not claim</span><strong>Client names, engagement figures, and customer results are the clients’ to disclose and are not published. See <Link href="/refusals">/refusals</Link>.</strong></div>
      </div>
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>→</span><h2>How buying works</h2></div>
      <ol className={s.journey} data-testid="buyer-journey">
        <li><span>1 · BUY OR REQUEST</span><b>Three products have a hosted Stripe checkout. The rest are ordered or requested by email; you pay by invoice once the scope is confirmed.</b></li>
        <li><span>2 · PROVIDE</span><b>You send the property, files, target, or workflow named on the product page.</b></li>
        <li><span>3 · WE ANALYZE</span><b>A founder runs the existing Neuruh capability against your inputs. Nothing is automated end to end today.</b></li>
        <li><span>4 · RECEIVE</span><b>You get the deliverable by email with a machine-readable receipt naming inputs, sources, and unknowns.</b></li>
      </ol>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>10</span><h2>All ten, by who they are for</h2></div>
      {CATEGORIES.map((category) => {
        const items = productsIn(category)
        if (!items.length) return null
        return <div className={s.category} key={category} data-testid="top10-category">
          <h2>{category}</h2>
          <p>{CATEGORY_BLURB[category]}</p>
          <div className={s.catalog}>{items.map((p) => (
            <Link className={s.catalogItem} href={`/products/top10/${p.slug}`} key={p.slug} data-testid={`top10-item-${p.slug}`} aria-label={`${p.name}, ${p.price}, ${STATUS_SHORT[p.priceStatus]}`}>
              <div>
                <span className={s.eyebrow}>{String(p.rank).padStart(2, '0')} · {STATUS_SHORT[p.priceStatus]}</span>
                <h3>{p.name}</h3>
                <p>{p.outcome}</p>
                <small>{PRICE_STATUS_LABEL[p.priceStatus]}</small>
              </div>
              <span className={s.price}>{p.price.split(' · ')[0]}</span>
              <span className={s.go} aria-hidden="true">View product →</span>
            </Link>
          ))}</div>
        </div>
      })}
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.cta}>
        <h2>Need to prove an AI system actually works?</h2>
        <p>The Agent Integrity Suite and the AI Estate Forensic sell Neuruh’s verification practice: baseline, golden and held-out and adversarial cases, delta, regressions, authority and evidence checks, a decision, and a signed receipt.</p>
        <div className={s.ctaPair}>
          <Link className={s.ctaButton} href="/harnesses" data-testid="index-cta">See how the harness works →</Link>
          <Link className={s.ctaSecondary} href="/offers">The three live offers</Link>
          <Link className={s.ctaSecondary} href="/proof">Inspect the evidence</Link>
        </div>
      </div>
      <p className={s.disclaimer}>Prices marked test pricing are Neuruh’s positioning decisions, not market-verified rates. A live cashier is not automated fulfillment. Browser demonstrations on product pages are labeled and are not production results.</p>
    </div></section>
  </main>
}
