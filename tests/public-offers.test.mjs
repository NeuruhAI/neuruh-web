import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const EXPECTED = [
  ['O01', '$299', 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04'],
  ['O02', '$499', 'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05'],
  ['O05', '$1250', 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06'],
]

test('public offers catalog carries the three live cashier URLs and prices', async () => {
  const catalog = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
  const page = await readFile('apps/neuruh-web/app/offers/page.tsx', 'utf8')
  assert.match(page, /from ['\"]\.\.\/\.\.\/lib\/publicOffers['\"]/)
  for (const [id, price, href] of EXPECTED) {
    assert.match(catalog, new RegExp(`id: '${id}'`))
    assert.match(catalog, new RegExp(`price: '${price.replace('$', '\\$')}'`))
    assert.equal([...catalog.matchAll(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))].length, 1)
  }
  assert.doesNotMatch(catalog, /recipe|weight|scoring|ledger|Mother|AXON|IAR/i)
  assert.doesNotMatch(page, /recipe|weight|scoring|ledger|Mother|AXON|IAR/i)
})
