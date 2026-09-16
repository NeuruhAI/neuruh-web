import test from 'node:test'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const CASHIERS = [
  'https://book.stripe.com/bJe5kDagndYugJlaow2cg04',
  'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05',
  'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06',
]

test('checkout-link court allows only the three existing SHIP-001 cashiers', async () => {
  const catalog = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
  const ask = await readFile('apps/neuruh-web/lib/askRecommendations.ts', 'utf8')
  const found = catalog.match(/https:\/\/(?:book|buy|checkout)\.stripe\.com\/[A-Za-z0-9]+/g) ?? []
  assert.deepEqual([...new Set(found)].sort(), [...CASHIERS].sort())
  assert.match(ask, /ASK_LANES = \['FASTEST', 'BEST VALUE', 'CUSTOM'\]/)
  assert.equal([...ask.matchAll(/lane: '/g)].length, 3)
  // Attribution is applied at render time; the lanes still point at the catalog cashiers, in order.
  assert.match(ask, /ctaHref: offerHref\(PUBLIC_OFFERS\[0\]\)/)
  assert.match(ask, /ctaHref: offerHref\(PUBLIC_OFFERS\[1\]\)/)
  assert.match(ask, /ctaHref: offerHref\(PUBLIC_OFFERS\[2\]\)/)

  const result = spawnSync(process.execPath, ['scripts/verify-checkout-links.mjs'], {
    encoding: 'utf8',
    env: { ...process.env, CHECKOUT_LINK_SKIP_LIVE: '1' },
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.match(result.stdout, /checkout-link: PASS/)
})
