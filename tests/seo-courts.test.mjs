import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const FACTORY = /Mother|\bAXON\b|\bAegis\b|\bIAR\b|REI-X|recipe-engine|scoring weights|secret topology|system prompt|customer PII/i

async function source(rel) {
  return readFile(rel, 'utf8')
}

test('pageMeta writes per-route Open Graph url, title, and description', async () => {
  const seo = await source('apps/neuruh-web/lib/publicSeo.ts')
  assert.match(seo, /openGraph/)
  assert.match(seo, /canonical/)
  assert.match(seo, /ogTitle/)
  assert.match(seo, /SITE_ORIGIN = 'https:\/\/neuruh.com'/)

  const routes = [
    ['app/page.tsx', "path: '/'"],
    ['app/offers/page.tsx', "path: '/offers'"],
    ['app/ask/page.tsx', "path: '/ask'"],
    ['app/work-with-neuruh/page.tsx', "path: '/work-with-neuruh'"],
    ['app/work-with-us/page.tsx', "canonical: '/work-with-neuruh'"],
    ['app/thank-you/page.tsx', "path: '/thank-you'"],
    ['app/cases/page.tsx', "path: '/cases'"],
    ['app/proof/page.tsx', "path: '/proof'"],
    ['app/contact/page.tsx', "path: '/contact'"],
    ['app/security/page.tsx', "path: '/security'"],
  ]
  for (const [file, needle] of routes) {
    const text = await source(`apps/neuruh-web/${file}`)
    assert.match(text, /pageMeta\(/)
    assert.match(text, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.doesNotMatch(text, FACTORY)
  }
})

test('JSON-LD is Organization, WebSite, and the three public Services only', async () => {
  const jsonLd = await source('apps/neuruh-web/lib/publicJsonLd.ts')
  const layout = await source('apps/neuruh-web/app/layout.tsx')
  assert.match(jsonLd, /'@type': 'Organization'/)
  assert.match(jsonLd, /'@type': 'WebSite'/)
  assert.match(jsonLd, /'@type': 'Service'/)
  assert.match(jsonLd, /PUBLIC_OFFERS/)
  assert.doesNotMatch(jsonLd, FACTORY)
  assert.match(layout, /<JsonLd/)
  assert.match(jsonLd, /offer\.href/)
})

test('robots, sitemap, and security.txt stay public-safe', async () => {
  const robots = await source('apps/neuruh-web/app/robots.ts')
  const sitemap = await source('apps/neuruh-web/app/sitemap.ts')
  const security = await source('apps/neuruh-web/public/.well-known/security.txt')
  const vercel = await source('vercel.json')
  assert.match(robots, /sitemap: 'https:\/\/neuruh.com\/sitemap.xml'/)
  assert.match(sitemap, /\/work-with-us/)
  assert.match(sitemap, /2026-09-02T00:00:00.000Z/)
  assert.match(security, /Contact: https:\/\/neuruh.com\/security/)
  assert.doesNotMatch(security, /mailto:/)
  assert.doesNotMatch(security, FACTORY)
  assert.match(vercel, /"source": "\/work-with-us"/)
  assert.match(vercel, /"destination": "\/work-with-neuruh"/)
})

test('global footer uses the public-safe /security path and does not invent a mailbox', async () => {
  const footer = await source('apps/neuruh-web/components/SiteFooter.tsx')
  assert.match(footer, /href="\/security"/)
  assert.doesNotMatch(footer, /mailto:/i)
  assert.doesNotMatch(footer, /@[a-z0-9.-]+/i)
  const security = await source('apps/neuruh-web/public/.well-known/security.txt')
  assert.match(security, /Contact: https:\/\/neuruh.com\/security/)
  assert.doesNotMatch(security, /mailto:/)
})

test('hard zeros stay dated to the public snapshot and are not sold as live Stripe truth', async () => {
  const zeros = await source('apps/neuruh-web/lib/publicHardZeros.ts')
  const home = await source('apps/neuruh-web/components/HomeV2.tsx')
  const proof = await source('apps/neuruh-web/app/proof/page.tsx')
  const refusals = await source('apps/neuruh-web/app/refusals/page.tsx')
  // The invariant is "dated to the published snapshot", not a literal date: pinning the
  // date here made the court fail the moment the snapshot legitimately moved forward.
  const asOfSnapshot = JSON.parse(await readFile('package.json', 'utf8')).scripts['compile:truth'].match(/--as-of=(\d{4}-\d{2}-\d{2})/)[1]
  assert.match(zeros, new RegExp(`asOf: '${asOfSnapshot}'`))
  // A figure is either dated or deliberately withheld — never a live readout.
  assert.match(zeros, /revenue: '(?:not published|\$[\d,]+)'/)
  assert.match(zeros, /customers: '(?:not published|[\d,]+)'/)
  assert.match(home, /PUBLIC_HARD_ZEROS/)
  assert.match(home, /not a live Stripe readout/)
  assert.match(home, /not live organ products/)
  assert.match(proof, /PUBLIC_HARD_ZEROS/)
  assert.match(refusals, /PUBLIC_HARD_ZEROS/)
})

test('quoted engagements are built products with no price and no cashier', async () => {
  const catalog = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
  const quoted = catalog.slice(catalog.indexOf('QUOTED_ENGAGEMENTS'))
  assert.match(quoted, /id: 'Q-PROPERTY-SCAN'/)
  assert.match(quoted, /id: 'Q-LEAD-RESCUE'/)
  // No price, no dollar figure, no cashier: pricing is an unmade founder decision.
  assert.doesNotMatch(quoted, /\bprice:/)
  assert.doesNotMatch(quoted, /\$\s?\d/)
  assert.doesNotMatch(quoted, /stripe\.com/)
  // The $799 per-market recommendation is internal and must not appear anywhere public.
  const hub = await readFile('apps/neuruh-web/components/WorkWithHub.tsx', 'utf8')
  assert.doesNotMatch(hub, /\$\s?799\b/)
  assert.doesNotMatch(catalog, /\$\s?799\b/)
  // The quote path must route to the existing contact surface, not a new mailbox.
  assert.match(quoted, /href: '\/contact'/)
  assert.doesNotMatch(quoted, /mailto:/)
})
