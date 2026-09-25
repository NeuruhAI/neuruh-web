import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRICE_STATUS_LABEL, TOP10, contactHref, getTop10 } from '../../../../lib/top10'
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
    description: product?.outcome ?? 'A Neuruh commercial product with a truthful status, evidence, and a next action.',
  })
}

export default async function Top10ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getTop10(slug)
  if (!p) notFound()
  const cashier = p.offerId ? OFFER_BY_ID[p.offerId] : null
  const cta = cashier ? { href: cashier.href, external: true, label: p.ctaLabel } : { href: contactHref(p), external: false, label: p.ctaLabel }
  const related = getTop10(p.related.slug)
  const buyStep = cashier
    ? `Pay ${cashier.price} on the hosted Stripe checkout. Your receipt arrives from Stripe.`
    : p.priceStatus === 'FOUNDER_SET_NO_CASHIER'
      ? `Email your order. You get a scope confirmation and a ${p.price.split(' ')[0]} invoice before any work starts.`
      : 'Email your request. You get a written scope and quote before any work starts.'
  const Cta = ({ testId }: { testId?: string }) => cta.external
    ? <a className={s.ctaButton} href={cta.href} rel="noopener noreferrer" data-testid={testId}>{cta.label} →</a>
    : <Link className={s.ctaButton} href={cta.href} data-testid={testId}>{cta.label} →</Link>

  return <main className={s.page} id="main" data-product={p.slug}>
    {/* 1 title · 2 outcome · 3 buyer · 10 price · 11 turnaround · 12 status · 13 CTA */}
    <header className={s.hero}>
      <div className={s.wrap}>
        <Link href="/products/top10" className={s.back}>← All ten products</Link>
        <div className={s.eyebrow}>{String(p.rank).padStart(2, '0')} · {p.category}</div>
        <h1>{p.name}</h1>
        <p className={s.promise}>{p.outcome}</p>
        <div className={s.heroGet} data-testid="product-get">
          <span className={s.label}>What you get</span>
          <ul>{p.deliverables.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className={s.disclaimer}>{cashier ? 'Founder-operated delivery by email. After checkout the founder writes to your checkout address to collect the inputs.' : 'Founder-operated delivery by email. You get a written scope before any work starts.'}</p>
        </div>
        <div className={s.heroGrid}>
          <div><span className={s.label}>Who it is for</span><strong>{p.audience}</strong></div>
          <div><span className={s.label}>What it costs</span><strong className={s.price} data-testid="product-price">{p.price}</strong><small className={s.disclaimer} style={{ marginTop: 6 }}>{PRICE_STATUS_LABEL[p.priceStatus]}</small></div>
          <div><span className={s.label}>Turnaround</span><strong>{p.turnaround}</strong></div>
        </div>
        <div className={s.ctaPair} style={{ marginTop: 22 }}>
          <Cta testId="product-cta" />
          {p.mode === 'harness' && <Link className={s.ctaSecondary} href="/harnesses">How the harness works</Link>}
          {cashier && <Link className={s.ctaSecondary} href="/offers">See it on the offers page</Link>}
        </div>
      </div>
    </header>

    {/* journey */}
    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>→</span><h2>How buying this works</h2></div>
      <ol className={s.journey} data-testid="buyer-journey">
        <li><span>1 · {cashier ? 'BUY' : 'REQUEST'}</span><b>{buyStep}</b></li>
        <li><span>2 · PROVIDE</span><b>{p.inputs[0]}</b></li>
        <li><span>3 · WE ANALYZE</span><b>{p.workflow.slice(1, -1).join(' → ')}</b></li>
        <li><span>4 · RECEIVE</span><b>{p.deliverables[0]} and the rest of the deliverable by email.</b></li>
      </ol>
      <p className={s.disclaimer}>{cashier ? 'This site has no payment webhook: a founder emails your checkout address to collect the inputs, then delivers by email.' : 'There is no checkout for this product. Intake is by email and payment is collected from you by invoice once the work is scoped.'}</p>
    </div></section>

    {/* 4 problem · 5 what happens */}
    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>01</span><h2>The problem it solves</h2></div>
      <p className={s.lede}>{p.problem}</p>
      <div className={s.sectionHead} style={{ marginTop: 28 }}><span>02</span><h2>What happens</h2></div>
      <div className={s.timeline}>{p.workflow.map((x, i) => <div className={s.step} key={x}><span>{String(i + 1).padStart(2, '0')}</span><b>{x}</b></div>)}</div>
    </div></section>

    {/* 6 provide · 7 receive */}
    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.split}>
        <div><div className={s.sectionHead}><span>03</span><h2>What you provide</h2></div><ul>{p.inputs.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><div className={s.sectionHead}><span>04</span><h2>What you receive</h2></div><ul>{p.deliverables.map((x) => <li key={x}>{x}</li>)}</ul><p className={s.disclaimer}><b>Delivery format.</b> {p.delivery}</p></div>
      </div>
    </div></section>

    {/* 8 example + use cases */}
    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>05</span><h2>What an engagement looks like</h2></div>
      <div className={s.example} data-testid="product-example">
        <p>{p.example}</p>
        <small>Illustrative scenario written to show the shape of the work. It is not a customer result; no customer has bought this product yet.</small>
      </div>
      <ul className={s.chips} aria-label="Typical use cases">{p.useCases.map((x) => <li key={x}>{x}</li>)}</ul>
    </div></section>

    {/* 9 proof · 12 truth boundary */}
    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.sectionHead}><span>06</span><h2>Why you can trust it</h2></div>
      <div className={s.realDemo}>
        <div data-testid="product-real"><h3>Real today</h3><ul>{p.real.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div data-testid="product-demo-note"><h3>Demonstration only</h3><p>{p.demo}</p></div>
      </div>
      <div className={s.evidence} style={{ marginTop: 14 }}>{p.proof.map((x) => <div className={s.evidenceItem} key={x}><span className={s.dot} /><p>{x}</p></div>)}</div>
      <p className={s.disclaimer}>Every receipt cited here is dated and vendored in the public repository or compiled on <Link href="/proof">/proof</Link>. What Neuruh does not claim — client results, engagement figures, outreach — is listed on <Link href="/refusals">/refusals</Link>.</p>
    </div></section>

    {/* demonstration */}
    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHead}><span>07</span><h2>Try the idea in your browser</h2></div>
      <p className={s.lede}>A small, inspectable illustration of the reasoning. It runs on numbers or text you type and proves nothing about production.</p>
      <ProductDemo mode={p.mode} />
    </div></section>

    {/* 13 CTA · 14 related · deep detail */}
    <section className={s.sectionAlt}><div className={s.wrap}>
      <div className={s.cta}>
        <h2>{p.nextStep}</h2>
        <p>{cashier ? `${cashier.price} on the hosted Stripe checkout. This site has no payment webhook; a founder follows up at the checkout address.` : 'No checkout exists for this product. The contact page carries your selection into the email; scope and a written quote come back before any work starts.'}</p>
        <div className={s.ctaPair}>
          <Cta />
          {related && <Link className={s.ctaSecondary} href={`/products/top10/${related.slug}`} data-testid="product-related">{related.name} →</Link>}
        </div>
        {related && <p className={s.disclaimer} style={{ marginTop: 12 }}><b>Related.</b> {p.related.why}</p>}
      </div>
      <p className={s.disclaimer}>Price labels distinguish online checkout, email orders, and quoted work. No customer results, counts, or automation are claimed. Dated build records for every product are on <Link href="/proof#commercial-ladder">/proof</Link>.</p>
    </div></section>
  </main>
}
