export const TRUTH_MODES = ['LIVE', 'VERIFIED_SNAPSHOT', 'SANDBOX', 'CONCEPTUAL', 'PLANNED', 'BLOCKED', 'UNKNOWN']
export const CLAIM_CLASSES = ['THREAD_CONFIRMED', 'OBSERVED', 'ARCHITECTURE', 'PROPOSED_IMPLEMENTATION', 'HYPOTHESIS', 'UNVALIDATED_CLAIM']
export const NUMBER_CLASSES = ['MEASURED', 'OBSERVED', 'DERIVED', 'BUDGET', 'HISTORICAL']
export const SOURCE_CLASSES = ['signed_manifest', 'git_release', 'deployment_receipt', 'health_endpoint', 'benchmark', 'decision_receipt', 'canonical_document', 'public_research_record', 'curated_snapshot']

const OBJECT_KEYS = new Set(['id', 'kind', 'name', 'summary', 'truth_mode', 'claim_class', 'maturity', 'status', 'last_verified_at', 'source', 'evidence_summary', 'public_route', 'relationships', 'contradictions', 'receipts', 'metrics', 'next_public_milestone', 'limitations'])
const EVENT_KEYS = new Set(['event_id', 'event_type', 'occurred_at', 'truth_mode', 'subject_id', 'public_summary', 'source', 'checksum', 'authority', 'reversibility', 'receipt_ref', 'limitations'])
const REQUIRED_OBJECT = ['id', 'kind', 'name', 'summary', 'truth_mode', 'claim_class', 'maturity', 'status', 'last_verified_at', 'source', 'evidence_summary', 'public_route', 'limitations']
const REQUIRED_EVENT = ['event_id', 'event_type', 'occurred_at', 'truth_mode', 'subject_id', 'public_summary', 'source', 'checksum']

function required(value, key, kind) {
  if (value === undefined || value === null || value === '') throw new Error(`${kind} missing required ${key}`)
}

function assertExactKeys(value, allowed, kind) {
  for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error(`${kind} contains unallowlisted field ${key}`)
}

function assertTimestamp(value, label) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new Error(`${label} must be an ISO timestamp`)
}

export function validateSource(source, label = 'source') {
  required(source, label, label)
  assertExactKeys(source, new Set(['ref', 'class', 'title', 'path_or_uri', 'public_safe']), label)
  for (const key of ['ref', 'class', 'title', 'path_or_uri', 'public_safe']) required(source[key], key, label)
  if (!SOURCE_CLASSES.includes(source.class)) throw new Error(`${label} has invalid class`)
  if (source.public_safe !== true) throw new Error(`${label} must be public_safe`)
  return true
}

export function assertClassifiedNumbers(value, path = '$', metricEnvelope = false) {
  if (typeof value === 'number') {
    if (!metricEnvelope) throw new Error(`unclassified number rejected at ${path}`)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertClassifiedNumbers(item, `${path}[${index}]`, false))
    return
  }
  if (!value || typeof value !== 'object') return
  const isMetric = Object.hasOwn(value, 'value') && typeof value.value === 'number'
  if (isMetric) {
    for (const key of ['classification', 'unit', 'as_of', 'source_ref']) required(value[key], key, 'metric')
    if (!NUMBER_CLASSES.includes(value.classification)) throw new Error(`metric has invalid classification at ${path}`)
    assertTimestamp(value.as_of, `${path}.as_of`)
  }
  for (const [key, child] of Object.entries(value)) {
    assertClassifiedNumbers(child, `${path}.${key}`, isMetric && key === 'value')
  }
}

export function validatePublicObject(object) {
  if (!object || typeof object !== 'object' || Array.isArray(object)) throw new Error('public object must be an object')
  assertExactKeys(object, OBJECT_KEYS, 'public object')
  REQUIRED_OBJECT.forEach((key) => required(object[key], key, 'public object'))
  if (!TRUTH_MODES.includes(object.truth_mode)) throw new Error('public object missing or invalid truth_mode')
  if (!CLAIM_CLASSES.includes(object.claim_class)) throw new Error('public object has invalid claim_class')
  assertTimestamp(object.last_verified_at, 'public object last_verified_at')
  validateSource(object.source, 'public object source')
  if (!object.evidence_summary?.source_refs?.length) throw new Error('public object evidence_summary requires source refs')
  for (const contradiction of object.contradictions ?? []) {
    if (contradiction.status !== 'UNRESOLVED' || !contradiction.supporting_sources?.length || !contradiction.opposing_sources?.length) {
      throw new Error('contradiction must preserve supporting and opposing sources')
    }
  }
  assertClassifiedNumbers(object)
  return true
}

export function validatePublicEvent(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) throw new Error('public event must be an object')
  assertExactKeys(event, EVENT_KEYS, 'public event')
  REQUIRED_EVENT.forEach((key) => required(event[key], key, 'public event'))
  if (!TRUTH_MODES.includes(event.truth_mode)) throw new Error('public event missing or invalid truth_mode')
  assertTimestamp(event.occurred_at, 'public event occurred_at')
  validateSource(event.source, 'public event source')
  if (!/^[a-f0-9]{64}$/.test(event.checksum)) throw new Error('public event checksum must be SHA-256')
  assertClassifiedNumbers(event)
  return true
}

