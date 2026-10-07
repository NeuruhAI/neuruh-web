import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { canonicalJson, canonicalLine, sha256, sortCanonical } from './canonical-json.mjs'
import { assertNoPrivateLeakage, stripForbiddenPrivateFields } from './privacy.mjs'
import { assertClassifiedNumbers, validatePublicEvent, validatePublicObject, validateSource } from './validator.mjs'
import { deriveLivingState } from './state-machine.mjs'

function exactKeys(value, allowed, label) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw new Error(`${label} contains unallowlisted field ${key}`)
}

function hydrateSource(sourceRef, sources, label) {
  if (!sourceRef) throw new Error(`${label} missing source`)
  const source = sources.find((candidate) => candidate.ref === sourceRef)
  if (!source) throw new Error(`${label} references unknown source ${sourceRef}`)
  validateSource(source, `${label} source`)
  return source
}

function compareId(a, b) {
  return String(a.id ?? a.event_id).localeCompare(String(b.id ?? b.event_id))
}

export function compileTruth(rawInput, { evaluationTime } = {}) {
  const redactions = []
  const input = stripForbiddenPrivateFields(structuredClone(rawInput), redactions)
  exactKeys(input, ['schema_version', 'dataset', 'sources', 'objects', 'relationships', 'events'], 'truth input')
  if (!input.dataset?.truth_mode) throw new Error('dataset missing truth_mode')
  if (!input.dataset?.last_verified_at || !input.dataset?.stale_after || !input.dataset?.generated_at) throw new Error('dataset missing timestamp')
  if (!input.dataset?.source_ref) throw new Error('dataset missing source')
  if (input.dataset.live_connectivity !== false) throw new Error('live connectivity is not authorized')
  const now = evaluationTime ?? input.dataset.generated_at
  if (Number.isNaN(Date.parse(now))) throw new Error('evaluationTime must be an ISO timestamp')
  if (Date.parse(now) > Date.parse(input.dataset.stale_after)) throw new Error('stale snapshot rejected')
  const stale = Date.parse(now) > Date.parse(input.dataset.last_verified_at)
  const datasetSource = hydrateSource(input.dataset.source_ref, input.sources, 'dataset')

  const objects = input.objects.map((object) => {
    if (!object.truth_mode) throw new Error(`public object ${object.id ?? 'unknown'} missing truth_mode`)
    if (!object.last_verified_at) throw new Error(`public object ${object.id ?? 'unknown'} missing timestamp`)
    const source = hydrateSource(object.source_ref, input.sources, `public object ${object.id ?? 'unknown'}`)
    const { source_ref: _sourceRef, ...publicObject } = object
    const hydrated = { ...publicObject, source }
    validatePublicObject(hydrated)
    return hydrated
  }).sort(compareId)

  const objectIds = new Set(objects.map((object) => object.id))
  const relationships = input.relationships.map((relationship) => {
    exactKeys(relationship, ['id', 'type', 'source_id', 'target_id', 'direction', 'truth_mode', 'observed_at', 'source_ref', 'limitations'], `relationship ${relationship.id}`)
    for (const key of ['id', 'type', 'source_id', 'target_id', 'direction', 'truth_mode', 'observed_at', 'source_ref']) {
      if (!relationship[key]) throw new Error(`relationship ${relationship.id ?? 'unknown'} missing ${key}`)
    }
    if (!objectIds.has(relationship.source_id) || !objectIds.has(relationship.target_id)) throw new Error(`relationship ${relationship.id} has unresolved endpoint`)
    hydrateSource(relationship.source_ref, input.sources, `relationship ${relationship.id}`)
    assertClassifiedNumbers(relationship)
    return relationship
  }).sort(compareId)

  const events = input.events.map((event) => {
    if (!event.truth_mode) throw new Error(`public event ${event.event_id ?? 'unknown'} missing truth_mode`)
    if (!event.occurred_at) throw new Error(`public event ${event.event_id ?? 'unknown'} missing timestamp`)
    const source = hydrateSource(event.source_ref, input.sources, `public event ${event.event_id ?? 'unknown'}`)
    const { source_ref: _sourceRef, ...eventBody } = event
    const checksum = sha256(canonicalLine({ ...eventBody, source }))
    const hydrated = { ...eventBody, source, checksum }
    validatePublicEvent(hydrated)
    return hydrated
  }).sort((a, b) => a.occurred_at.localeCompare(b.occurred_at) || a.event_id.localeCompare(b.event_id))

  const snapshot = {
    schema_version: input.schema_version,
    dataset: {
      id: input.dataset.id,
      label: input.dataset.label,
      truth_mode: input.dataset.truth_mode,
      generated_at: input.dataset.generated_at,
      last_verified_at: input.dataset.last_verified_at,
      stale_after: input.dataset.stale_after,
      stale,
      live_connectivity: false,
      limitation: input.dataset.limitation,
      source: datasetSource,
    },
    living_state: 'DORMANT',
    sources: input.sources.map((source) => sortCanonical(source)).sort((a, b) => a.ref.localeCompare(b.ref)),
    objects,
    relationships,
  }
  snapshot.living_state = deriveLivingState(snapshot)
  assertNoPrivateLeakage(snapshot)
  assertNoPrivateLeakage(events)

  const snapshotText = canonicalJson(snapshot)
  const eventsText = events.length ? `${events.map(canonicalLine).join('\n')}\n` : ''
  const signatureBase = {
    schema_version: input.schema_version,
    signature_kind: 'CHECKSUM_ONLY_NOT_IDENTITY_SIGNATURE',
    algorithm: 'SHA-256',
    generated_at: input.dataset.generated_at,
    snapshot_sha256: sha256(snapshotText),
    events_sha256: sha256(eventsText),
    limitation: 'No signing key or production connector is present in P1.',
  }
  const signature = { ...signatureBase, manifest_sha256: sha256(canonicalLine(signatureBase)) }
  const signatureText = canonicalJson(signature)
  return { snapshot: sortCanonical(snapshot), events: events.map(sortCanonical), signature: sortCanonical(signature), snapshotText, eventsText, signatureText, redactions: [...new Set(redactions)].sort() }
}

export async function compileTruthFile(inputPath, outputDir, options = {}) {
  const rawInput = JSON.parse(await readFile(inputPath, 'utf8'))
  const compiled = compileTruth(rawInput, options)
  await mkdir(outputDir, { recursive: true })
  await Promise.all([
    writeFile(path.join(outputDir, 'snapshot.json'), compiled.snapshotText),
    writeFile(path.join(outputDir, 'events.jsonl'), compiled.eventsText),
    writeFile(path.join(outputDir, 'signature.json'), compiled.signatureText),
  ])
  return compiled
}
