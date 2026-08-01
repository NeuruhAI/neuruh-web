import type { Metadata } from 'next'
import './globals.css'
import { SiteNav } from '../components/SiteNav'

export const metadata: Metadata = {
  title: 'Neuruh — Public operating projection',
  description: 'A public-safe verified snapshot of Neuruh worlds, evidence, relationships, contradictions, governance, and proof boundaries.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-spine="obsidian" data-scene-tier="0">
      <body>
        <a className="skip-link global-skip" href="#main">Skip to content</a>
        <SiteNav />
        {children}
      </body>
    </html>
  )
}
