import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">404 · Nothing lives at this address</p>
        <h1>There is no page here, and we would rather say so than guess.</h1>
        <p className="t-lede">
          The address may be mistyped or the page may have moved. Nothing was sent or charged. The products, offers,
          and proof are one click away.
        </p>
      </header>
      <section className="semantic-section">
        <div className="row">
          <Link className="n-btn n-btn--primary" href="/products/top10">Top 10 products</Link>
          <Link className="n-btn n-btn--secondary" href="/offers">See offers</Link>
          <Link className="n-btn n-btn--ghost" href="/">Home</Link>
          <Link className="n-btn n-btn--ghost" href="/proof">Inspect proof</Link>
        </div>
      </section>
    </main>
  )
}
