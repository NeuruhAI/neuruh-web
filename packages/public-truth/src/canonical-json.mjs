import { createHash } from 'node:crypto'

export function sortCanonical(value) {
  if (Array.isArray(value)) return value.map(sortCanonical)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, sortCanonical(value[key])]),
    )
  }
  return value
}

export function canonicalJson(value) {
  return `${JSON.stringify(sortCanonical(value), null, 2)}\n`
}

export function canonicalLine(value) {
  return JSON.stringify(sortCanonical(value))
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

