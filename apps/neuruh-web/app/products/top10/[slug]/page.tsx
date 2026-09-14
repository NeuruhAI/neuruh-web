import Link from 'next/link'
import { TOP10 } from '../../../../features/top10/Top10Data'
import { ProductDemo } from '../../../../features/top10/ProductDemo'
import s from '../../../../features/top10/Top10Product.module.css'
import { pageMeta } from '../../../lib/publicSeo'

export const dynamicParams = false

export function generateStaticParams() {
  return TOP10.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = TOP10.find((item) => item.slug === slug)
  return pageMeta({
    path: `/products/top10/${slug}`,
    title: product?.name ?? 'Neuruh product',
    description: product?.promise ?? 'A Neuruh commercial product with a working interactive surface, execution plan, and evidence boundary.',
  })
}

export default async function Top10ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = TOP10.find((item) => item.slug === slug)
  if (!p) return null
  return <main className={s.page} id="main">
    <header className={s.hero}>
      <div className={s.wrap}>
        <Link href="/products/top10" className={s.back}>← All 10 products</Link>
        <div className={s.eyebrow}>{String(p.rank).padStart(2, '0')} · {p.eyebrow}</div>
        <div className={s.badge}>{p.status}</div>
        <h1>{p.name}</h1>
        <p className={s.promise}>{p.promise}</p>
        <div className={s.heroGrid}>
          <div><span className={s.label}>BUYER</span><strong>{p.audience}</strong></div>
          <div><span className={s.label}>COMMERCIAL MODEL</span><strong>{p.price}</strong></div>
          <div><span className={s.label}>NEXT COMMERCIAL MOVE</span><strong>{p.nextStep}</strong></div>
        </div>
      </div>
    </header>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>01</span><h2>What it does</h2></div>
      <div className={s.columns}>{p.whatItDoes.map((x) => <div className={s.card} key={x}><b>{x}</b><p>Bounded, evidence-backed capability. No magic claims.</p></div>)}</div>
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>02</span><h2>How the product works</h2></div>
      <div className={s.timeline}>{p.workflow.map((x, i) => <div className={s.step} key={x}><span>{String(i + 1).padStart(2, '0')}</span><b>{x}</b></div>)}</div>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>03</span><h2>Working surface</h2></div>
      <ProductDemo mode={p.mode} />
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.split}>
        <div><div className={s.sectionHead}><span>04</span><h2>Customer receives</h2></div><ul>{p.deliverables.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><div className={s.sectionHead}><span>05</span><h2>Use cases</h2></div><ul>{p.useCases.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>06</span><h2>Evidence and build lineage</h2></div>
      <div className={s.evidence}>{p.proof.map((x) => <div className={s.evidenceItem} key={x}><span className={s.dot} /><p>{x}</p></div>)}</div>
      <div className={s.cta}><h2>Execute the next rung</h2><p>{p.nextStep}</p><Link href={`/contact?product=${p.slug}`} className={s.ctaButton}>Request this product →</Link></div>
      <p className={s.disclaimer}>Status labels distinguish current commercial wedges, productized services, sealed candidates, and proposed pricing. Interactive calculations on this page are demonstrations, not production underwriting or assurance results.</p>
    </div></section>
  </main>
}
