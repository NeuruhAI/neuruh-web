import type { Metadata } from 'next'

export const SITE_ORIGIN = 'https://neuruh.com'

export const DEFAULT_TITLE = 'Neuruh — Governed AI systems that leave receipts'
export const DEFAULT_DESCRIPTION =
  'Neuruh builds governed execution for AI systems: nothing acts without checked authority, and every action or refusal leaves a verifiable receipt.'

// A plain public file, so the og/twitter image URL stays stable across deployments.
export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: 'Neuruh' }

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
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  }
}
