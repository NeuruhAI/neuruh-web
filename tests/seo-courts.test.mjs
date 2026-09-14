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

test('refusals are stated as refusals, never as unreceipted counts, and the homepage carries no machine state', async () => {
  const notClaimed = await source('apps/neuruh-web/lib/publicNotClaimed.ts')
  const home = await source('apps/neuruh-web/components/HomeV2.tsx')
  const proof = await source('apps/neuruh-web/app/proof/page.tsx')
  const refusals = await source('apps/neuruh-web/app/refusals/page.tsx')
  const footer = await source('apps/neuruh-web/components/SiteFooter.tsx')
  assert.match(notClaimed, /A live cashier is not a customer/)
  assert.match(proof, /NOT_CLAIMED/)
  assert.match(refusals, /NOT_CLAIMED/)
  // No dated zero counts anywhere: a counted zero needs a receipt like any other number.
  for (const text of [notClaimed, home, proof, refusals]) {
    assert.doesNotMatch(text, /Revenue[^.]{0,40}\$0/)
    assert.doesNotMatch(text, /Customers:? 0\b/)
  }
  // Layer separation: the homepage (Layer 2) carries no snapshot date, count, status pill or simulated receipt.
  assert.doesNotMatch(home, /getPublicObject|getPublicSnapshot|getPublicObjects/)
  assert.doesNotMatch(home, /2026-0\d-\d\d/)
  assert.doesNotMatch(home, /sha e2b71fa|offer\.prepared|RECEIPT · VERIFIED|proofstrip|hero-proofline/)
  assert.doesNotMatch(home, /Benton Harbor/)
  // The machine-state banner is gone from the shared footer; the ledger lives on /proof.
  assert.doesNotMatch(footer, /Truth mode|living state|live connectivity|getTruthSummary/)
  assert.match(footer, /href="\/proof"/)
  // /proof carries the single "Verified as of" line and a plain-language method.
  assert.match(proof, /Verified as of/)
  assert.match(proof, /data-testid="proof-method"/)
})

test('the four canon offers are present, the Forensic audit books on Cal.com with no cashier, and no retired product remains', async () => {
  const catalog = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
  for (const id of ['O01', 'O02', 'O05', 'FSA']) assert.match(catalog, new RegExp(`id: '${id}'`))
  assert.match(catalog, /Forensic System Audit/)
  const forensic = catalog.slice(catalog.indexOf("id: 'FSA'"), catalog.indexOf('export type PublicOffer'))
  assert.match(forensic, /kind: 'booking'/)
  assert.match(forensic, /cal\.com\/neuruh\/forensic-scope-session-90/)
  assert.doesNotMatch(forensic, /stripe\.com|\$\s?\d|books free|invoiced/)
  // Boundaries from canon, in substance.
  assert.match(catalog, /Messy data → recovered package/)
  assert.match(catalog, /Question → source-backed dossier/)
  assert.match(catalog, /Manual workflow → AI-assisted replaced flow/)
  assert.match(catalog, /Existing system → evidence-backed truth, state, gap, and recovery report/)
  // The Cal.com ladder never prints a paid rate (not in canon); the qualifying call is free.
  const ladder = catalog.slice(catalog.indexOf('PUBLIC_CALLS'), catalog.indexOf('OFFER_NEXT_STEPS'))
  assert.doesNotMatch(ladder, /\$\s?\d/)
  assert.match(ladder, /rate: 'Free'/)
  // Retired quoted products and the internal $799 recommendation must not appear anywhere public.
  const hub = await readFile('apps/neuruh-web/components/WorkWithHub.tsx', 'utf8')
  const contact = await readFile('apps/neuruh-web/app/contact/page.tsx', 'utf8')
  for (const text of [catalog, hub, contact]) {
    assert.doesNotMatch(text, /QUOTED_ENGAGEMENTS|Lead Rescue|Request a quote|\$\s?799\b/)
  }
  // One primary action per offer card.
  const grid = await readFile('apps/neuruh-web/components/OffersGrid.tsx', 'utf8')
  assert.equal((grid.match(/v2-btn-primary/g) ?? []).length, 1)
})
