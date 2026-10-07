import type { Metadata } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { JsonLd } from '../components/JsonLd'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_ORIGIN, pageMeta } from '../lib/publicSeo'

const display = Archivo({ subsets: ['latin'], weight: ['600', '700'], variable: '--nf-display', display: 'swap' })
const sans = Inter({ subsets: ['latin'], weight: ['400', '600'], variable: '--nf-sans', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--nf-mono', display: 'swap' })

const home = pageMeta({
  path: '/',
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  absoluteTitle: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: DEFAULT_TITLE,
    template: '%s — Neuruh',
  },
  description: DEFAULT_DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: home.openGraph,
  twitter: home.twitter,
}

/**
 * Spine selection before first paint: a stored choice on this device, else the
 * reader's system colour preference. Obsidian and bone are co-equal; neither is
 * privileged, and no page works on only one of them.
 */
const SPINE_BOOT = `(function(){try{var s=localStorage.getItem('neuruh-spine');if(s!=='bone'&&s!=='obsidian'){s=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)?'bone':'obsidian'}document.documentElement.setAttribute('data-spine',s)}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-spine="obsidian"
      data-scene-tier="0"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark light" />
        <script dangerouslySetInnerHTML={{ __html: SPINE_BOOT }} />
      </head>
      <body>
        <JsonLd />
        <a className="skip-link global-skip" href="#main">Skip to content</a>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
