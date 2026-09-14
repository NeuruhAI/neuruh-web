import Link from 'next/link'
import { TOP10 } from '../../../features/top10/Top10Data'
import s from '../../../features/top10/Top10Product.module.css'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/products/top10',
  title: 'Neuruh Top 10 Commercial Products',
  description: 'Ten high-value Neuruh product surfaces selected from the existing estate: harness assurance, AI estate recovery, real-estate intelligence, business acquisition, data rescue, workflow replacement, ProofOS, managed intelligence, and resale.',
})

export default function Top10Index() {
  return <main className={s.page} id="main">
    <section className={s.hero}><div className={s.wrap}>
      <Link href="/products" className={s.back}>← Neuruh products</Link>
      <div className={s.eyebrow}>COMMERCIALIZATION COURT · TOP 10</div>
      <h1>Existing Neuruh capability turned into things someone can buy.</h1>
      <p className={s.promise}>Each surface has a buyer, promise, workflow, delivery object, evidence boundary, interactive demo, and explicit next commercial rung. No new universe is required.</p>
      <div className={s.heroGrid}>
        <div><span className={s.label}>PRIMARY WEDGE</span><strong>Agent Integrity + AI Estate Forensic</strong></div>
        <div><span className={s.label}>FASTEST MONEY</span><strong>Property Scan → Dossier → Managed Desk</strong></div>
        <div><span className={s.label}>CORE RULE</span><strong>Sell an outcome. Capture the proof. Reuse the substrate.</strong></div>
      </div>
    </div></section>
    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>10</span><h2>Product surfaces</h2></div>
      <div className={s.catalog}>{TOP10.map((p) => <Link className={s.catalogItem} href={`/products/top10/${p.slug}`} key={p.slug}>
        <span className={s.rank}>{String(p.rank).padStart(2, '0')}</span><div><span className={s.eyebrow}>{p.eyebrow}</span><h3>{p.name}</h3><p>{p.promise}</p></div><span className={s.arrow}>→</span>
      </Link>)}</div>
    </div></section>
    <section className={s.sectionAlt}><div className={s.wrap}><div className={s.cta}><h2>Start with the product that closes the feedback loop.</h2><p>Agent Integrity creates a reusable customer assurance substrate. Real-estate products create immediate proof and revenue. The other surfaces harvest the same evidence, orchestration, and receipt machinery.</p><Link className={s.ctaButton} href="/products/top10/agent-integrity">Open #1 →</Link></div></div></section>
  </main>
}
