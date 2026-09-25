'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { calHref } from '../lib/attribution'
import { PUBLIC_CALLS } from '../lib/publicOffers'
import { PRICE_STATUS_LABEL, getTop10, type Top10Product } from '../lib/top10'

const FREE_CALL = PUBLIC_CALLS.find((call) => call.id === 'call-10')!

/**
 * Reads ?product=<slug> on /contact and carries the selection into the founder mailto.
 * Static export: no server, no form handler, no CRM. The email is the intake.
 * A /solve handoff arrives in the URL fragment (#target=…&kind=…), which the browser never sends to the server.
 */
export function ProductInquiry() {
  const [product, setProduct] = useState<Top10Product | null>(null)
  const [unknown, setUnknown] = useState<string | null>(null)
  const [target, setTarget] = useState<string | null>(null)
  const [kind, setKind] = useState<string | null>(null)

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const text = hash.get('target')
    if (text === null) return
    setTarget(text.slice(0, 1500))
    setKind(hash.get('kind')?.slice(0, 32) ?? null)
  }, [])

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('product')
    if (!slug) return
    const found = getTop10(slug) ?? null
    setProduct(found)
    setUnknown(found ? null : slug.slice(0, 64))
  }, [])

  if (unknown) {
    return (
      <section className="semantic-section" aria-labelledby="product-inquiry" data-testid="product-inquiry-unknown">
        <h2 id="product-inquiry">That product reference is not one we sell</h2>
        <p className="t-lede">The link you followed named a product this site does not list. Nothing was sent. Pick one of the ten below, or write to the founder directly.</p>
        <p><Link className="n-btn n-btn--secondary" href="/products/top10">See the Top 10 products</Link></p>
      </section>
    )
  }
  if (target !== null) {
    const trimmed = target.trim()
    const subject = encodeURIComponent(`Solve intake: ${trimmed.replace(/\s+/g, ' ').slice(0, 60) || 'new target'}`)
    const body = encodeURIComponent(`${trimmed}${kind ? `\n\nTarget kind: ${kind}` : ''}\n\nWhat a good outcome looks like:\n\n`)
    const book = `${calHref(FREE_CALL.slug, 'contact-solve-intake')}&notes=${encodeURIComponent(trimmed.slice(0, 500))}`
    return (
      <section className="semantic-section" aria-labelledby="solve-intake" data-testid="solve-intake">
        <h2 id="solve-intake">Your target{kind ? ` (${kind.toLowerCase()})` : ''}</h2>
        <p className="t-lede">Carried over from /solve. Edit it if you like, then send it or bring it to a free {FREE_CALL.length} call. Nothing has been sent yet.</p>
        <label className="n-label" htmlFor="solve-intake-text">What should Neuruh investigate?</label>
        <textarea
          id="solve-intake-text"
          rows={4}
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          style={{ width: '100%', minHeight: 110, font: 'inherit', padding: 12, borderRadius: 8, border: '1px solid var(--v2-line-2)', background: 'var(--v2-surf-1)', color: 'var(--v2-text)' }}
          data-testid="solve-intake-text"
        />
        <p className="contact-address">
          <a className="n-btn n-btn--primary" href={`mailto:jeramie@neuruh.com?subject=${subject}&body=${body}`} data-testid="solve-intake-mailto">Email this to the founder</a>{' '}
          <a className="n-btn n-btn--secondary" href={book} rel="noopener noreferrer" data-testid="solve-intake-book">Book the free call with it attached</a>
        </p>
        <p className="claim-boundary">The email opens in your own mail app; the booking link passes the text to Cal.com as a note. Neither happens until you click.</p>
      </section>
    )
  }
  if (!product) return null
  const subject = encodeURIComponent(`${product.name} — ${product.price}`)
  const body = encodeURIComponent(
    `Product: ${product.name} (${product.price})\n\nWhat I can provide:\n${product.inputs.map((x) => `- ${x}`).join('\n')}\n\nMy situation:\n\n`,
  )
  return (
    <section className="semantic-section" aria-labelledby="product-inquiry" data-testid="product-inquiry">
      <h2 id="product-inquiry">You are asking about {product.name}</h2>
      <p className="t-lede">
        {product.price} · {PRICE_STATUS_LABEL[product.priceStatus]}. Send the inputs below and a founder replies with scope
        {product.priceStatus === 'LIVE_CASHIER' ? ' — or check out directly from the product page.' : ' and a written quote before any work starts.'}
      </p>
      <ul>{product.inputs.map((x) => <li key={x}>{x}</li>)}</ul>
      <p className="contact-address">
        <a className="n-btn n-btn--primary" href={`mailto:jeramie@neuruh.com?subject=${subject}&body=${body}`} data-testid="product-inquiry-mailto">Email about {product.name}</a>
      </p>
      <p className="claim-boundary">
        <Link className="text-link" href={`/products/top10/${product.slug}`}>Back to the product page</Link>. Intake is by email; there is no form, no autoresponder, and no automated delivery.
      </p>
    </section>
  )
}
