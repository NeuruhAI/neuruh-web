/**
 * neuruh.gateway-origin.v1 — the signed hop from the public gateway to the
 * private organism origin (Command's gateway-origin listener).
 *
 * The origin routes ONLY on the signed target, never on the transport URL, so
 * a proxy that normalises the request line (Cloudflare edge, cloudflared)
 * cannot change what the origin serves without breaking the signature.
 *
 * The verifier lives in NeuruhAI/neuruh-cockpit cockpit/gateway-origin.js.
 * Both repos pin the same test vector (CONTRACT_VECTOR below) so the two
 * implementations cannot drift apart silently.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export const CONTRACT = 'neuruh.gateway-origin.v1'
export const MAX_SKEW_MS = 60_000

export const HEADERS = Object.freeze({
  version: 'x-neuruh-gw-v',
  ts: 'x-neuruh-gw-ts',
  nonce: 'x-neuruh-gw-nonce',
  sub: 'x-neuruh-gw-sub',
  target: 'x-neuruh-gw-target',
  sig: 'x-neuruh-gw-sig',
})

export function sha256Hex(body) {
  return createHash('sha256').update(body || Buffer.alloc(0)).digest('hex')
}

export function canonical({ method, target, ts, nonce, sub, bodySha256 }) {
  return [CONTRACT, String(method).toUpperCase(), target, String(ts), nonce, sub, bodySha256].join('\n')
}

export function signature(secret, parts) {
  return createHmac('sha256', secret).update(canonical(parts)).digest('base64url')
}

/** Headers for one signed origin request. `target` is path + query, e.g. "/api/live/events?limit=20". */
export function signRequest(secret, { method, target, sub, body, now = Date.now(), nonce = randomBytes(16).toString('base64url') }) {
  if (!secret) throw new Error('gateway origin secret is not configured')
  if (typeof target !== 'string' || !target.startsWith('/')) throw new Error('signed target must be an absolute path')
  const parts = { method, target, ts: now, nonce, sub, bodySha256: sha256Hex(body) }
  return {
    [HEADERS.version]: '1',
    [HEADERS.ts]: String(now),
    [HEADERS.nonce]: nonce,
    [HEADERS.sub]: sub,
    [HEADERS.target]: target,
    [HEADERS.sig]: signature(secret, parts),
  }
}

/** Reference verifier (the origin carries its own copy; this one backs the tests). */
export function verifyRequest(secret, { method, headers, body, now = Date.now() }) {
  const h = (k) => headers[k] ?? headers[k.toLowerCase()]
  if (h(HEADERS.version) !== '1') return { ok: false, reason: 'contract_version' }
  const ts = Number(h(HEADERS.ts))
  if (!Number.isFinite(ts) || Math.abs(now - ts) > MAX_SKEW_MS) return { ok: false, reason: 'stale_or_future' }
  const nonce = h(HEADERS.nonce); const sub = h(HEADERS.sub); const target = h(HEADERS.target); const sig = h(HEADERS.sig)
  if (!nonce || !sub || !target || !sig) return { ok: false, reason: 'missing_header' }
  const expected = Buffer.from(signature(secret, { method, target, ts, nonce, sub, bodySha256: sha256Hex(body) }))
  const got = Buffer.from(String(sig))
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return { ok: false, reason: 'bad_signature' }
  return { ok: true, target, sub, nonce }
}

/* Pinned in both repos. If either side changes the canonical string, this breaks. */
export const CONTRACT_VECTOR = Object.freeze({
  secret: 'neuruh-contract-vector-secret-do-not-use',
  method: 'GET',
  target: '/api/live/events?limit=5&signal=1',
  ts: 1789000000000,
  nonce: 'AAAAAAAAAAAAAAAAAAAAAA',
  sub: 'founder',
  body: '',
})
