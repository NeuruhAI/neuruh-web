import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LADDER, PRICE_STATUS_LABEL, TOP10, contactHref, getTop10 } from '../../../../lib/top10'
import { OFFER_BY_ID } from '../../../../lib/publicOffers'
import { ProductDemo } from '../../../../components/top10/ProductDemo'
import s from '../../../../components/top10/Top10Product.module.css'
import { pageMeta } from '../../../../lib/publicSeo'

export const dynamicParams = false

export function generateStaticParams() {
  return TOP10.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getTop10(slug)
  return pageMeta({
    path: `/products/top10/${slug}`,
    title: product ? `${product.name} — ${product.price}` : 'Neuruh product',
    description: product?.promise ?? 'A Neuruh commercial product with a truthful status, evidence, and a next action.',
  })
}

const RUNG_LABEL: Record<string, string> = {
  PROVEN_LIVE: 'PROVEN LIVE',
  IMPLEMENTED_NOT_LIVE: 'IMPLEMENTED · NOT LIVE',
  IMPLEMENTED_INCOMPLETE: 'INCOMPLETE',
  BLOCKED: 'BLOCKED',
  HISTORICAL: 'HISTORICAL',
  UNKNOWN: 'UNKNOWN',
}

export default async function Top10ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getTop10(slug)
  if (!p) notFound()
  const cta = p.offerId ? { href: OFFER_BY_ID[p.offerId].href, external: true, label: p.ctaLabel } : { href: contactHref(p), external: false, label: p.ctaLabel }
  const next = TOP10.find((item) => item.rank === p.rank + 1)
  return <main className={s.page} id="main" data-product={p.slug}>
    <header className={s.hero}>
      <div className={s.wrap}>
        <Link href="/products/top10" className={s.back}>← All 10 products</Link>
        <div className={s.eyebrow}>{String(p.rank).padStart(2, '0')} · {p.category}</div>
        <div className={s.badge} data-testid="product-status">{p.status}</div>
        <h1>{p.name}</h1>
        <p className={s.promise}>{p.promise}</p>
        <div className={s.heroGrid}>
          <div><span className={s.label}>WHO IT IS FOR</span><strong>{p.audience}</strong></div>
          <div><span className={s.label}>WHAT IT COSTS</span><strong data-testid="product-price">{p.price}</strong><small className={s.disclaimer}>{PRICE_STATUS_LABEL[p.priceStatus]}</small></div>
          <div><span className={s.label}>NEXT ACTION</span><strong>{p.nextStep}</strong></div>
        </div>
        <div className={s.ctaPair} style={{ marginTop: 22 }}>
          {cta.external
            ? <a className={s.ctaButton} href={cta.href} rel="noopener noreferrer" data-testid="product-cta">{cta.label} →</a>
            : <Link className={s.ctaButton} href={cta.href} data-testid="product-cta">{cta.label} →</Link>}
          {p.mode === 'harness' && <Link className={s.ctaSecondary} href="/harnesses">How the harness works</Link>}
          {p.offerId && <Link className={s.ctaSecondary} href="/offers">See it on /offers</Link>}
        </div>
      </div>
    </header>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>01</span><h2>What it is and what problem it solves</h2></div>
      <dl className={s.facts}>
        <div><dt>The problem</dt><dd>{p.problem}</dd></div>
        <div><dt>What it does</dt><dd><ul style={{ margin: 0, paddingLeft: 18 }}>{p.whatItDoes.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>
      </dl>
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.split}>
        <div><div className={s.sectionHead}><span>02</span><h2>What you provide</h2></div><ul>{p.inputs.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><div className={s.sectionHead}><span>03</span><h2>What Neuruh does</h2></div><ul>{p.workflow.map((x, i) => <li key={x}><b style={{ marginRight: 10, color: '#98a2a9' }}>{String(i + 1).padStart(2, '0')}</b>{x}</li>)}</ul></div>
      </div>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.split}>
        <div><div className={s.sectionHead}><span>04</span><h2>What you receive</h2></div><ul>{p.deliverables.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div>
          <div className={s.sectionHead}><span>05</span><h2>Delivery and turnaround</h2></div>
          <dl className={s.facts} style={{ gridTemplateColumns: '1fr' }}>
            <div><dt>Delivery format</dt><dd>{p.delivery}</dd></div>
            <div><dt>Expected turnaround</dt><dd>{p.turnaround}</dd></div>
          </dl>
        </div>
      </div>
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>06</span><h2>What is real, what is demonstration</h2></div>
      <div className={s.realDemo}>
        <div data-testid="product-real"><h3>Production / real today</h3><ul>{p.real.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div data-testid="product-demo-note"><h3>Demonstration only</h3><p>{p.demo}</p></div>
      </div>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>07</span><h2>Browser demonstration</h2></div>
      <ProductDemo mode={p.mode} />
    </div></section>

    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.split}>
        <div><div className={s.sectionHead}><span>08</span><h2>Use cases</h2></div><ul>{p.useCases.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><div className={s.sectionHead}><span>09</span><h2>Evidence</h2></div><div className={s.evidence}>{p.proof.map((x) => <div className={s.evidenceItem} key={x}><span className={s.dot} /><p>{x}</p></div>)}</div><p className={s.disclaimer}>Every receipt cited here is dated and vendored in the public repository or compiled on <Link className={s.back} href="/proof">/proof</Link>. Hard zeros on <Link className={s.back} href="/refusals">/refusals</Link> apply.</p></div>
      </div>
    </div></section>

    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>10</span><h2>Where this product stands on the commercial ladder</h2></div>
      <div className={s.ladder} data-testid="product-ladder">{LADDER.map((rung) => <div className={s.rung} key={rung} data-status={p.ladder[rung]}><span>{rung}</span><b>{RUNG_LABEL[p.ladder[rung]]}</b></div>)}</div>
      <p className={s.disclaimer}>Product → Offer → Checkout or quote → Intake → Fulfillment → Delivery → Receipt → Outcome. A rung is PROVEN LIVE only when it has been exercised on the public site and courted. Fulfillment, delivery, and receipt are founder-operated and become PROVEN LIVE only with a delivered, receipted engagement.</p>
      <div className={s.cta}>
        <h2>{p.nextStep}</h2>
        <p>{p.offerId ? 'Checkout is a hosted Stripe payment link. The receipt goes to your checkout address; a founder emails within one business day to collect the inputs listed above. This site has no payment webhook.' : 'There is no checkout for this product. The contact page carries your product selection into the email; scope and a written quote come back before any work starts.'}</p>
        <div className={s.ctaPair}>
          {cta.external
            ? <a className={s.ctaButton} href={cta.href} rel="noopener noreferrer">{cta.label} →</a>
            : <Link className={s.ctaButton} href={cta.href}>{cta.label} →</Link>}
          {next && <Link className={s.ctaSecondary} href={`/products/top10/${next.slug}`}>Next: {next.name}</Link>}
        </div>
      </div>
      <p className={s.disclaimer}>Status labels distinguish live cashiers, founder-set prices without checkout, and test pricing. The browser demonstration above is labeled and is not a production underwriting or assurance result. No customer results, counts, or automation are claimed.</p>
    </div></section>
  </main>
}
