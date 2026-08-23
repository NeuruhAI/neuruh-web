import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">404 · No object at this route</p>
        <h1>This route resolves to nothing — and we say so.</h1>
        <p className="t-lede">
          The public truth snapshot has no object here. That is a recorded absence, not an error page pretending
          otherwise.
        </p>
      </header>
      <section className="semantic-section">
        <div className="row">
          <Link className="n-btn n-btn--primary" href="/">Back to the organism</Link>
          <Link className="n-btn n-btn--secondary" href="/products">See the products</Link>
          <Link className="n-btn n-btn--ghost" href="/proof">Inspect proof</Link>
        </div>
      </section>
    </main>
  )
}
