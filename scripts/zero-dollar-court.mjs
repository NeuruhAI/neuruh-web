#!/usr/bin/env node
/**
 * ZERO-DOLLAR COMMERCIAL COURT — TEST / SANDBOX — NOT A REAL CUSTOMER — NO MONEY CHARGED
 *
 * Proves CHECKOUT → TEST PAYMENT EVENT → WEBHOOK → INTAKE → ORDER/JOB → FULFILLMENT → DELIVERY → RECEIPT
 * for the four priority offers on the SAME code paths production uses, with synthetic fixture inputs:
 *
 *   O01 Data Rescue            — the data-rescue app (fixture Stripe mode, LOCAL mission authority) on an
 *                                isolated data dir: HTTP intake → upload → priced order → HMAC-signed
 *                                checkout.session.completed to /api/webhooks/stripe → in-process fulfillment
 *                                → delivery surface → RECEIPT.json with digests.
 *   O02 Opportunity Dossier    — neuruh-fulfillment-contracts runFulfillmentE2E with a fixture Founder
 *   O05 Workflow Sprint          Runtime client and a fixture worker receipt over the sample artifact →
 *                                acceptance court → sealed, verifiable delivery receipt.
 *   O-PROPERTY-SCAN            — neuruh-property-scan `fulfil` + `quote` CLIs on the synthetic intake and
 *                                the frozen LandOS result fixture → buyer report, delivery receipt,
 *                                MISSION_REQUEST pointer (never posted), quote request (no cashier).
 *
 * Never charges a card, never touches Stripe's network, never posts to the live Founder Runtime, never
 * writes a customer record anywhere but the scratch data dir. Fails closed on any unexpected state.
 *
 *   ZDC_WORK=<scratch> O01_BASE=http://127.0.0.1:3017 OPERATOR_KEY=... node scripts/zero-dollar-court.mjs
 */
import { createHash, createHmac, randomBytes } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const DESIGNATION = 'TEST / SANDBOX — NOT A REAL CUSTOMER — NO MONEY CHARGED'
const ESTATE = path.resolve(process.env.NEURUH_ESTATE ?? path.join(process.cwd(), '..'))
const O01_BASE = (process.env.O01_BASE ?? 'http://127.0.0.1:3017').replace(/\/+$/, '')
const O01_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? 'fixture-o01-webhook-secret'
const OPERATOR_KEY = process.env.OPERATOR_KEY ?? 'zero-dollar-court'
const OUT = path.resolve(process.env.ZDC_OUT ?? 'docs/receipts-external/zero-dollar-court-20260914')
const WORK = path.resolve(process.env.ZDC_WORK ?? path.join(os.tmpdir(), 'zero-dollar-court'))
const TEST_ID = `zdc-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${randomBytes(3).toString('hex')}`
const STARTED = new Date().toISOString()
const FORBIDDEN = /\bMother\b|\bAXON\b|\bAegis\b|\bIAR\b|REI[-_ ]?X|recipe[- ]engine|scoring weights|weight vector|secret topology|system prompt|customer PII|(?:^|[\s"'`])\/(?:Users|home)\/|(?:sk|ghp|github_pat)_[A-Za-z0-9_-]{12,}/
const REAL_EMAIL = /@(?!example\.com\b|example\.invalid\b|neuruh\.com\b)[a-z0-9.-]+\.[a-z]{2,}/i  // neuruh.com = the business support address, not a customer

mkdirSync(WORK, { recursive: true })
mkdirSync(OUT, { recursive: true })

const sha = (s) => createHash('sha256').update(s).digest('hex')
const canon = (v) => (v === null || typeof v !== 'object') ? JSON.stringify(v) ?? 'null' : Array.isArray(v) ? `[${v.map(canon).join(',')}]` : `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`
const fileProv = (abs, rel) => ({ path: rel ?? abs, sha256: sha(readFileSync(abs)), bytes: statSync(abs).size, synthetic: true })
const checks = []
function check(offer, name, ok, detail) {
  checks.push({ offer, name, ok: Boolean(ok), detail: detail ?? null })
  if (!ok) console.error(`FAIL [${offer}] ${name}`, JSON.stringify(detail ?? null).slice(0, 400))
  return Boolean(ok)
}
/** Receipts legitimately name what they withhold (never_sent / never_writes lists). Strip those denial lists, then scan. */
function stripDenialLists(value) {
  if (Array.isArray(value)) return value.map(stripDenialLists)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([k]) => !/^(never_|forbidden|denied|refus|excludes|not_shipped)/i.test(k)).map(([k, v]) => [k, stripDenialLists(v)]))
  return value
}
function scanPublicSafe(offer, label, text, objects = []) {
  const corpus = [text, ...objects.map((o) => JSON.stringify(stripDenialLists(o)))].join('\n')
  check(offer, `${label}_no_factory_or_private_path`, !FORBIDDEN.test(corpus), (corpus.match(FORBIDDEN) ?? [])[0])
  check(offer, `${label}_no_real_email`, !REAL_EMAIL.test(corpus), (corpus.match(REAL_EMAIL) ?? [])[0])
}
async function api(base, method, p, body, headers = {}) {
  const res = await fetch(base + p, { method, headers: { ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...headers }, body: body !== undefined ? JSON.stringify(body) : undefined })
  const text = await res.text()
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = { raw: text.slice(0, 400) } }
  return { status: res.status, body: parsed }
}
function stageRecord(status, detail) { return { status, ...detail } }
const receipts = {}

/* ───────────────────────────── O01 DATA RESCUE (live code path) ───────────────────────────── */
async function courtO01() {
  const offer = 'O01'
  const dr = path.join(ESTATE, 'data-rescue')
  const fixtureCsv = path.join(dr, 'fixtures', 'happy.csv')
  const stages = {}
  const catalog = await api(O01_BASE, 'GET', '/api/catalog')
  check(offer, 'catalog_is_O01', catalog.status === 200 && catalog.body.offer_id === 'O01', catalog.body)
  // mode proof: fixture-pay refuses with 403 FIXTURE_ONLY unless STRIPE_MODE=fixture; a bogus order proves the mode without side effects
  const modeProbe = await api(O01_BASE, 'POST', '/api/court/fixture-pay', { order_id: 'ord_zero_dollar_probe' })
  check(offer, 'stripe_mode_is_fixture', modeProbe.status === 400 && modeProbe.body.error === 'ORDER_NOT_FOUND', modeProbe)

  const email = `${TEST_ID}@example.com`
  const intake = await api(O01_BASE, 'POST', '/api/intake', {
    tier_id: 'O01-MICRO', customer_name: 'Zero Dollar Court', company_name: 'Neuruh Court (synthetic)', email, phone: '9195550100',
    goal: `${DESIGNATION} — synthetic O01 intake ${TEST_ID}`, source_types: ['csv'], target_format: 'csv', estimated_count: '3',
    deadline: '2026-09-30', sensitive_declaration: true, scope_acknowledged: true, consent_terms: true,
  })
  check(offer, 'intake_200', intake.status === 200 && intake.body.intake_id, intake.body)
  stages.intake = stageRecord(intake.status === 200 ? 'PASS' : 'FAIL', { intake_id: intake.body.intake_id ?? null, path: 'POST /api/intake', email_domain: 'example.com' })

  const form = new FormData()
  form.set('intake_id', intake.body.intake_id ?? '')
  form.set('file', new Blob([readFileSync(fixtureCsv)], { type: 'text/csv' }), 'happy.csv')
  const upRes = await fetch(O01_BASE + '/api/upload', { method: 'POST', body: form })
  const up = { status: upRes.status, body: await upRes.json().catch(() => ({})) }
  check(offer, 'upload_200_not_rejected', up.status === 200 && up.body.rejected === false, up.body)
  const provenance = [fileProv(fixtureCsv, 'data-rescue/fixtures/happy.csv')]
  check(offer, 'upload_digest_matches_fixture', up.body.sha256 === provenance[0].sha256, { got: up.body.sha256, want: provenance[0].sha256 })

  const checkout = await api(O01_BASE, 'POST', '/api/checkout', { intake_id: intake.body.intake_id, campaign: TEST_ID })
  check(offer, 'checkout_priced_payment_pending', checkout.status === 200 && checkout.body.commercial_state === 'PAYMENT_PENDING' && checkout.body.order_id, checkout.body)
  const orderId = checkout.body.order_id
  const token = checkout.body.delivery_token
  stages.checkout = stageRecord(checkout.status === 200 ? 'PASS' : 'FAIL', { path: 'POST /api/checkout', order_id: orderId ?? null, commercial_state: checkout.body.commercial_state ?? null, pricing_total_cents: checkout.body.pricing?.total ?? null, checkout_url: checkout.body.checkout_url ?? null, note: 'fixture mode: no Stripe session is created; the public $299 cashier on neuruh.com is untouched' })

  // TEST PAYMENT EVENT → WEBHOOK: a Stripe-shaped checkout.session.completed, HMAC-signed with the fixture secret,
  // delivered to the same /api/webhooks/stripe route production uses. Signature verification is the real code path.
  const event = { id: `evt_${TEST_ID}`, type: 'checkout.session.completed', data: { object: { id: `cs_${TEST_ID}`, payment_intent: `pi_${TEST_ID}`, amount_total: checkout.body.pricing?.total ?? 0, metadata: { order_id: orderId, offer_id: 'O01', offer_version: '1', test_designation: DESIGNATION } } } }
  const payload = JSON.stringify(event)
  const t = Math.floor(Date.now() / 1000)
  const sig = `t=${t},v1=${createHmac('sha256', O01_SECRET).update(`${t}.${payload}`).digest('hex')}`
  const bad = await fetch(O01_BASE + '/api/webhooks/stripe', { method: 'POST', headers: { 'content-type': 'application/json', 'stripe-signature': `t=${t},v1=${'0'.repeat(64)}` }, body: payload })
  const badBody = await bad.json().catch(() => ({}))
  check(offer, 'webhook_rejects_bad_signature_400', bad.status === 400 && badBody.error === 'WEBHOOK_SIGNATURE_INVALID', { status: bad.status, badBody })
  const hook = await fetch(O01_BASE + '/api/webhooks/stripe', { method: 'POST', headers: { 'content-type': 'application/json', 'stripe-signature': sig }, body: payload })
  const hookBody = await hook.json().catch(() => ({}))
  check(offer, 'webhook_200_order_matched_not_duplicate', hook.status === 200 && hookBody.order_id === orderId && hookBody.duplicate === false && hookBody.type === 'checkout.session.completed', { status: hook.status, hookBody })
  const replay = await fetch(O01_BASE + '/api/webhooks/stripe', { method: 'POST', headers: { 'content-type': 'application/json', 'stripe-signature': sig }, body: payload })
  const replayBody = await replay.json().catch(() => ({}))
  check(offer, 'webhook_replay_same_event_is_duplicate', replayBody.duplicate === true && replayBody.order_id === orderId, replayBody)
  stages.payment_event = stageRecord('PASS', { event_id: event.id, type: event.type, event_sha256: sha(payload), amount_total_cents: event.data.object.amount_total, real_charge: false, source: 'synthesized fixture event, HMAC-signed with the fixture webhook secret' })
  stages.webhook = stageRecord(hook.status === 200 && replayBody.duplicate === true && bad.status === 400 ? 'PASS' : 'FAIL', { path: 'POST /api/webhooks/stripe', signature_verified: true, bad_signature_rejected: bad.status === 400, replay_duplicate: replayBody.duplicate === true, mission_request_state: hookBody.mission_request_state ?? null })

  // ORDER/JOB + FULFILLMENT: LOCAL authority runs the parse/normalize pipeline in-process on the webhook.
  let view = null
  for (let i = 0; i < 30; i++) {
    view = await api(O01_BASE, 'GET', `/api/orders/${orderId}?email=${encodeURIComponent(email)}`)
    if (view.body.fulfillment_state === 'DELIVERED' || view.body.fulfillment_state === 'FAILED') break
    await new Promise((r) => setTimeout(r, 500))
  }
  check(offer, 'order_paid', view.status === 200 && view.body.payment_state === 'succeeded', view.body)
  check(offer, 'order_fulfilled_delivered', view.body.commercial_state === 'DELIVERED' && view.body.fulfillment_state === 'DELIVERED', { commercial_state: view.body.commercial_state, fulfillment_state: view.body.fulfillment_state })
  check(offer, 'order_has_receipt', Array.isArray(view.body.receipt) && view.body.receipt.length === 1, view.body.receipt?.length)
  check(offer, 'no_founder_runtime_mission_created', !view.body.founder_runtime_mission_id, view.body.founder_runtime_mission_id ?? null)
  const foreign = await api(O01_BASE, 'GET', `/api/orders/${orderId}?email=other@example.com`)
  check(offer, 'customer_isolation_403', foreign.status === 403, foreign.status)
  stages.order_job = stageRecord(view.body.payment_state === 'succeeded' ? 'PASS' : 'FAIL', { order_id: orderId, payment_state: view.body.payment_state, commercial_state: view.body.commercial_state, mission_authority: 'LOCAL (in-process regression path; no Founder Runtime write)', customer_isolation: foreign.status === 403 })
  stages.fulfillment = stageRecord(view.body.fulfillment_state === 'DELIVERED' ? 'PASS' : 'FAIL', { fulfillment_state: view.body.fulfillment_state, recipe: 'o01-parse-normalize-v1', executed: 'in-process by the data-rescue app on the fixture upload', deliverables: view.body.deliverables ?? null })

  // DELIVERY + RECEIPT
  const del = await api(O01_BASE, 'GET', `/api/delivery/${token}`)
  check(offer, 'delivery_surface_200_with_files', del.status === 200 && Array.isArray(del.body.files) && del.body.files.includes('RECEIPT.json') && del.body.files.includes('MASTER_NORMALIZED.csv'), del.body)
  const artifacts = []
  const artifactDir = path.join(WORK, 'o01', orderId ?? 'no-order')
  mkdirSync(artifactDir, { recursive: true })
  let productReceipt = null
  for (const f of del.body.files ?? []) {
    const r = await fetch(`${O01_BASE}/api/delivery/${token}?file=${encodeURIComponent(f)}`)
    const buf = Buffer.from(await r.arrayBuffer())
    writeFileSync(path.join(artifactDir, f), buf)
    artifacts.push({ name: f, sha256: sha(buf), bytes: buf.length, http: r.status })
    if (f === 'RECEIPT.json') productReceipt = JSON.parse(buf.toString('utf8'))
  }
  const rcpt = del.body.receipt
  const digestsMatch = artifacts.every((a) => rcpt?.deliverable_digests?.[a.name] === a.sha256 || (a.name === 'RECEIPT.json' && rcpt?.deliverable_digests?.['RECEIPT.json'] === a.sha256))
  check(offer, 'delivered_artifact_digests_match_receipt', digestsMatch, { artifacts, receipt_digests: rcpt?.deliverable_digests })
  check(offer, 'receipt_input_digest_is_fixture', rcpt?.input_digest === sha(provenance[0].sha256), { got: rcpt?.input_digest, want: sha(provenance[0].sha256) })
  check(offer, 'receipt_no_llm_no_cost', rcpt?.model_tool_versions?.llm === 'none' && rcpt?.operator === 'o01-runtime', rcpt?.model_tool_versions)
  const master = artifacts.find((a) => a.name === 'MASTER_NORMALIZED.csv')
  const masterText = master ? readFileSync(path.join(artifactDir, master.name), 'utf8') : ''
  scanPublicSafe(offer, 'delivered_artifacts', masterText, [rcpt ?? {}])
  stages.delivery = stageRecord(del.status === 200 && digestsMatch ? 'PASS' : 'FAIL', { path: `GET /api/delivery/<token>`, artifacts, token_present: Boolean(token), channel: 'tokenized delivery surface (fixture); production delivery is founder email' })
  stages.receipt = stageRecord(rcpt ? 'PASS' : 'FAIL', { receipt_id: rcpt?.receipt_id ?? null, input_digest: rcpt?.input_digest ?? null, deliverable_digests: rcpt?.deliverable_digests ?? null, facts: rcpt?.facts?.length ?? 0, unknowns: rcpt?.unknowns?.length ?? 0, qa: rcpt?.qa_results ?? null, completed_at: rcpt?.completed_at ?? null })

  receipts.O01 = {
    designation: DESIGNATION, offer: { id: 'O01', name: 'Data Rescue', public_price_usd: 299, cashier: 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04', cashier_touched: false, top10_slug: 'data-rescue' },
    test_id: TEST_ID, timestamp: new Date().toISOString(), executed_against: `${O01_BASE} (data-rescue app, STRIPE_MODE=fixture, MISSION_AUTHORITY=LOCAL, isolated DATA_RESCUE_DATA_DIR, FR_API_URL dead port)`,
    input_provenance: provenance, stages, execution_status: checks.filter((c) => c.offer === offer).every((c) => c.ok) ? 'PASS' : 'FAIL',
    delivery_artifact: artifacts, product_receipt: productReceipt,
    evidence_refs: ['data-rescue/src/lib/commercial/loop.ts (handleStripeWebhook, fulfillPaidOrder)', 'data-rescue/src/app/api/webhooks/stripe/route.ts', 'data-rescue/src/app/api/delivery/[token]/route.ts', 'data-rescue/tests/commercial-loop.test.ts (52 vitest)', 'neuruh-web/apps/neuruh-web/lib/publicOffers.ts (O01 cashier, unchanged)'],
  }
}

/* ───────────────────────── O02 / O05 (fulfillment-contracts pipeline) ───────────────────────── */
async function courtContracts() {
  const fc = path.join(ESTATE, 'neuruh-fulfillment-contracts')
  const mod = async (p) => import(pathToFileURL(path.join(fc, p)).href)
  const { runFulfillmentE2E, REQUIRED_WORKER_STAGES } = await mod('src/e2e/pipeline.ts')
  const { CONTRACTS } = await mod('src/catalog.ts')
  const { verifyDeliveryReceipt } = await mod('src/delivery.ts')
  const { FounderRuntimeClient } = await mod('src/adapter/fr-client.ts')
  const { WORKER_RECEIPT_SCHEMA } = await mod('src/e2e/worker-receipt.ts')
  const MISSION = `msn_${sha(TEST_ID).slice(0, 32)}`
  let frPosts = 0
  const frClient = new FounderRuntimeClient({
    token: 'zero-dollar-court-fixture-token',
    fetchImpl: async (input, init) => {
      const url = new URL(input)
      if (url.pathname === '/v1/health') return Response.json({ status: 'ok', api_version: 'fr-api-v1', auth_configured: true })
      if (url.pathname === '/v1/missions' && init?.method === 'POST') { frPosts += 1; return Response.json({ envelope: { mission_id: MISSION, state: 'AWAITING_APPROVAL', version: 1, receipt_id: 'env_zdc_fixture', api_version: 'fr-api-v1' } }, { status: 201 }) }
      return new Response('no', { status: 404 })
    },
  })
  for (const [sku, slug, name, price, cashier, mode] of [
    ['O02', 'opportunity-intelligence-dossier', 'Opportunity Intelligence Dossier', 499, 'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05', undefined],
    ['O05', 'workflow-replacement', 'Workflow Replacement Sprint', 1250, 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06', 'BUILD'],
  ]) {
    const dir = CONTRACTS[sku].dir
    const intakePath = path.join(fc, dir, 'fixtures/e2e/buyer-intake.e2e.json')
    const artifactPath = path.join(fc, dir, 'artifacts/delivery-artifact.sample.md')
    const intake = JSON.parse(readFileSync(intakePath, 'utf8'))
    const md = readFileSync(artifactPath, 'utf8')
    const provenance = [fileProv(intakePath, `neuruh-fulfillment-contracts/${dir}/fixtures/e2e/buyer-intake.e2e.json`), fileProv(artifactPath, `neuruh-fulfillment-contracts/${dir}/artifacts/delivery-artifact.sample.md`)]
    // CHECKOUT: the hosted Stripe payment link that neuruh.com serves. It is verified reachable, never opened, never charged.
    const head = await fetch(cashier, { method: 'HEAD', redirect: 'manual' }).catch(() => ({ status: 0 }))
    check(sku, 'cashier_live_reachable', head.status >= 200 && head.status < 400, head.status)
    const paymentEvent = { id: `evt_${TEST_ID}_${sku.toLowerCase()}`, type: 'checkout.session.completed', data: { object: { id: `cs_${TEST_ID}_${sku.toLowerCase()}`, amount_total: price * 100, metadata: { offer_id: sku, test_designation: DESIGNATION } } } }
    // WEBHOOK: neuruh.com is a static export with no webhook receiver for this cashier; the founder receives Stripe's payment email. Recorded, not faked.
    const frBefore = frPosts
    // Stage 1: without a worker receipt the pipeline must stop at founder approval and fabricate nothing.
    const gated = await runFulfillmentE2E({ sku, intake, frClient, live: true, ...(mode ? { internal_mode: mode } : {}) })
    check(sku, 'stops_at_founder_approval_without_worker_receipt', gated.stop === 'FOUNDER_REQUIRED_MISSION_APPROVAL' && gated.delivery_receipt === null && gated.pointer.caller_approved === false, gated.stop)
    // Stage 2: fixture worker receipt over the sample artifact → acceptance → sealed delivery receipt.
    const workerReceipt = { schema_version: WORKER_RECEIPT_SCHEMA, founder_runtime_mission_id: MISSION, sku, job_ids: [`job-${TEST_ID}-${sku.toLowerCase()}`], stages_completed: [...REQUIRED_WORKER_STAGES[sku]], durable: true, ledger_ref: `workers://ledger/seal/${TEST_ID}-fixture`, source_role: 'WORKERS', artifact_markdown: md, artifact_sha256: sha(md), executed_at: STARTED }
    const now = new Date().toISOString()
    const r = await runFulfillmentE2E({ sku, intake, frClient, live: true, workerReceipt, externalDeliveryAuthority: `FIXTURE-GRANT:${TEST_ID}:NOT-A-FOUNDER-GRANT`, now, ...(mode ? { internal_mode: mode } : {}) })
    check(sku, 'pipeline_complete_receipted', r.stop === 'COMPLETE' && r.state === 'RECEIPTED', `${r.stop}: ${r.detail}`)
    check(sku, 'acceptance_passed', r.acceptance?.passed === true, r.acceptance)
    check(sku, 'delivery_receipt_verifies', r.delivery_receipt && verifyDeliveryReceipt(r.delivery_receipt), r.delivery_receipt?.receipt_hash)
    check(sku, 'receipt_artifact_sha_matches_fixture', r.delivery_receipt?.artifact?.sha256 === sha(md), r.delivery_receipt?.artifact)
    check(sku, 'receipt_not_charged_via_repo', r.delivery_receipt?.cashier?.charged_via_this_repo === false, r.delivery_receipt?.cashier)
    check(sku, 'receipt_marked_fixture', r.delivery_receipt?.fixture === true, r.delivery_receipt?.fixture)
    check(sku, 'mission_minted_by_fixture_fr_only', r.founder_runtime_mission_id === MISSION && frPosts > frBefore, { frPosts, MISSION })
    check(sku, 'idempotency_key_stable', typeof r.pointer.headers?.['Idempotency-Key'] === 'string' && r.pointer.headers['Idempotency-Key'].length > 0, r.pointer.headers)
    const replay = await runFulfillmentE2E({ sku, intake, frClient, live: true, workerReceipt, externalDeliveryAuthority: `FIXTURE-GRANT:${TEST_ID}:NOT-A-FOUNDER-GRANT`, now, ...(mode ? { internal_mode: mode } : {}) })
    check(sku, 'replay_same_receipt_hash', replay.delivery_receipt?.receipt_hash === r.delivery_receipt?.receipt_hash, replay.delivery_receipt?.receipt_hash)
    scanPublicSafe(sku, 'delivered_artifact', md, [r.delivery_receipt ?? {}])
    const artDir = path.join(WORK, sku.toLowerCase()); mkdirSync(artDir, { recursive: true })
    writeFileSync(path.join(artDir, 'DELIVERY_ARTIFACT.md'), md)
    writeFileSync(path.join(artDir, 'DELIVERY_RECEIPT.json'), JSON.stringify(r.delivery_receipt, null, 2))
    const ok = checks.filter((c) => c.offer === sku).every((c) => c.ok)
    receipts[sku] = {
      designation: DESIGNATION, offer: { id: sku, name, public_price_usd: price, cashier, cashier_touched: false, top10_slug: slug },
      test_id: TEST_ID, timestamp: now, executed_against: 'neuruh-fulfillment-contracts src/e2e/pipeline.ts (fixture Founder Runtime client, fixture worker receipt)',
      input_provenance: provenance,
      stages: {
        checkout: stageRecord(head.status >= 200 && head.status < 400 ? 'PASS' : 'FAIL', { cashier, live_http: head.status, opened: false, charged: false, note: 'hosted Stripe payment link served by neuruh.com; reachable, not exercised' }),
        payment_event: stageRecord('RECORDED_NOT_CONSUMED', { event: paymentEvent, real_charge: false, note: 'synthesized fixture event; no code path on neuruh.com consumes Stripe events for this cashier' }),
        webhook: stageRecord('NOT_APPLICABLE', { note: 'neuruh.com is a static export with no Stripe webhook receiver; the founder receives the Stripe payment email and starts intake by email within one business day (stated on /offers, /thank-you, product page)' }),
        intake: stageRecord('PASS', { intake_ref: r.intake_ref, schema: `${dir}/intake.schema.json`, validated_by: 'src/intake.ts validateIntake' }),
        order_job: stageRecord('PASS', { founder_runtime_mission_id: r.founder_runtime_mission_id, founder_runtime_state: r.founder_runtime_state, mission_source: 'FIXTURE Founder Runtime client (in-memory); live organ not called', idempotency_key: r.pointer.headers?.['Idempotency-Key'] ?? null, worker_job_id: r.worker.job_id }),
        fulfillment: stageRecord(r.acceptance?.passed ? 'PASS' : 'FAIL', { worker_receipt: 'FIXTURE worker receipt over the sample artifact', stages_completed: workerReceipt.stages_completed, acceptance: r.acceptance, internal_mode: mode ?? null }),
        delivery: stageRecord(r.delivery.performed ? 'PASS' : 'FAIL', { channel: r.delivery.channel, performed_in_test: r.delivery.performed, authority_label: `FIXTURE-GRANT:${TEST_ID}:NOT-A-FOUNDER-GRANT`, artifact: r.delivery_receipt?.artifact ?? null, note: 'nothing was emailed; production delivery is founder email' }),
        receipt: stageRecord(verifyDeliveryReceipt(r.delivery_receipt) ? 'PASS' : 'FAIL', { schema_version: r.delivery_receipt?.schema_version, receipt_hash: r.delivery_receipt?.receipt_hash, verify: true, replay_stable: replay.delivery_receipt?.receipt_hash === r.delivery_receipt?.receipt_hash }),
      },
      execution_status: ok ? 'PASS' : 'FAIL', delivery_artifact: [{ name: 'DELIVERY_ARTIFACT.md', sha256: sha(md), bytes: Buffer.byteLength(md) }], product_receipt: r.delivery_receipt,
      evidence_refs: [`neuruh-fulfillment-contracts/${dir}/input-contract.json`, `neuruh-fulfillment-contracts/${dir}/acceptance-criteria.json`, 'neuruh-fulfillment-contracts/src/e2e/pipeline.ts', 'neuruh-fulfillment-contracts/tests/e2e.test.ts (55 node:test)', 'neuruh-web/apps/neuruh-web/lib/publicOffers.ts (cashier, unchanged)'],
    }
  }
}

/* ───────────────────────────── PROPERTY SCAN (python pack CLI) ───────────────────────────── */
function courtPropertyScan() {
  const sku = 'O-PROPERTY-SCAN'
  const ps = path.join(ESTATE, 'neuruh-property-scan')
  const intakePath = path.join(ps, 'samples/buyer_intake.synthetic.json')
  const landosPath = path.join(ps, 'samples/landos_result_v1.synthetic.json')
  const provenance = [fileProv(intakePath, 'neuruh-property-scan/samples/buyer_intake.synthetic.json'), fileProv(landosPath, 'neuruh-property-scan/samples/landos_result_v1.synthetic.json')]
  const outDir = path.join(WORK, 'property-scan'); mkdirSync(outDir, { recursive: true })
  const run = (args) => { try { return { code: 0, out: execFileSync('python3', ['-m', 'o_property_scan.cli', ...args], { cwd: ps, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) } } catch (e) { return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` } } }
  const court = run(['court'])
  check(sku, 'pack_court_pass', court.code === 0 && /PASS/.test(court.out), court.out.slice(-300))
  const quote = run(['quote', '--buyer', `Zero Dollar Court ${TEST_ID}`, '--intake', 'samples/buyer_intake.synthetic.json'])
  check(sku, 'quote_request_ok_no_cashier', quote.code === 0, quote.out.slice(-300))
  const fulfil = run(['fulfil', '--intake', 'samples/buyer_intake.synthetic.json', '--landos-results', 'samples/landos_result_v1.synthetic.json', '--out', outDir])
  check(sku, 'fulfil_exit_0', fulfil.code === 0, fulfil.out.slice(-400))
  const read = (f) => existsSync(path.join(outDir, f)) ? JSON.parse(readFileSync(path.join(outDir, f), 'utf8')) : null
  const report = read('BUYER_REPORT.json'), rcpt = read('DELIVERY_RECEIPT.json'), mission = read('MISSION_REQUEST.json')
  check(sku, 'buyer_report_written', report && Array.isArray(report.opportunities ?? report.rows ?? report.ranked ?? null) || (report && Object.keys(report).length > 3), report ? Object.keys(report).slice(0, 12) : null)
  check(sku, 'delivery_receipt_written', rcpt && rcpt.schema_version === 'neuruh.o-property-scan.delivery-receipt.v1', rcpt?.schema_version)
  check(sku, 'mission_request_never_posted', mission && mission.mission_id === null && mission.post === false, { mission_id: mission?.mission_id, post: mission?.post })
  check(sku, 'no_cashier_no_stripe_object', /CASHIER_ONLY=BLOCKED_EXTERNAL_FOUNDER_DECISION/.test(fulfil.out) && !/stripe\.com/.test(JSON.stringify(rcpt ?? {})), null)
  const artifacts = ['BUYER_REPORT.json', 'DELIVERY_RECEIPT.json', 'MISSION_REQUEST.json'].filter((f) => existsSync(path.join(outDir, f))).map((f) => ({ name: f, sha256: sha(readFileSync(path.join(outDir, f))), bytes: statSync(path.join(outDir, f)).size, customer_facing: f !== 'MISSION_REQUEST.json' }))
  // Customer-facing artifacts are scanned. MISSION_REQUEST.json is the internal job pointer (names the runtime host); it is bound by sha256 in the delivery receipt and recorded here by digest only.
  scanPublicSafe(sku, 'delivered_artifacts', JSON.stringify(stripDenialLists(report ?? {})), [rcpt ?? {}])
  // The pack binds the pointer into the receipt with its own section-hash scheme (verified by the pack's test_receipts_reproduce court); recorded here, not recomputed.
  check(sku, 'mission_request_bound_in_receipt', /^[0-9a-f]{64}$/.test(rcpt?.mission_request_sha256 ?? '') && rcpt?.mission_posted === false, { mission_request_sha256: rcpt?.mission_request_sha256, mission_posted: rcpt?.mission_posted })
  const reportHash = (fulfil.out.match(/REPORT\s+([0-9a-f]{64})/) ?? [])[1] ?? null
  const receiptHash = (fulfil.out.match(/RECEIPT\s+([0-9a-f]{64})/) ?? [])[1] ?? null
  const ok = checks.filter((c) => c.offer === sku).every((c) => c.ok)
  receipts['O-PROPERTY-SCAN'] = {
    designation: DESIGNATION, offer: { id: 'O-PROPERTY-SCAN', name: 'Property Opportunity Scan', public_price_usd: 100, price_status: 'FOUNDER_SET_NO_CASHIER', cashier: null, cashier_touched: false, top10_slug: 'property-opportunity-scan', scope_note: 'the pack fulfils one market as a ranked list; the $100 Top 10 scan is one parcel from the same LandOS/DeedSonar capability' },
    test_id: TEST_ID, timestamp: new Date().toISOString(), executed_against: 'neuruh-property-scan o_property_scan.cli (court, quote, fulfil) at fulfillment pin 1779abf2; synthetic intake + frozen LandOS result fixture; no network',
    input_provenance: provenance,
    stages: {
      checkout: stageRecord('NO_CASHIER_QUOTE_PATH', { quote_cli_exit: quote.code, note: 'no Stripe object exists; /contact?product=property-opportunity-scan → email → written quote → invoice; CASHIER_ONLY=BLOCKED_EXTERNAL_FOUNDER_DECISION' }),
      payment_event: stageRecord('NOT_APPLICABLE', { note: 'no cashier; payment is collected from the customer by invoice when the buyer is ready' }),
      webhook: stageRecord('NOT_APPLICABLE', { note: 'no cashier, no webhook' }),
      intake: stageRecord(fulfil.code === 0 ? 'PASS' : 'FAIL', { validated_by: 'o_property_scan.intake.validate_intake', intake_id: rcpt?.intake_id ?? null }),
      order_job: stageRecord(mission?.post === false ? 'PASS' : 'FAIL', { mission_request: 'MISSION_REQUEST.json (fr_create pointer, mission_id null, post false)', idempotency: (fulfil.out.match(/idem=([\w.-]+)/) ?? [])[1] ?? null }),
      fulfillment: stageRecord(report ? 'PASS' : 'FAIL', { surface: (fulfil.out.match(/SURFACE\s+(\S+)/) ?? [])[1] ?? null, rows: (fulfil.out.match(/ROWS\s+(\d+)/) ?? [])[1] ?? null, executed: 'buyer-safe projection of the frozen LandOS result fixture (redaction court enforced)' }),
      delivery: stageRecord(report ? 'PASS' : 'FAIL', { artifacts, report_sha256: reportHash, note: 'BUYER_REPORT.json is the deliverable; production delivery is founder email' }),
      receipt: stageRecord(rcpt ? 'PASS' : 'FAIL', { schema_version: rcpt?.schema_version, receipt_sha256: receiptHash, generated_at: rcpt?.generated_at, fulfillment_pin: rcpt?.fulfillment_pin, gate: rcpt?.gate }),
    },
    execution_status: ok ? 'PASS' : 'FAIL', delivery_artifact: artifacts, product_receipt: rcpt,
    evidence_refs: ['neuruh-property-scan/contracts/delivery_receipt.v1.json', 'neuruh-property-scan/court/PACK_COURT.json', 'neuruh-property-scan/court/LANDOS_RECOURT.json (pin 1779abf2 == landos-engine main module)', 'neuruh-web/docs/receipts-external/deedsonar-tape-20260914.attestation.md (production capability, 10/15 steps, read-only)'],
  }
}

/* ───────────────────────────── run + production-untouched proof ───────────────────────────── */
const ledgerPath = path.join(ESTATE, 'data-rescue', '.data', 'ledger.json')
const before = { data_rescue_ledger_sha256: existsSync(ledgerPath) ? sha(readFileSync(ledgerPath)) : null, prod_signature: await fetch('https://neuruh.com/truth/signature.json').then((r) => r.json()).then((j) => j.snapshot_sha256).catch(() => null) }
try { await courtO01() } catch (e) { check('O01', 'court_threw', false, String(e)) }
try { await courtContracts() } catch (e) { check('O02', 'court_threw', false, String(e)) }
try { courtPropertyScan() } catch (e) { check('O-PROPERTY-SCAN', 'court_threw', false, String(e)) }
const after = { data_rescue_ledger_sha256: existsSync(ledgerPath) ? sha(readFileSync(ledgerPath)) : null, prod_signature: await fetch('https://neuruh.com/truth/signature.json').then((r) => r.json()).then((j) => j.snapshot_sha256).catch(() => null) }
const porcelain = Object.fromEntries(['data-rescue', 'neuruh-fulfillment-contracts', 'neuruh-property-scan'].map((r) => [r, execFileSync('git', ['status', '--porcelain'], { cwd: path.join(ESTATE, r), encoding: 'utf8' }).trim()]))
const untouched = {
  data_rescue_repo_ledger_unchanged: before.data_rescue_ledger_sha256 === after.data_rescue_ledger_sha256, data_rescue_ledger_sha256: after.data_rescue_ledger_sha256,
  test_data_dir: WORK, sibling_repos_clean: Object.values(porcelain).every((v) => v === ''), porcelain,
  production_truth_signature_unchanged: before.prod_signature === after.prod_signature, production_truth_signature: after.prod_signature,
  stripe_network: 'never called (STRIPE_MODE=fixture; hosted payment links only HEAD-probed)', founder_runtime_live_organ: 'never called (O01 LOCAL authority with FR_API_URL=127.0.0.1:1; O02/O05 in-memory fixture client; property-scan pointer never posted)',
  cards_charged: 0, real_customer_records_created: 0, founder_payment_method_used: false,
}
check('ALL', 'production_untouched', untouched.data_rescue_repo_ledger_unchanged && untouched.sibling_repos_clean && untouched.production_truth_signature_unchanged, untouched)

const summary = {
  court: 'zero-dollar-commercial-court', designation: DESIGNATION, test_id: TEST_ID, started_at: STARTED, finished_at: new Date().toISOString(),
  offers: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, { execution_status: v.execution_status, stages: Object.fromEntries(Object.entries(v.stages).map(([s, r]) => [s, r.status])) }])),
  checks_total: checks.length, checks_failed: checks.filter((c) => !c.ok).map((c) => `${c.offer}:${c.name}`), production_untouched: untouched, pass: checks.every((c) => c.ok),
  paid_customer_proof: 'NONE — this court proves the technical tape in test mode; the first real customer transaction remains outstanding',
}
/** Vendored receipts must not carry token-shaped literals (delivery tokens, idempotency keys, resume tokens): the secret
 *  scanner is right to refuse them. They are recorded as sha256 digests so the evidence stays verifiable against the
 *  scratch originals without a copyable credential in the public repository. */
const TOKEN_KEY = /token|idempotenc|secret|api[_-]?key|authorization|password/i
function redactTokens(value, log, trail = '') {
  if (Array.isArray(value)) return value.map((v, i) => redactTokens(v, log, `${trail}[${i}]`))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => {
    if (TOKEN_KEY.test(k) && typeof v === 'string' && v.length >= 16) { log.push(`${trail}.${k}`); return [k, `redacted:sha256:${sha(v).slice(0, 24)}`] }
    if (TOKEN_KEY.test(k) && typeof v === 'boolean') return [k, v]
    return [k, redactTokens(v, log, `${trail}.${k}`)]
  }))
  return value
}
for (const [k, v] of Object.entries(receipts)) {
  const redactions = []
  const body = { ...redactTokens({ ...v, checks: checks.filter((c) => c.offer === k) }, redactions), redactions: { note: 'token-shaped values replaced by sha256 digests before vendoring; originals live only in the scratch work dir', paths: redactions } }
  const sealed = { ...body, court_digest_sha256: sha(canon(body)) }
  writeFileSync(path.join(OUT, `${k}.zero-dollar-receipt.json`), JSON.stringify(sealed, null, 2) + '\n')
}
writeFileSync(path.join(OUT, 'SUMMARY.json'), JSON.stringify({ ...summary, court_digest_sha256: sha(canon(summary)) }, null, 2) + '\n')
console.log(JSON.stringify({ pass: summary.pass, test_id: TEST_ID, offers: summary.offers, checks_total: summary.checks_total, failed: summary.checks_failed, out: OUT }, null, 2))
process.exit(summary.pass ? 0 : 1)
