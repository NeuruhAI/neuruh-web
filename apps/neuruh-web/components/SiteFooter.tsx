import Link from 'next/link'

const columns: ReadonlyArray<readonly [string, ReadonlyArray<readonly [string, string]>]> = [
  ['System', [
    ['Organism', '/organism'],
    ['Galaxy', '/galaxy'],
    ['Worlds', '/worlds'],
    ['How it works', '/how-it-works'],
    ['Research', '/research/adaptive-intelligence'],
  ]],
  ['Company', [
    ['Offers', '/offers'],
    ['Ask Neuruh', '/ask'],
    ['Work with Neuruh', '/work-with-neuruh'],
    ['Products', '/products'],
    ['Founder', '/founder'],
    ['Contact', '/contact'],
    ['Legal', '/legal'],
  ]],
  ['Truth', [
    ['Proof', '/proof'],
    ['Cases', '/cases'],
    ['Boundaries', '/refusals'],
    ['Open source', '/open-source'],
    ['Accessible route', '/accessible'],
  ]],
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <p className="wordmark">Neuruh</p>
          <p className="site-footer__line">Governed AI systems that leave receipts.</p>
          <p className="site-footer__line">
            <Link href="/security">neuruh.com/security</Link>
            {' · '}
            <a href="https://github.com/NeuruhAI" rel="noopener noreferrer">github.com/NeuruhAI</a>
          </p>
        </div>
        {columns.map(([heading, items]) => (
          <nav key={heading} aria-label={`${heading} links`}>
            <p className="n-label">{heading}</p>
            <ul>
              {items.map(([label, href]) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="site-footer__meta">
        <p>© 2026 Neuruh. Built and operated by its founder.</p>
        <p>Every figure on this site is dated and sourced on <Link href="/proof">the proof ledger</Link>. Nothing here is a live feed.</p>
      </div>
    </footer>
  )
}
