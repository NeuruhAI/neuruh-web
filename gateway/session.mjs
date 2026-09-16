/**
 * Operator authentication for the public Command surface.
 *
 * An operator key has the shape  nko_<subject>_<43 base64url chars>  (256 bits).
 * Only its scrypt hash is configured on the gateway (NEURUH_OPERATOR_KEYS);
 * the key itself lives in the operator's password manager / macOS Keychain.
 * A verified key yields a signed session cookie; nothing else is stored.
 *
 * Rotating a subject's hash (or NEURUH_SESSION_SECRET) invalidates every
 * session minted under the old value: the cookie carries a key-version tag.
 */
import { createHash, createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'

export const SESSION_COOKIE = '__Host-neuruh_session'
export const DEFAULT_TTL_S = 12 * 3600
const KEY_RE = /^nko_([a-z0-9-]{1,32})_([A-Za-z0-9_-]{43})$/
const SCRYPT = { N: 32768, r: 8, p: 1, keylen: 32, maxmem: 64 * 1024 * 1024 }

function scrypt(secret, salt, { N, r, p, keylen, maxmem }) {
  return new Promise((resolve, reject) => {
    scryptCb(secret, salt, keylen, { N, r, p, maxmem }, (err, key) => (err ? reject(err) : resolve(key)))
  })
}

/** "scrypt$N$r$p$<salt b64url>$<hash b64url>" */
export async function hashOperatorKey(key, { salt = randomBytes(16) } = {}) {
  const dk = await scrypt(key, salt, SCRYPT)
  return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64url'), dk.toString('base64url')].join('$')
}

export function mintOperatorKey(subject) {
  if (!/^[a-z0-9-]{1,32}$/.test(subject)) throw new Error('subject must match [a-z0-9-]{1,32}')
  return `nko_${subject}_${randomBytes(32).toString('base64url')}`
}

/** NEURUH_OPERATOR_KEYS = "founder=scrypt$...;other=scrypt$..." → Map(subject → hash) */
export function parseOperatorKeys(raw) {
  const out = new Map()
  for (const entry of String(raw || '').split(';').map((s) => s.trim()).filter(Boolean)) {
    const eq = entry.indexOf('=')
    if (eq <= 0) continue
    const sub = entry.slice(0, eq).trim()
    const hash = entry.slice(eq + 1).trim()
    if (/^[a-z0-9-]{1,32}$/.test(sub) && hash.startsWith('scrypt$')) out.set(sub, hash)
  }
  return out
}

/* Same shape and cost as a real entry, built from the parameters rather than written
   out, so no hash-shaped literal ever ships in the gateway. */
const DUMMY_HASH = ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p,
  Buffer.alloc(16).toString('base64url'), Buffer.alloc(SCRYPT.keylen).toString('base64url')].join('$')

export async function verifyOperatorKey(key, operators) {
  const m = KEY_RE.exec(String(key || '').trim())
  // Always spend one scrypt so a malformed or unknown key costs the same as a wrong one.
  const sub = m ? m[1] : null
  const stored = (sub && operators.get(sub)) || DUMMY_HASH
  const [, N, r, p, saltB64, hashB64] = stored.split('$')
  const expected = Buffer.from(hashB64, 'base64url')
  const dk = await scrypt(String(key || ''), Buffer.from(saltB64, 'base64url'),
    { N: Number(N), r: Number(r), p: Number(p), keylen: expected.length, maxmem: SCRYPT.maxmem })
  const match = dk.length === expected.length && timingSafeEqual(dk, expected)
  return match && m && operators.has(sub) ? { ok: true, sub } : { ok: false }
}

/** Short tag of the hash a session was minted under; rotation changes it. */
export function keyVersion(operators, sub) {
  const h = operators.get(sub)
  return h ? createHash('sha256').update(h).digest('base64url').slice(0, 12) : null
}

function mac(secret, payload) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function mintSession(secret, { sub, kv, ttlS = DEFAULT_TTL_S, now = Date.now() }) {
  const payload = Buffer.from(JSON.stringify({
    v: 1, sub, kv, sid: randomBytes(12).toString('base64url'),
    iat: Math.floor(now / 1000), exp: Math.floor(now / 1000) + ttlS,
  })).toString('base64url')
  return `${payload}.${mac(secret, payload)}`
}

export function readSession(secret, token, operators, { now = Date.now() } = {}) {
  if (!secret || !token || typeof token !== 'string') return null
  const dot = token.indexOf('.')
  if (dot <= 0) return null
  const payload = token.slice(0, dot)
  const got = Buffer.from(token.slice(dot + 1))
  const want = Buffer.from(mac(secret, payload))
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null
  let s
  try { s = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) } catch { return null }
  if (!s || s.v !== 1 || typeof s.sub !== 'string' || !Number.isFinite(s.exp)) return null
  if (Math.floor(now / 1000) >= s.exp) return null
  if (s.kv !== keyVersion(operators, s.sub)) return null
  return s
}

export function parseCookies(header) {
  const out = {}
  for (const part of String(header || '').split(';')) {
    const eq = part.indexOf('=')
    if (eq > 0) out[part.slice(0, eq).trim()] = part.slice(eq + 1).trim()
  }
  return out
}

export function sessionCookie(token, ttlS = DEFAULT_TTL_S) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${ttlS}; HttpOnly; Secure; SameSite=Strict`
}

export function clearedSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`
}
