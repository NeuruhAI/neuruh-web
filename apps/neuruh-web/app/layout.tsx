import type { Metadata } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const display = Archivo({ subsets: ['latin'], weight: ['600', '700'], variable: '--nf-display', display: 'swap' })
const sans = Inter({ subsets: ['latin'], weight: ['400', '600'], variable: '--nf-sans', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--nf-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://neuruh.com'),
  title: {
    default: 'Neuruh — Governed AI systems that leave receipts',
    template: '%s — Neuruh',
  },
  description:
    'Neuruh builds governed execution infrastructure for AI systems: nothing acts without checked authority, everything leaves a verifiable receipt, and what the system refuses is recorded as carefully as what it does.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://neuruh.com',
    siteName: 'Neuruh',
    title: 'Neuruh — Governed AI systems that leave receipts',
    description:
      'Nothing acts without checked authority. Everything leaves a verifiable receipt. What the system refuses is recorded as carefully as what it does.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neuruh — Governed AI systems that leave receipts',
    description:
      'Nothing acts without checked authority. Everything leaves a verifiable receipt. What the system refuses is recorded as carefully as what it does.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-spine="obsidian"
      data-scene-tier="0"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <a className="skip-link global-skip" href="#main">Skip to content</a>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
