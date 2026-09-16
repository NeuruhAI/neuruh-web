import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const EXPECTED = [
  ['O01', '$299', 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04'],
  ['O02', '$499', 'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05'],
  ['O05', '$1250', 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06'],
]

test('public offers keep exact cashiers, explicit buyer inputs/outputs, and a bounded next-step path', async () => {
  const catalog = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
  const grid = await readFile('apps/neuruh-web/components/OffersGrid.tsx', 'utf8')
  const page = await readFile('apps/neuruh-web/app/offers/page.tsx', 'utf8')

  assert.match(page, /from ['\"]\.\.\/\.\.\/components\/OffersGrid['\"]/)
  assert.doesNotMatch(page, /live cashier/i)

  assert.match(grid, /You provide:/)
  assert.match(grid, /You receive:/)
  assert.match(grid, /Proof:/)
  assert.match(grid, /What happens next/)

  assert.match(catalog, /scope: 'Messy data → recovered package'/)
  assert.match(catalog, /scope: 'Question → source-backed dossier'/)
  assert.match(catalog, /scope: 'Manual workflow → AI-assisted replaced flow'/)
  assert.match(catalog, /scope: 'Existing system → evidence-backed truth, state, gap, and recovery report'/)
  // No delivery-time promise and no automated outbound mail: a founder replies from the public mailbox.
  assert.doesNotMatch(catalog, /business day|Typically \d/)
  assert.match(catalog, /replies from jeramie@neuruh\.com/)
  assert.doesNotMatch(catalog, /turnaround:/)

  for (const [id, price, href] of EXPECTED) {
    assert.match(catalog, new RegExp(`id: '${id}'`))
    assert.match(catalog, new RegExp(`price: '${price.replace('$', '\\$')}'`))
    assert.equal([...catalog.matchAll(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))].length, 1)
  }

  assert.doesNotMatch(catalog, /recipe|weight|scoring|ledger|Mother|AXON|IAR/i)
  assert.doesNotMatch(grid, /recipe|weight|scoring|ledger|Mother|AXON|IAR/i)
  assert.doesNotMatch(page, /recipe|weight|scoring|ledger|Mother|AXON|IAR/i)
})
