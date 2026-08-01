import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { access, readFile } from 'node:fs/promises'

const snapshot = JSON.parse(await readFile('public/truth/snapshot.json', 'utf8'))
const signature = JSON.parse(await readFile('public/truth/signature.json', 'utf8'))
const eventsText = await readFile('public/truth/events.jsonl', 'utf8')

test('source provenance resolves for objects, evidence, relationships, and events', async () => {
  const sources = new Map(snapshot.sources.map((source) => [source.ref, source]))
  for (const source of snapshot.sources) {
    assert.equal(source.public_safe, true)
    if (!source.path_or_uri.startsWith('git:')) await access(source.path_or_uri)
  }
  for (const object of snapshot.objects) {
    assert.ok(sources.has(object.source.ref))
    for (const ref of object.evidence_summary.source_refs) assert.ok(sources.has(ref), `${object.id}: ${ref}`)
    for (const metric of object.metrics ?? []) assert.ok(sources.has(metric.source_ref), `${object.id}: ${metric.source_ref}`)
  }
  for (const relationship of snapshot.relationships) assert.ok(sources.has(relationship.source_ref))
  for (const event of eventsText.trim().split('\n').filter(Boolean).map(JSON.parse)) assert.ok(sources.has(event.source.ref))
})

test('signature checksums match checked-in public truth files', async () => {
  const snapshotText = await readFile('public/truth/snapshot.json', 'utf8')
  const digest = (value) => createHash('sha256').update(value).digest('hex')
  assert.equal(digest(snapshotText), signature.snapshot_sha256)
  assert.equal(digest(eventsText), signature.events_sha256)
  assert.equal(signature.signature_kind, 'CHECKSUM_ONLY_NOT_IDENTITY_SIGNATURE')
})

test('compiled public truth contains no private paths or fake connectivity', async () => {
  const combined = `${await readFile('public/truth/snapshot.json', 'utf8')}\n${eventsText}`
  assert.doesNotMatch(combined, /\/(?:Users|home)\/|~\/|api[_-]?key\s*[:=]|password\s*[:=]/i)
  assert.equal(snapshot.dataset.live_connectivity, false)
})

test('semantic source index pins every canonical intake digest', async () => {
  const index = await readFile('docs/canon/SOURCE_PROVENANCE_INDEX.md', 'utf8')
  const sourcePaths = [
    'docs/source-canon/00_FindSell_Profit_Neuruh_Master_Codex_v1.pdf',
    'docs/source-canon/01_FSP_Constitution_Brand_Ethos.pdf',
    'docs/source-canon/01_NEURUH_LOCAL_AI_ESTATE_MASTER_CANONICAL_CODEX.pdf',
    'docs/source-canon/03_Latent_Cross_Domain_Emergence_and_Case_Zero_v1.0.pdf',
    'docs/source-canon/04_Jeramie_Neural_Core_Architecture_v1.0.pdf',
    'docs/source-canon/04_NEURUH_RECOVERED_ASSET_PORTFOLIO_AND_COMMERCIALIZATION_PLAYBOOK.pdf',
    'docs/source-canon/06_Adaptive_Intelligence_Visual_Atlas_v1.0.pdf',
    'docs/source-canon/06_NEURUH_THREAD_COMMANDS_EVIDENCE_AND_ARTIFACT_INDEX.pdf',
    'docs/source-canon/Neuruh_Founder_Grind_and_Persistence_Narrative_v1.0.pdf',
    'docs/source-canon/Neuruh_Galaxy_Canonical_Codex_v1.0.pdf',
    'docs/source-canon/Neuruh_Galaxy_Visual_Evidence_Dossier_v1.0.pdf',
    'docs/source-canon/Neuruh Design System.zip',
  ]
  for (const sourcePath of sourcePaths) {
    const digest = createHash('sha256').update(await readFile(sourcePath)).digest('hex')
    assert.match(index, new RegExp(`\\b${digest}\\b`), sourcePath)
  }
})
