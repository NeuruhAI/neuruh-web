import type { MetadataRoute } from 'next'
import { WORLD_IDS, getPublicSnapshot } from '../../../packages/public-truth/client'
import { TOP10_SLUGS } from '../lib/top10'

export const dynamic = 'force-static'

const COMMERCIAL_LASTMOD = new Date('2026-09-02T00:00:00.000Z')
const TOP10_LASTMOD = new Date('2026-09-14T00:00:00.000Z')
const TOP10_ROUTES = ['/products/top10', ...TOP10_SLUGS.map((slug) => `/products/top10/${slug}`), '/harnesses']
const COMMERCIAL = new Set([
  '/',
  '/offers',
  '/ask',
  '/work-with-neuruh',
  '/work-with-us',
  '/thank-you',
  '/cases',
  '/contact',
  '/security',
])

export default function sitemap(): MetadataRoute.Sitemap {
  const snapshotModified = new Date(getPublicSnapshot().dataset.last_verified_at)
  const routes = [
    '/',
    '/offers',
    '/ask',
    '/work-with-neuruh',
    '/work-with-us',
    '/thank-you',
    '/cases',
    '/products',
    ...TOP10_ROUTES,
    '/how-it-works',
    '/proof',
    '/proof/distribution',
    '/refusals',
    '/open-source',
    '/organism',
    '/galaxy',
    '/worlds',
    '/research/adaptive-intelligence',
    '/research/case-zero',
    '/founder',
    '/contact',
    '/legal',
    '/security',
    '/accessible',
    ...WORLD_IDS.map((slug) => `/worlds/${slug}`),
  ]
  return routes.map((route) => ({
    url: `https://neuruh.com${route}`,
    lastModified: TOP10_ROUTES.includes(route) ? TOP10_LASTMOD : COMMERCIAL.has(route) ? COMMERCIAL_LASTMOD : snapshotModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/offers' || route === '/products/top10' || route === '/harnesses' || route === '/ask' || route === '/work-with-neuruh' || route === '/products' || route === '/proof' || route === '/cases' || route === '/refusals' ? 0.8 : 0.6,
  }))
}
