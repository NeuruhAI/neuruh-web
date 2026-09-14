import Link from 'next/link'
import { CATEGORIES, PRICE_STATUS_LABEL, TOP10, productsIn } from '../../../lib/top10'
import { PUBLIC_HARD_ZEROS } from '../../../lib/publicHardZeros'
import s from '../../../components/top10/Top10Product.module.css'
import { pageMeta } from '../../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/products/top10',
  title: 'Top 10 commercial products',
  description: 'Ten Neuruh products a buyer can act on today: what each does, who it is for, what it costs, what is real, what is demonstration, and the next step. Three have live checkout; the rest are quoted.',
})

export default function Top10Index() {
  const live = TOP10.filter((p) => p.priceStatus === 'LIVE_CASHIER').length
  return <main className={s.page} id="main">
    <section className={s.hero}><div className={s.wrap}>
      <Link href="/products" className={s.back}>← Neuruh products</Link>
      <div className={s.eyebrow}>COMMERCIAL CATALOG · TOP 10</div>
      <h1>Ten things you can buy from Neuruh, labeled by what is actually real.</h1>
      <p className={s.promise}>Each product page states the buyer, the problem, what you provide, what Neuruh does, what you receive, delivery format, turnaround, price, evidence, what is production versus demonstration, and the next action.</p>
      <div className={s.heroGrid}>
        <div><span className={s.label}>LIVE CHECKOUT TODAY</span><strong>{live} of 10 — Data Rescue $299, Opportunity Dossier $499, Workflow Sprint $1,250. Founder-fulfilled after checkout.</strong></div>
        <div><span className={s.label}>PRICED, NO CHECKOUT YET</span><strong>Property Opportunity Scan $100 — ordered by email, paid on invoice.</strong></div>
        <div><span className={s.label}>PUBLIC HARD ZEROS ({PUBLIC_HARD_ZEROS.asOf})</span><strong>Revenue {PUBLIC_HARD_ZEROS.revenue} · customers {PUBLIC_HARD_ZEROS.customers}. No product on this page claims a customer result.</strong></div>
      </div>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>10</span><h2>All ten, by category</h2></div>
      {CATEGORIES.map((category) => {
        const items = productsIn(category)
        if (!items.length) return null
        return <div className={s.category} key={category} data-testid={`top10-category`}>
          <h2>{category}</h2>
          <div className={s.catalog}>{items.map((p) => (
            <Link className={s.catalogItem} href={`/products/top10/${p.slug}`} key={p.slug} data-testid={`top10-item-${p.slug}`}>
              <span className={s.rank}>{String(p.rank).padStart(2, '0')}</span>
              <div>
                <span className={s.eyebrow}>{p.status}</span>
                <h3>{p.name}</h3>
                <p>{p.promise}</p>
                <small>{p.price} · {PRICE_STATUS_LABEL[p.priceStatus]}</small>
              </div>
              <span className={s.arrow}>→</span>
            </Link>
          ))}</div>
        </div>
      })}
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>+</span><h2>The verification capability behind the AI products</h2></div>
      <p className={s.promise}>Agent Integrity and AI Estate Forensic sell Neuruh’s harness practice: baseline, golden and held-out and adversarial cases, delta, regressions, authority and evidence checks, decision, signed receipt.</p>
      <div className={s.ctaPair}>
        <Link className={s.ctaButton} href="/harnesses">Open the harness product →</Link>
        <Link className={s.ctaSecondary} href="/offers">See the three live offers</Link>
        <Link className={s.ctaSecondary} href="/proof">Inspect the evidence</Link>
      </div>
      <p className={s.disclaimer}>Prices marked test pricing are Neuruh’s positioning decisions, not market-verified rates. A live cashier is not automated fulfillment. Browser demonstrations on product pages are labeled and are not production results.</p>
    </div></section>
  </main>
}
