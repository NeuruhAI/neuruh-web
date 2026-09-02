import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

async function source(rel) {
  return readFile(rel, 'utf8')
}

test('proof and case surfaces consume the public-safe truth rules', async () => {
  const rules = await source('apps/neuruh-web/lib/publicTruthRules.ts')
  const proof = await source('apps/neuruh-web/lib/publicProofCards.ts')
  const cases = await source('apps/neuruh-web/lib/publicCaseStudies.ts')
  const proofPage = await source('apps/neuruh-web/app/proof/page.tsx')
  const casesPage = await source('apps/neuruh-web/app/cases/page.tsx')
  const offers = await source('apps/neuruh-web/lib/publicOffers.ts')

  assert.match(rules, /Merged is not live/)
  assert.match(rules, /IN_REVIEW is not listed and is not live/)
  assert.match(rules, /A live cashier is not automated fulfillment/)
  assert.match(rules, /SHIP-001 on neuruh.com is SHIPPED_LIVE/)
  assert.match(rules, /ORDER→FR remains a draft, not merged/)
  assert.match(rules, /neuruh-workers/)
  assert.match(rules, /xAI marketplace is IN_REVIEW/)

  for (const id of ['jgi-dispatch-bridge', 'switchboard', 'honey-pot-git-custody', 'cockpit-laric']) {
    const start = proof.indexOf(`id: '${id}'`)
    const slice = proof.slice(start, start + 700)
    assert.match(slice, /MERGED \/ COURTED/)
    assert.doesNotMatch(slice, /status: 'LIVE'/)
    assert.match(slice, /mergedIsNotLive|organsCourted/)
  }

  const xai = proof.slice(proof.indexOf('xai-marketplace'), proof.indexOf('neuruh-com-launch'))
  assert.match(xai, /IN_REVIEW/)
  assert.match(xai, /not listed/)
  assert.doesNotMatch(xai, /status: 'LIVE'/)
  assert.doesNotMatch(xai, /book\.stripe\.com/)

  assert.match(proof, /status: 'SHIPPED_LIVE'/)
  assert.match(cases, /status: 'SHIPPED_LIVE'/)
  assert.match(proof, /liveCashierIsNotFulfillment/)
  assert.match(cases, /cashiersLiveOrderDraft/)
  assert.match(offers, /A live cashier is not automated fulfillment/)
  assert.match(proofPage, /Merged is not live/)
  assert.match(casesPage, /ORDER→FR remains draft/)

  for (const text of [proof, cases, proofPage, casesPage, offers]) {
    assert.doesNotMatch(text, /github\.com\/[^/\s"'`]+\/(?:neuruh-workers|cockpit|data-rescue)\b/i)
    assert.doesNotMatch(text, /Mother|\bAXON\b|\bAegis\b|\bIAR\b|scoring weights|system prompt/i)
  }
})
