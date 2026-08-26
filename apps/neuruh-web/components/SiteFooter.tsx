import Link from 'next/link'
import { getTruthSummary } from '../../../packages/public-truth/client'

const columns: ReadonlyArray<readonly [string, ReadonlyArray<readonly [string, string]>]> = [
  ['System', [
    ['Organism', '/organism'],
    ['Galaxy', '/galaxy'],
    ['Worlds', '/worlds'],
    ['How it works', '/how-it-works'],
    ['Research', '/research/adaptive-intelligence'],
  ]],
  ['Company', [
    ['Products', '/products'],
    ['Founder', '/founder'],
    ['Contact', '/contact'],
    ['Legal', '/legal'],
  ]],
  ['Truth', [
    ['Proof', '/proof'],
    ['Boundaries', '/refusals'],
    ['Open source', '/open-source'],
    ['Accessible route', '/accessible'],
  ]],
]

export function SiteFooter() {
  const truth = getTruthSummary()
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <p className="wordmark">Neuruh</p>
          <p className="site-footer__line">Governed AI systems that leave receipts.</p>
          <p className="site-footer__line">
            <a href="mailto:jeramie@neuruh.com">jeramie@neuruh.com</a>
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
        <p>
          Truth mode {truth.truthMode.replaceAll('_', ' ')} · snapshot verified{' '}
          <time dateTime={truth.lastVerifiedAt}>{truth.lastVerifiedAt.slice(0, 10)}</time> · live connectivity NONE
        </p>
      </div>
    </footer>
  )
}
