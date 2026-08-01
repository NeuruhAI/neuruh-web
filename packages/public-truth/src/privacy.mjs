export const FORBIDDEN_PRIVATE_KEYS = new Set([
  'secret', 'secrets', 'token', 'tokens', 'api_key', 'credentials', 'password',
  'private_path', 'private_paths', 'customer_data', 'personal_sensitive_data',
  'unreviewed_claims', 'private_memory', 'defense_details', 'internal_notes',
])

const PRIVATE_VALUE_PATTERNS = [
  /(?:^|\s)\/(?:Users|home)\//i,
  /(?:^|\s)~\//,
  /(?:api[_-]?key|password|bearer)\s*[:=]\s*\S+/i,
  /(?:sk|ghp|github_pat)_[A-Za-z0-9_-]{12,}/,
]

export function stripForbiddenPrivateFields(value, redactions = []) {
  if (Array.isArray(value)) return value.map((item) => stripForbiddenPrivateFields(item, redactions))
  if (!value || typeof value !== 'object') return value
  const safe = {}
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_PRIVATE_KEYS.has(key.toLowerCase())) {
      redactions.push(key)
      continue
    }
    safe[key] = stripForbiddenPrivateFields(child, redactions)
  }
  return safe
}

export function assertNoPrivateLeakage(value, path = '$') {
  if (typeof value === 'string') {
    for (const pattern of PRIVATE_VALUE_PATTERNS) {
      if (pattern.test(value)) throw new Error(`private reference rejected at ${path}`)
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoPrivateLeakage(item, `${path}[${index}]`))
    return
  }
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_PRIVATE_KEYS.has(key.toLowerCase())) throw new Error(`forbidden private field survived at ${path}.${key}`)
    assertNoPrivateLeakage(child, `${path}.${key}`)
  }
}

