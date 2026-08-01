import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neuruh — Fragmented signal becomes governed action',
  description: 'Neuruh turns fragmented signals and physical-world complexity into governed intelligence and executable systems.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-spine="obsidian" data-scene-tier="0">
      <body>{children}</body>
    </html>
  )
}
