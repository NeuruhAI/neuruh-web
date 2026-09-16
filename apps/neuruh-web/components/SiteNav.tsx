import Link from 'next/link'
import styles from './SiteNav.module.css'
import { SpineToggle } from './SpineToggle'

const primary = [
  ['Offers', '/offers'],
  ['Products', '/products'],
  ['Proof', '/proof'],
] as const

const explore = [
  ['Give Neuruh a target', '/solve'],
  ['Problems', '/problems'],
  ['Questions', '/faq'],
  ['Top 10 products', '/products/top10'],
  ['Harnesses', '/harnesses'],
  ['Ask Neuruh', '/ask'],
  ['Work with Neuruh', '/work-with-neuruh'],
  ['Cases', '/cases'],
  ['How it works', '/how-it-works'],
  ['Founder', '/founder'],
  ['Contact', '/contact'],
  ['Galaxy', '/galaxy'],
  ['Worlds', '/worlds'],
  ['Organism', '/organism'],
  ['Research', '/research/adaptive-intelligence'],
  ['Boundaries', '/refusals'],
  ['Open source', '/open-source'],
] as const

export function SiteNav() {
  return (
    <header className="hdr">
      <Link className="brand" href="/" aria-label="Neuruh home">Neuruh</Link>
      <nav className="primary" aria-label="Primary navigation">
        {primary.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        <details className="explore">
          <summary aria-haspopup="menu">Explore ▾</summary>
          <div className="menu">
            <p className="mlbl">More</p>
            {explore.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        </details>
        <Link className={`work-cta ${styles.cta}`} href="/work-with-neuruh">Work with us</Link>
        <SpineToggle />
      </nav>
    </header>
  )
}
