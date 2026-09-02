import type { Metadata } from 'next'

export const SITE_ORIGIN = 'https://neuruh.com'

export const DEFAULT_TITLE = 'Neuruh — Governed AI systems that leave receipts'
export const DEFAULT_DESCRIPTION =
  'Neuruh builds governed execution infrastructure for AI systems: nothing acts without checked authority, everything leaves a verifiable receipt, and what the system refuses is recorded as carefully as what it does.'

export function absoluteUrl(path: string) {
  if (path === '/') return SITE_ORIGIN
  return `${SITE_ORIGIN}${path}`
}

export function pageMeta({
  path,
  title,
  description,
  canonical = path,
  absoluteTitle = false,
}: {
  path: string
  title: string
  description: string
  canonical?: string
  absoluteTitle?: boolean
}): Metadata {
  const url = absoluteUrl(canonical)
  const ogTitle = absoluteTitle ? title : `${title} — Neuruh`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Neuruh',
      title: ogTitle,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
    },
  }
}
