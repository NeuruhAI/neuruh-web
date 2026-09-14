'use client'

import Link from 'next/link'

/**
 * Route-level error boundary. Static export: this only renders if a client component throws.
 * No stack, no internals: a plain statement, a retry, and the two useful exits.
 */
export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">Something on this page failed to render</p>
        <h1>This page hit an error. Nothing was sent or charged.</h1>
        <p className="t-lede">
          The rest of the site is unaffected. You can retry this page, go back to the products, or email the founder
          and mention the page you were on.
        </p>
      </header>
      <section className="semantic-section">
        <div className="row">
          <button type="button" className="n-btn n-btn--primary" onClick={() => reset()}>Try again</button>
          <Link className="n-btn n-btn--secondary" href="/products/top10">Top 10 products</Link>
          <Link className="n-btn n-btn--ghost" href="/contact">Contact</Link>
        </div>
      </section>
    </main>
  )
}
