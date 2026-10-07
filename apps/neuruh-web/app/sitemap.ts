import type { MetadataRoute } from 'next'
import { WORLD_IDS, getPublicSnapshot } from '../../../packages/public-truth/client'
import { PROBLEM_SLUGS } from '../lib/publicProblems'
import { TOP10_SLUGS } from '../lib/top10'

export const dynamic = 'force-static'

const COMMERCIAL_LASTMOD = new Date('2026-09-14T00:00:00.000Z')
const TOP10_LASTMOD = new Date('2026-09-14T00:00:00.000Z')
const TOP10_ROUTES = ['/products/top10', ...TOP10_SLUGS.map((slug) => `/products/top10/${slug}`), '/harnesses']
// 2026-09-16 convergence: the front door, the discovery cluster and the answer surface.
const CONVERGENCE_LASTMOD = new Date('2026-09-16T00:00:00.000Z')
const CONVERGENCE_ROUTES = ['/solve', '/problems', ...PROBLEM_SLUGS.map((slug) => `/problems/${slug}`), '/faq']
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
    '/solve',
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
    '/problems',
    ...PROBLEM_SLUGS.map((slug) => `/problems/${slug}`),
    '/faq',
    ...WORLD_IDS.map((slug) => `/worlds/${slug}`),
  ]
  return routes.map((route) => ({
    url: `https://neuruh.com${route}`,
    lastModified: CONVERGENCE_ROUTES.includes(route) ? CONVERGENCE_LASTMOD : TOP10_ROUTES.includes(route) ? TOP10_LASTMOD : COMMERCIAL.has(route) ? COMMERCIAL_LASTMOD : snapshotModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/solve' || route === '/offers' || route === '/products/top10' || route === '/harnesses' || route === '/ask' || route === '/work-with-neuruh' || route === '/products' || route === '/proof' || route === '/cases' || route === '/refusals' ? 0.8 : 0.6,
  }))
}
