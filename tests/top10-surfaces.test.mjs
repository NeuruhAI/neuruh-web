import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { TOP10, TOP10_SLUGS, LADDER, CATEGORIES, contactHref } from '../apps/neuruh-web/lib/top10.ts'
import { OFFER_BY_ID, PUBLIC_OFFERS } from '../apps/neuruh-web/lib/publicOffers.ts'
import { HARNESS_STAGES, DEMO_BANNER } from '../apps/neuruh-web/lib/harnessStages.ts'

const REQUIRED_SLUGS = [
  'agent-integrity', 'ai-estate-forensic', 'property-opportunity-scan', 'opportunity-intelligence-dossier',
  'business-acquisition-intelligence', 'data-rescue', 'workflow-replacement', 'proofos', 'managed-opportunity-desk', 'findsellprofit',
]
const FACTORY = /Mother|\bAXON\b|\bAegis\b|\bIAR\b|REI-X|recipe[- ]engine|scoring weights|secret topology|system prompt|customer PII|Founder Runtime|Switchboard|Honey Pot|Sentinel\b|\bSOPS\b/
const FAKE = /\b\d+\+? (happy |paying )?(customers|clients)\b|trusted by|as seen in|fully automated|guaranteed|100% accurate/i
const CASHIERS = new Set(PUBLIC_OFFERS.map((o) => o.href))
const STAGES = ['INTAKE', 'SCOPE', 'BASELINE', 'GOLDEN CASES', 'HELD-OUT CASES', 'ADVERSARIAL CASES', 'RUN', 'DELTA', 'REGRESSIONS', 'AUTHORITY CHECK', 'EVIDENCE CHECK', 'DECISION', 'SIGNED RECEIPT']

test('exactly ten products with the required slugs in rank order', () => {
  assert.deepEqual(TOP10_SLUGS, REQUIRED_SLUGS)
  assert.deepEqual(TOP10.map((p) => p.rank), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  for (const category of CATEGORIES) assert.ok(TOP10.some((p) => p.category === category), category)
})

test('every product answers the buyer questions and carries a full ladder', () => {
  for (const p of TOP10) {
    for (const key of ['name', 'status', 'price', 'ctaLabel']) {
      assert.ok(typeof p[key] === 'string' && p[key].trim().length >= 4, `${p.slug}.${key}`)
    }
    for (const key of ['audience', 'problem', 'promise', 'delivery', 'turnaround', 'demo', 'nextStep']) {
      assert.ok(typeof p[key] === 'string' && p[key].trim().length > 20, `${p.slug}.${key}`)
    }
    for (const key of ['whatItDoes', 'inputs', 'workflow', 'deliverables', 'useCases', 'real', 'proof']) {
      assert.ok(Array.isArray(p[key]) && p[key].length >= 2, `${p.slug}.${key}`)
    }
    for (const rung of LADDER) assert.ok(p.ladder[rung], `${p.slug} ladder ${rung}`)
    const text = JSON.stringify(p)
    assert.doesNotMatch(text, FACTORY, `${p.slug} leaks an internal name`)
    assert.doesNotMatch(text, FAKE, `${p.slug} carries a manufactured claim`)
    // A counted zero needs a receipt like any other number (c003a8f): refusals point to /refusals instead.
    assert.ok(p.proof.some((line) => /\/refusals/.test(line)), `${p.slug} must point its unpublished client facts at /refusals`)
    assert.doesNotMatch(text, /hard zeros|(sold|delivered|run)( or delivered)? yet|No [a-z -]*customer exists|one business day/i, `${p.slug} carries an unreceipted zero or promise`)
  }
})

test('checkout exists only through the three existing cashiers; everything else is a contact intake', () => {
  for (const p of TOP10) {
    if (p.offerId) {
      assert.equal(p.priceStatus, 'LIVE_CASHIER', p.slug)
      assert.ok(CASHIERS.has(OFFER_BY_ID[p.offerId].href), `${p.slug} cashier must be an existing SHIP-001 link`)
      assert.equal(p.ladder['Checkout / quote'], 'PROVEN_LIVE', p.slug)
    } else {
      assert.notEqual(p.priceStatus, 'LIVE_CASHIER', p.slug)
      assert.equal(contactHref(p), `/contact?product=${p.slug}`)
      assert.notEqual(p.ladder['Checkout / quote'], 'PROVEN_LIVE', p.slug)
    }
    // Fulfillment, delivery, receipt are founder-operated and unproven until a receipted engagement exists.
    for (const rung of ['Fulfillment', 'Delivery', 'Receipt']) assert.notEqual(p.ladder[rung], 'PROVEN_LIVE', `${p.slug} ${rung}`)
    assert.equal(p.ladder.Outcome, 'UNKNOWN', p.slug)
  }
  const mapping = Object.fromEntries(TOP10.filter((p) => p.offerId).map((p) => [p.slug, p.offerId]))
  assert.deepEqual(mapping, { 'opportunity-intelligence-dossier': 'O02', 'data-rescue': 'O01', 'workflow-replacement': 'O05' })
  const scan = TOP10.find((p) => p.slug === 'property-opportunity-scan')
  assert.equal(scan.priceStatus, 'FOUNDER_SET_NO_CASHIER')
  assert.equal(scan.ladder['Checkout / quote'], 'BLOCKED')
  assert.match(scan.price, /\$100/)
})

test('the demonstration is labeled and the harness sequence is canonical', async () => {
  assert.equal(DEMO_BANNER, 'BROWSER DEMONSTRATION — NOT A PRODUCTION ASSURANCE RESULT')
  assert.deepEqual([...HARNESS_STAGES], STAGES)
  const demo = await readFile('apps/neuruh-web/components/top10/ProductDemo.tsx', 'utf8')
  assert.match(demo, /data-testid="demo-banner">\{DEMO_BANNER\}/)
  assert.doesNotMatch(demo, /LIVE PRODUCT DEMO/)
  assert.match(demo, /UNSIGNED BROWSER DIGEST/)
  const harness = await readFile('apps/neuruh-web/app/harnesses/page.tsx', 'utf8')
  assert.match(harness, /None of these harnesses is externally callable/)
  assert.doesNotMatch(harness, FACTORY)
  for (const status of ['USED ON NEURUH RELEASES', 'INTERNAL · COURTED', 'RESEARCH', 'PROPOSED']) assert.match(harness, new RegExp(status))
  const slugPage = await readFile('apps/neuruh-web/app/products/top10/[slug]/page.tsx', 'utf8')
  assert.match(slugPage, /OFFER_BY_ID\[p\.offerId\]/)
  assert.match(slugPage, /cashier\.href/)
  assert.doesNotMatch(slugPage, /stripe\.com/)
  assert.match(slugPage, /notFound\(\)/)
  assert.match(slugPage, /data-testid="product-example"/)
  assert.match(slugPage, /data-testid="product-related"/)
  assert.match(slugPage, /not a customer result/)
  assert.match(slugPage, /dynamicParams = false/)
  for (const file of ['apps/neuruh-web/app/products/top10/page.tsx', 'apps/neuruh-web/app/products/top10/[slug]/page.tsx', 'apps/neuruh-web/app/harnesses/page.tsx', 'apps/neuruh-web/components/ProductInquiry.tsx']) {
    assert.doesNotMatch(await readFile(file, 'utf8'), FACTORY, file)
  }
})

test('sitemap, contact intake, and smoke court carry the Top 10 routes', async () => {
  const sitemap = await readFile('apps/neuruh-web/app/sitemap.ts', 'utf8')
  assert.match(sitemap, /TOP10_SLUGS/)
  assert.match(sitemap, /'\/harnesses'/)
  const contact = await readFile('apps/neuruh-web/app/contact/page.tsx', 'utf8')
  assert.match(contact, /<ProductInquiry \/>/)
  const smoke = await readFile('apps/neuruh-web/tests/production.smoke.spec.ts', 'utf8')
  for (const slug of REQUIRED_SLUGS) assert.match(smoke, new RegExp(`/products/top10/${slug}`))
  const privateIp = await readFile('scripts/verify-private-ip.mjs', 'utf8')
  for (const slug of REQUIRED_SLUGS) assert.match(privateIp, new RegExp(`products/top10/${slug}`))
})
