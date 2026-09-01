import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const EXPECTED = [
  ['O01', '$299', 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04', 'the files or records and their format.', 'a usable recovered/parsed copy.'],
  ['O02', '$499', 'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05', 'the target and the decision you need to make.', 'one brief (what it is, why it matters, what to do next).'],
  ['O05', '$1250', 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06', 'the messy workflow and current stack.', 'a scoped working replacement for that one process.'],
]

test('public offers catalog carries the three live cashier URLs, prices, and provide/receive copy', async () => {
  const catalog = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
  const grid = await readFile('apps/neuruh-web/components/OffersGrid.tsx', 'utf8')
  const page = await readFile('apps/neuruh-web/app/offers/page.tsx', 'utf8')
  assert.match(page, /from ['\"]\.\.\/\.\.\/components\/OffersGrid['\"]/)
  assert.match(grid, /from ['\"]\.\.\/lib\/publicOffers['\"]/)
  assert.match(grid, /You provide:/)
  assert.match(grid, /You receive:/)
  assert.match(page, /What happens next/)
  assert.match(catalog, /email the checkout address within one business day/)
  for (const [id, price, href, provide, receive] of EXPECTED) {
    assert.match(catalog, new RegExp(`id: '${id}'`))
    assert.match(catalog, new RegExp(`price: '${price.replace('$', '\\$')}'`))
    assert.match(catalog, new RegExp(provide.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.match(catalog, new RegExp(receive.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.equal([...catalog.matchAll(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))].length, 1)
  }
  assert.doesNotMatch(catalog, /recipe|weight|scoring|ledger|Mother|AXON|IAR/i)
  assert.doesNotMatch(grid, /recipe|weight|scoring|ledger|Mother|AXON|IAR/i)
  assert.doesNotMatch(page, /recipe|weight|scoring|ledger|Mother|AXON|IAR/i)
})
