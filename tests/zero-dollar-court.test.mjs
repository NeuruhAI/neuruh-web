import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'

/**
 * Court over the vendored zero-dollar commercial court receipts.
 * The receipts are evidence that the commercial tape runs in TEST mode. They must never be
 * mistaken for customer proof, never carry a real email, never ship factory names, and their
 * digests must recompute.
 */
const DIR = 'docs/receipts-external/zero-dollar-court-20260914'
const DESIGNATION = 'TEST / SANDBOX — NOT A REAL CUSTOMER — NO MONEY CHARGED'
const OFFERS = ['O01', 'O02', 'O05', 'O-PROPERTY-SCAN']
const FACTORY = /\bMother\b|\bAXON\b|\bAegis\b|\bIAR\b|REI[-_ ]?X|recipe[- ]engine|scoring weights|weight vector|secret topology|system prompt|customer PII|(?:^|[\s"'`])\/(?:Users|home)\//
const REAL_EMAIL = /@(?!example\.com\b|example\.invalid\b|neuruh\.com\b)[a-z0-9.-]+\.[a-z]{2,}/i  // neuruh.com = the business support address, not a customer
const sha = (s) => createHash('sha256').update(s).digest('hex')
const canon = (v) => (v === null || typeof v !== 'object') ? JSON.stringify(v) ?? 'null' : Array.isArray(v) ? `[${v.map(canon).join(',')}]` : `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`
const stripDenial = (v) => Array.isArray(v) ? v.map(stripDenial) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => !/^(never_|forbidden|denied|refus|excludes|not_shipped)/i.test(k)).map(([k, x]) => [k, stripDenial(x)])) : v

async function json(rel) {
  return JSON.parse(await readFile(`${DIR}/${rel}`, 'utf8'))
}

test('summary passes, names four offers, and never claims a paid customer', async () => {
  const summary = await json('SUMMARY.json')
  assert.equal(summary.designation, DESIGNATION)
  assert.equal(summary.pass, true)
  assert.deepEqual(summary.checks_failed, [])
  assert.deepEqual(Object.keys(summary.offers).sort(), [...OFFERS].sort())
  assert.match(summary.paid_customer_proof, /^NONE/)
  assert.equal(summary.production_untouched.cards_charged, 0)
  assert.equal(summary.production_untouched.real_customer_records_created, 0)
  assert.equal(summary.production_untouched.founder_payment_method_used, false)
  assert.equal(summary.production_untouched.sibling_repos_clean, true)
  assert.equal(summary.production_untouched.production_truth_signature_unchanged, true)
  const { court_digest_sha256, ...body } = summary
  assert.equal(court_digest_sha256, sha(canon(body)))
})

test('every offer receipt is designated TEST, carries the required fields, recomputes its digest, and is public-safe', async () => {
  const files = (await readdir(DIR)).filter((f) => f.endsWith('.zero-dollar-receipt.json'))
  assert.equal(files.length, OFFERS.length)
  for (const offer of OFFERS) {
    const r = await json(`${offer}.zero-dollar-receipt.json`)
    assert.equal(r.designation, DESIGNATION, offer)
    assert.equal(r.offer.id, offer)
    assert.equal(r.offer.cashier_touched, false, offer)
    for (const key of ['test_id', 'timestamp', 'executed_against', 'execution_status']) assert.ok(typeof r[key] === 'string' && r[key], `${offer}.${key}`)
    assert.equal(r.execution_status, 'PASS', offer)
    assert.ok(Array.isArray(r.input_provenance) && r.input_provenance.every((p) => /^[0-9a-f]{64}$/.test(p.sha256) && p.synthetic === true), `${offer} provenance`)
    for (const stage of ['checkout', 'payment_event', 'webhook', 'intake', 'order_job', 'fulfillment', 'delivery', 'receipt']) assert.ok(r.stages[stage]?.status, `${offer} stage ${stage}`)
    for (const stage of ['intake', 'order_job', 'fulfillment', 'delivery', 'receipt']) assert.equal(r.stages[stage].status, 'PASS', `${offer} ${stage}`)
    assert.ok(Array.isArray(r.delivery_artifact) && r.delivery_artifact.length >= 1 && r.delivery_artifact.every((a) => /^[0-9a-f]{64}$/.test(a.sha256)), `${offer} artifacts`)
    assert.ok(Array.isArray(r.evidence_refs) && r.evidence_refs.length >= 3, `${offer} evidence_refs`)
    assert.ok(r.product_receipt && typeof r.product_receipt === 'object', `${offer} product receipt`)
    assert.ok(r.checks.every((c) => c.ok), `${offer} checks`)
    const { court_digest_sha256, ...body } = r
    assert.equal(court_digest_sha256, sha(canon(body)), `${offer} digest`)
    const corpus = JSON.stringify(stripDenial(r))
    assert.doesNotMatch(corpus, FACTORY, `${offer} factory token`)
    assert.doesNotMatch(corpus, REAL_EMAIL, `${offer} real email`)
  }
})

test('O01 ran the real webhook path with signature verification, replay protection, and in-process fulfillment', async () => {
  const r = await json('O01.zero-dollar-receipt.json')
  assert.equal(r.stages.webhook.signature_verified, true)
  assert.equal(r.stages.webhook.bad_signature_rejected, true)
  assert.equal(r.stages.webhook.replay_duplicate, true)
  assert.equal(r.stages.payment_event.real_charge, false)
  assert.match(r.stages.order_job.mission_authority, /LOCAL/)
  assert.equal(r.stages.order_job.customer_isolation, true)
  assert.ok(r.delivery_artifact.some((a) => a.name === 'MASTER_NORMALIZED.csv'))
  assert.ok(r.delivery_artifact.some((a) => a.name === 'RECEIPT.json'))
  assert.equal(r.product_receipt.model_tool_versions.llm, 'none')
  assert.equal(r.product_receipt.offer_id, 'O01')
})

test('O02 and O05 sealed verifiable fixture receipts; the scan has no cashier and never posted a mission', async () => {
  for (const sku of ['O02', 'O05']) {
    const r = await json(`${sku}.zero-dollar-receipt.json`)
    assert.equal(r.product_receipt.fixture, true, sku)
    assert.equal(r.product_receipt.cashier.charged_via_this_repo, false, sku)
    assert.match(r.product_receipt.receipt_hash, /^[0-9a-f]{64}$/, sku)
    assert.equal(r.stages.receipt.replay_stable, true, sku)
    assert.equal(r.stages.webhook.status, 'NOT_APPLICABLE', sku)
    assert.match(r.stages.order_job.mission_source, /FIXTURE/, sku)
  }
  const scan = await json('O-PROPERTY-SCAN.zero-dollar-receipt.json')
  assert.equal(scan.offer.cashier, null)
  assert.equal(scan.offer.price_status, 'FOUNDER_SET_NO_CASHIER')
  assert.equal(scan.stages.checkout.status, 'NO_CASHIER_QUOTE_PATH')
  assert.match(scan.stages.order_job.mission_request, /mission_id null, post false/)
})
