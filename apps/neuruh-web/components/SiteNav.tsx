import Link from 'next/link'

const links = [
  ['Organism', '/organism'],
  ['Galaxy', '/galaxy'],
  ['Worlds', '/worlds'],
  ['Products', '/products'],
  ['Proof', '/proof'],
  ['Refusals', '/refusals'],
  ['Founder', '/founder'],
  ['Contact', '/contact'],
] as const

export function SiteNav() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Neuruh home">Neuruh</Link>
      <nav aria-label="Primary navigation">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    </header>
  )
}
