import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const CASHIERS = [
  ['O01', '$299', 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04'],
  ['O02', '$499', 'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05'],
  ['O05', '$1250', 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06'],
]

const FACTORY = /Mother|\bAXON\b|\bAegis\b|\bIAR\b|REI-X|recipe-engine|scoring weights|secret topology|system prompt|customer PII/i

async function source(rel) {
  return readFile(rel, 'utf8')
}

test('Ask Neuruh hard-caps public output at FASTEST, BEST VALUE, and CUSTOM', async () => {
  const recs = await source('apps/neuruh-web/lib/askRecommendations.ts')
  const ask = await source('apps/neuruh-web/components/AskNeuruh.tsx')
  assert.match(recs, /ASK_LANES = \['FASTEST', 'BEST VALUE', 'CUSTOM'\]/)
  assert.equal([...recs.matchAll(/lane: '/g)].length, 3)
  assert.match(ask, /ASK_CARDS\.map/)
  assert.match(ask, /You provide:/)
  assert.match(ask, /You receive:/)
  assert.match(ask, /Proof:/)
  assert.doesNotMatch(recs, FACTORY)
  assert.doesNotMatch(ask, FACTORY)
})

test('commercial surfaces keep the three live cashiers and add handoff, work, cases, proof cards', async () => {
  const offers = await source('apps/neuruh-web/lib/publicOffers.ts')
  const work = await source('apps/neuruh-web/app/work-with-neuruh/page.tsx')
  const workAlias = await source('apps/neuruh-web/app/work-with-us/page.tsx')
  const hub = await source('apps/neuruh-web/components/WorkWithHub.tsx')
  const thanks = await source('apps/neuruh-web/app/thank-you/page.tsx')
  const handoff = await source('apps/neuruh-web/components/ThankYouHandoff.tsx')
  const cases = await source('apps/neuruh-web/lib/publicCaseStudies.ts')
  const proof = await source('apps/neuruh-web/lib/publicProofCards.ts')
  const contact = await source('apps/neuruh-web/app/contact/page.tsx')
  const sitemap = await source('apps/neuruh-web/app/sitemap.ts')

  for (const [id, price, href] of CASHIERS) {
    assert.match(offers, new RegExp(`id: '${id}'`))
    assert.match(offers, new RegExp(`price: '${price.replace('$', '\\$')}'`))
    assert.equal([...offers.matchAll(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))].length, 1)
  }

  assert.doesNotMatch(offers, /turnaround:/)
  assert.match(hub, /\/offers/)
  assert.match(hub, /four fixed-scope offers/)
  assert.match(hub, /\/ask/)
  assert.match(workAlias, /canonical: '\/work-with-neuruh'/)
  assert.match(thanks, /does not receive Stripe webhooks/)
  assert.match(handoff, /does not receive Stripe webhooks/)
  assert.match(cases, /deedsonar-production/)
  assert.match(cases, /neuruh-com-launch/)
  assert.match(proof, /IN_REVIEW/)
  assert.match(proof, /xai-marketplace/)
  assert.match(proof, /jgi-dispatch-bridge/)
  assert.match(proof, /MERGED \/ COURTED/)
  assert.match(proof, /SHIPPED_LIVE/)
  assert.doesNotMatch(proof, /live listing/i)
  assert.match(contact, /\/thank-you/)
  assert.match(sitemap, /\/ask/)
  assert.match(sitemap, /\/work-with-neuruh/)
  assert.match(sitemap, /\/work-with-us/)
  assert.match(sitemap, /\/thank-you/)
  assert.match(sitemap, /\/cases/)

  for (const text of [offers, work, workAlias, hub, thanks, handoff, cases, proof, contact]) {
    assert.doesNotMatch(text, FACTORY)
  }
})

test('xAI marketplace stays IN_REVIEW and is not sold as live', async () => {
  const proof = await source('apps/neuruh-web/lib/publicProofCards.ts')
  const card = proof.slice(proof.indexOf('xai-marketplace'), proof.indexOf('neuruh-com-launch'))
  assert.match(card, /IN_REVIEW/)
  assert.match(card, /not live/)
  assert.doesNotMatch(card, /book\.stripe\.com/)
})
