'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PRICE_STATUS_LABEL, getTop10, type Top10Product } from '../lib/top10'

/**
 * Reads ?product=<slug> on /contact and carries the selection into the founder mailto.
 * Static export: no server, no form handler, no CRM. The email is the intake.
 */
export function ProductInquiry() {
  const [product, setProduct] = useState<Top10Product | null>(null)
  const [unknown, setUnknown] = useState<string | null>(null)

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
        <Link className="text-link" href={`/products/top10/${product.slug}`}>Back to the product page</Link>. Intake is by email; there is no form, no autoresponder, and no automated fulfillment.
      </p>
    </section>
  )
}
