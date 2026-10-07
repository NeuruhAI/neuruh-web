import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { compileTruth } from '../packages/public-truth/src/compiler.mjs'
import { validatePublicEvent, validatePublicObject } from '../packages/public-truth/src/validator.mjs'

const fixture = JSON.parse(await readFile('packages/public-truth/fixtures/verified-snapshot.input.json', 'utf8'))
const options = { evaluationTime: '2026-08-01T22:00:00.000Z' }

function clone() {
  return structuredClone(fixture)
}

test('public object schema and validator accept every compiled object', async () => {
  const schema = JSON.parse(await readFile('docs/canon/PUBLIC_OBJECT_SCHEMA.json', 'utf8'))
  assert.ok(schema.required.includes('truth_mode'))
  assert.ok(schema.required.includes('source'))
  for (const object of compileTruth(clone(), options).snapshot.objects) assert.equal(validatePublicObject(object), true)
})

test('public event schema and validator accept every compiled event', async () => {
  const schema = JSON.parse(await readFile('docs/canon/PUBLIC_TRUTH_EVENT_SCHEMA.json', 'utf8'))
  assert.ok(schema.required.includes('occurred_at'))
  assert.ok(schema.required.includes('checksum'))
  for (const event of compileTruth(clone(), options).events) assert.equal(validatePublicEvent(event), true)
})

test('privacy leakage fields are stripped and residual private values fail closed', () => {
  const withPrivateFields = clone()
  withPrivateFields.objects[0].private_paths = ['/Users/example/private']
  withPrivateFields.objects[0].secret = 'sk_not_public'
  const compiled = compileTruth(withPrivateFields, options)
  assert.deepEqual(compiled.redactions, ['private_paths', 'secret'])
  assert.doesNotMatch(compiled.snapshotText, /Users\/example|sk_not_public/)

  const withPrivateValue = clone()
  withPrivateValue.sources[0].title = '/Users/example/private-source'
  assert.throws(() => compileTruth(withPrivateValue, options), /private reference rejected/)
})

test('missing truth mode fails closed', () => {
  const input = clone()
  delete input.objects[0].truth_mode
  assert.throws(() => compileTruth(input, options), /missing truth_mode/)
})

test('missing source fails closed', () => {
  const input = clone()
  delete input.events[0].source_ref
  assert.throws(() => compileTruth(input, options), /missing source/)
})

test('unclassified number fails closed', () => {
  const input = clone()
  input.objects[0].metrics = [{ name: 'unsafe-count', value: 12 }]
  assert.throws(() => compileTruth(input, options), /metric missing required classification/)
})

test('stale snapshot fails closed using injected evaluation time', () => {
  assert.throws(() => compileTruth(clone(), { evaluationTime: '2026-10-17T00:00:00.000Z' }), /stale snapshot rejected/)
})

test('evaluation after last_verified marks the snapshot stale without hiding CONTRADICTING', () => {
  const compiled = compileTruth(clone(), { evaluationTime: '2026-09-16T12:45:01.000Z' })
  assert.equal(compiled.snapshot.dataset.stale, true)
  assert.equal(compiled.snapshot.living_state, 'CONTRADICTING')
  assert.equal(compiled.snapshot.dataset.live_connectivity, false)
  assert.match(compiled.snapshot.dataset.limitation, /Not a live feed/)
})

test('evaluation at last_verified does not mark the snapshot stale', () => {
  const compiled = compileTruth(clone(), { evaluationTime: '2026-09-16T12:45:00.000Z' })
  assert.equal(compiled.snapshot.dataset.stale, false)
  assert.equal(compiled.snapshot.living_state, 'CONTRADICTING')
})

test('output is byte deterministic', () => {
  const first = compileTruth(clone(), options)
  const second = compileTruth(clone(), options)
  assert.equal(first.snapshotText, second.snapshotText)
  assert.equal(first.eventsText, second.eventsText)
  assert.equal(first.signatureText, second.signatureText)
})

test('contradiction preservation retains both source sets', () => {
  const galaxy = compileTruth(clone(), options).snapshot.objects.find((object) => object.id === 'galaxy')
  assert.equal(galaxy.contradictions[0].status, 'UNRESOLVED')
  assert.deepEqual(galaxy.contradictions[0].supporting_sources, ['src-galaxy-canon'])
  assert.deepEqual(galaxy.contradictions[0].opposing_sources, ['src-alive-ruling'])
})

test('verified fixture never presents fake live state', () => {
  const compiled = compileTruth(clone(), options)
  assert.equal(compiled.snapshot.dataset.live_connectivity, false)
  assert.notEqual(compiled.snapshot.dataset.truth_mode, 'LIVE')
  assert.equal(compiled.snapshot.objects.some((object) => object.truth_mode === 'LIVE'), false)
  assert.equal(compiled.events.some((event) => event.truth_mode === 'LIVE'), false)
  assert.equal(compiled.signature.signature_kind, 'CHECKSUM_ONLY_NOT_IDENTITY_SIGNATURE')
})

test('served public snapshot is compiled at its own verification instant and still admits CONTRADICTING', async () => {
  // 2026-09-16 recourt: the snapshot is compiled at the moment it was re-verified, so it is not
  // stale when served; the preserved contradiction and the absent live connector stay visible.
  const served = JSON.parse(await readFile('public/truth/snapshot.json', 'utf8'))
  const pkg = JSON.parse(await readFile('package.json', 'utf8'))
  assert.equal(pkg.scripts['compile:truth'].match(/--as-of=(\S+)/)[1], served.dataset.last_verified_at)
  assert.equal(served.dataset.stale, false)
  assert.equal(served.living_state, 'CONTRADICTING')
  assert.equal(served.dataset.live_connectivity, false)
  assert.equal(served.dataset.last_verified_at.slice(0, 10), '2026-09-16')
  assert.notEqual(served.dataset.truth_mode, 'LIVE')
})

