import type { MetadataRoute } from 'next'
import { WORLD_IDS, getPublicSnapshot } from '../../../packages/public-truth/client'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(getPublicSnapshot().dataset.last_verified_at)
  const routes = [
    '/',
    '/offers',
    '/products',
    '/how-it-works',
    '/proof',
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
    '/accessible',
    ...WORLD_IDS.map((slug) => `/worlds/${slug}`),
  ]
  return routes.map((route) => ({
    url: `https://neuruh.com${route}`,
    lastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/offers' || route === '/products' || route === '/proof' || route === '/refusals' ? 0.8 : 0.6,
  }))
}
