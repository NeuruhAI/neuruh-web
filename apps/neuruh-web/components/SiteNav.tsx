import Link from 'next/link'

const primary = [
  ['Products', '/products'],
  ['How it works', '/how-it-works'],
  ['Proof', '/proof'],
  ['Founder', '/founder'],
  ['Contact', '/contact'],
] as const

const explore = [
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
            <p className="mlbl">Deeper systems</p>
            {explore.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        </details>
        <Link className="work-cta" href="/contact">Work with Neuruh</Link>
      </nav>
    </header>
  )
}
