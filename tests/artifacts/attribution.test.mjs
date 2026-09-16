import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Attribution court (2026-09-14): no commercial link leaves neuruh.com unattributed.
 * Stripe cashiers carry client_reference_id=root-<offer>; Cal.com and sibling-surface
 * links carry the UTM quartet with utm_campaign=root. Runs against the prerendered HTML.
 */
const APP = 'apps/neuruh-web/.next/server/app'
const ROUTES = ['index', 'offers', 'ask', 'work-with-neuruh', 'work-with-us', 'contact', 'thank-you', 'cases', 'proof', 'founder', 'products']
const UTM = /utm_source=neuruh(?:&amp;|&)utm_medium=site(?:&amp;|&)utm_campaign=root(?:&amp;|&)utm_content=[a-z0-9-]+/
const unescape = (s) => s.replace(/&amp;/g, '&')

test('every outbound commercial link on the built site is attributed', async () => {
  const seen = { stripe: new Set(), cal: new Set(), estate: new Set() }
  for (const route of ROUTES) {
    const html = await readFile(path.join(APP, `${route}.html`), 'utf8')
    for (const [, href] of html.matchAll(/href="(https:\/\/[^"]+)"/g)) {
      const url = unescape(href)
      if (/^https:\/\/book\.stripe\.com\//.test(url)) {
        assert.match(url, /[?&]client_reference_id=root-o0[125]$/, `${route}: unattributed cashier ${url}`)
        seen.stripe.add(url)
      } else if (/^https:\/\/cal\.com\//.test(url)) {
        assert.match(url, UTM, `${route}: unattributed Cal.com link ${url}`)
        seen.cal.add(url)
      } else if (/^https:\/\/(re|guide)\.neuruh\.com/.test(url)) {
        assert.match(url, UTM, `${route}: unattributed estate link ${url}`)
        seen.estate.add(url)
      }
    }
  }
  assert.equal(seen.stripe.size, 3, `expected the three cashiers, saw ${[...seen.stripe].join(' ')}`)
  assert.ok(seen.cal.size >= 5, `expected the forensic session and the four-tier ladder, saw ${seen.cal.size}`)
  assert.ok(seen.estate.size >= 1, 'expected at least one attributed link into re.neuruh.com')
})

test('attribution never touches the canonical cashier identity', async () => {
  const catalog = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
  for (const id of ['bJe5kDagndYugJlaow2cg04', '8x2cN574b1bIakXgMU2cg05', '7sY00j1JRf2y2Sv4082cg06']) {
    assert.match(catalog, new RegExp(`https://book\\.stripe\\.com/${id}'`), 'catalog keeps the bare canonical link; parameters are added at render time')
  }
})
