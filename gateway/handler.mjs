/**
 * NEURUH GATEWAY — the only public boundary in front of the organism.
 *
 *   browser → https://neuruh.com/command (this gateway: operator session)
 *           → signed request (neuruh.gateway-origin.v1) over the origin tunnel
 *           → Command's gateway-origin listener on the organism host
 *           → the organism's ledgers, stores and loopback services.
 *
 * The gateway holds no organism state and computes no truth: it authenticates,
 * refuses anything that is not a Command read route, signs what it forwards,
 * streams the answer back, and guarantees no loopback URL reaches the browser.
 * It never forwards to Governance, Founder Runtime, Workers, Sentinel, IAR or
 * any other organ directly; Command's read models are the only thing it can
 * reach, and they cannot execute.
 */
import { signRequest } from './contract.mjs'
import { classify } from './routes.mjs'
import { isScrubbable, scrubText, sseScrubber } from './scrub.mjs'
import { loginPage, originOfflinePage } from './pages.mjs'
import {
  SESSION_COOKIE, DEFAULT_TTL_S, clearedSessionCookie, keyVersion, mintSession,
  parseCookies, parseOperatorKeys, readSession, sessionCookie, verifyOperatorKey,
} from './session.mjs'

export const GATEWAY_VERSION = 'neuruh-gateway/1'
const ORIGIN_TIMEOUT_MS = 20_000
const CHAT_TIMEOUT_MS = 185_000

/* The Command page runs inline script and style (its own), loads its assets from
   this origin and the Draco decoder from gstatic (3D view), and talks to nothing
   else. connect-src 'self' makes "the browser never touches a loopback port" a
   rule the browser enforces, not just a promise. */
export const COMMAND_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.gstatic.com",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
].join('; ')
const PAGE_CSP = "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}
const PASS_HEADERS = ['content-type', 'etag', 'last-modified', 'x-neuruh-origin', 'x-neuruh-origin-head', 'x-neuruh-origin-sub']

export function readConfig(env = process.env) {
  const operators = parseOperatorKeys(env.NEURUH_OPERATOR_KEYS)
  const sessionSecret = env.NEURUH_SESSION_SECRET || ''
  const originUrl = String(env.NEURUH_ORIGIN_URL || '').replace(/\/+$/, '')
  const originSecret = env.NEURUH_GATEWAY_ORIGIN_SECRET || ''
  const ttlS = Math.max(300, Math.min(7 * 86400, Number(env.NEURUH_SESSION_TTL_S) || DEFAULT_TTL_S))
  const cfAccess = env.NEURUH_CF_ACCESS_CLIENT_ID && env.NEURUH_CF_ACCESS_CLIENT_SECRET
    ? { 'CF-Access-Client-Id': env.NEURUH_CF_ACCESS_CLIENT_ID, 'CF-Access-Client-Secret': env.NEURUH_CF_ACCESS_CLIENT_SECRET }
    : null
  const problems = []
  if (!operators.size) problems.push('NEURUH_OPERATOR_KEYS has no operator')
  if (Buffer.byteLength(sessionSecret) < 32) problems.push('NEURUH_SESSION_SECRET missing or < 32 bytes')
  if (!/^https:\/\/[^/]+$/.test(originUrl) && !/^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(originUrl)) problems.push('NEURUH_ORIGIN_URL must be an https origin')
  if (Buffer.byteLength(originSecret) < 32) problems.push('NEURUH_GATEWAY_ORIGIN_SECRET missing or < 32 bytes')
  return {
    operators, sessionSecret, originUrl, originSecret, ttlS, cfAccess,
    authConfigured: operators.size > 0 && Buffer.byteLength(sessionSecret) >= 32,
    originConfigured: problems.filter((p) => /ORIGIN/.test(p)).length === 0,
    problems,
    deployment: env.VERCEL_GIT_COMMIT_SHA || env.VERCEL_DEPLOYMENT_ID || null,
    region: env.VERCEL_REGION || null,
  }
}

function withHeaders(extra = {}) {
  return { ...SECURITY_HEADERS, 'Cache-Control': 'no-store', ...extra }
}
function json(status, body, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: withHeaders({ 'Content-Type': 'application/json; charset=utf-8', ...extra }) })
}
function html(status, body, extra = {}) {
  return new Response(body, { status, headers: withHeaders({ 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': PAGE_CSP, ...extra }) })
}
function redirect(location, status = 303, extra = {}) {
  return new Response(null, { status, headers: withHeaders({ Location: location, ...extra }) })
}

/** Only relative in-app destinations survive a login redirect. */
export function safeNext(next) {
  const s = String(next || '')
  return /^\/command(?:#[\w\-/%.~]*)?$/.test(s) ? s : '/command'
}

/**
 * Same-origin check for state-changing requests (sign-in, sign-out, Presence POSTs).
 *
 * Sec-Fetch-Site comes first: it is set by the browser, cannot be forged by a page, and
 * stays accurate when Origin does not — a page served with Referrer-Policy: no-referrer
 * (as these are) makes Chrome send "Origin: null" on its own form submissions. Origin is
 * the fallback for clients that send no fetch metadata at all, and a request with neither
 * is refused.
 */
function sameOrigin(request, url) {
  const site = request.headers.get('sec-fetch-site')
  if (site) return site === 'same-origin' || site === 'none'
  const o = request.headers.get('origin')
  return Boolean(o) && o === url.origin
}

async function readForm(request) {
  const type = request.headers.get('content-type') || ''
  const text = (await request.text()).slice(0, 4096)
  if (type.includes('application/json')) { try { return JSON.parse(text) } catch { return {} } }
  return Object.fromEntries(new URLSearchParams(text))
}

export function createGateway(env = process.env, deps = {}) {
  const cfg = readConfig(env)
  const doFetch = deps.fetch || globalThis.fetch
  const now = deps.now || (() => Date.now())
  const failDelay = deps.failDelayMs ?? 400

  function currentSession(request) {
    const token = parseCookies(request.headers.get('cookie'))[SESSION_COOKIE]
    return readSession(cfg.sessionSecret, token, cfg.operators, { now: now() })
  }

  async function toOrigin({ method, target, sub, body = null, accept, timeoutMs = ORIGIN_TIMEOUT_MS, signal }) {
    const bodyBuf = body ? Buffer.from(body) : Buffer.alloc(0)
    const headers = {
      ...signRequest(cfg.originSecret, { method, target, sub, body: bodyBuf, now: now() }),
      ...(cfg.cfAccess || {}),
      Accept: accept || '*/*',
      'User-Agent': GATEWAY_VERSION,
    }
    if (body) headers['Content-Type'] = 'application/json'
    const ctrl = new AbortController()
    // The deadline covers the body read too, so it is left to fire (harmlessly) after completion.
    // The event stream has none: it ends when the origin rotates it or the browser leaves.
    if (timeoutMs) setTimeout(() => ctrl.abort(new Error('origin_timeout')), timeoutMs).unref?.()
    if (signal) signal.addEventListener('abort', () => ctrl.abort(signal.reason), { once: true })
    // The transport path is fixed; the origin routes on the signed target header.
    return doFetch(cfg.originUrl + '/__neuruh_gateway', { method, headers, body: body ? bodyBuf : undefined, signal: ctrl.signal, redirect: 'manual' })
  }

  async function originStatus(sub) {
    const started = now()
    try {
      const r = await toOrigin({ method: 'GET', target: '/api/version', sub, timeoutMs: 8000 })
      const text = await r.text()
      if (r.status === 401) return { state: 'refused', reason: 'origin refused the gateway signature (secret mismatch or clock skew)', status: r.status }
      if (!r.ok) return { state: 'degraded', status: r.status, latency_ms: now() - started }
      const v = JSON.parse(text)
      return { state: 'reachable', status: r.status, latency_ms: now() - started, head: v.running_head || v.commit || null, started_at: v.started_at || null, stale_checkout: v.is_stale ?? null }
    } catch (err) {
      return { state: 'unreachable', reason: String(err?.message || err).slice(0, 160), latency_ms: now() - started }
    }
  }

  function relay(upstream, { scrub = true, headOnly = false, extra = {} } = {}) {
    const headers = withHeaders(extra)
    for (const k of PASS_HEADERS) { const v = upstream.headers.get(k); if (v) headers[k] = v }
    const type = upstream.headers.get('content-type') || ''
    let scrubbed = 0
    if (headOnly || !upstream.body) return new Response(null, { status: upstream.status, headers })
    if (scrub && /text\/event-stream/i.test(type)) {
      headers['Cache-Control'] = 'no-store, no-transform'
      headers['X-Accel-Buffering'] = 'no'
      return new Response(upstream.body.pipeThrough(sseScrubber((n) => { scrubbed += n })), { status: upstream.status, headers })
    }
    if (scrub && isScrubbable(type)) {
      return upstream.text().then((text) => {
        const out = scrubText(text)
        headers['X-Neuruh-Gw-Scrubbed'] = String(out.count)
        return new Response(out.text, { status: upstream.status, headers })
      })
    }
    return new Response(upstream.body, { status: upstream.status, headers })
  }

  return async function handle(request) {
    const url = new URL(request.url)
    const pathname = url.searchParams.get('__nrh_path') || url.pathname
    url.searchParams.delete('__nrh_path')
    const route = classify(request.method, pathname)

    if (route.kind === 'gateway-health') {
      return json(200, {
        ok: true, service: 'neuruh-gateway', version: GATEWAY_VERSION, contract: 'neuruh.gateway-origin.v1',
        auth_configured: cfg.authConfigured, origin_configured: cfg.originConfigured,
        deployment: cfg.deployment, region: cfg.region, now: new Date(now()).toISOString(),
      })
    }
    if (route.kind === 'login-page') {
      if (!cfg.authConfigured) return html(503, loginPage({ error: 'Sign-in is not configured on this deployment.' }))
      if (currentSession(request)) return redirect(safeNext(url.searchParams.get('next')))
      const error = url.searchParams.get('error') === '1' ? 'That operator key was not accepted.' : null
      return html(200, loginPage({ next: safeNext(url.searchParams.get('next')), error }))
    }
    if (route.kind === 'auth-login') {
      if (request.method !== 'POST') return json(405, { error: 'POST only' }, { Allow: 'POST' })
      if (!cfg.authConfigured) return json(503, { error: 'auth_not_configured' })
      if (!sameOrigin(request, url)) return json(403, { error: 'cross_origin_refused' })
      const form = await readForm(request)
      const next = safeNext(form.next)
      const result = await verifyOperatorKey(form.key, cfg.operators)
      if (!result.ok) {
        await new Promise((r) => setTimeout(r, failDelay))
        return redirect('/command/login?error=1&next=' + encodeURIComponent(next))
      }
      const token = mintSession(cfg.sessionSecret, { sub: result.sub, kv: keyVersion(cfg.operators, result.sub), ttlS: cfg.ttlS, now: now() })
      return redirect(next, 303, { 'Set-Cookie': sessionCookie(token, cfg.ttlS) })
    }
    if (route.kind === 'auth-logout') {
      if (request.method !== 'POST') return json(405, { error: 'POST only' }, { Allow: 'POST' })
      if (!sameOrigin(request, url)) return json(403, { error: 'cross_origin_refused' })
      return redirect('/command/login', 303, { 'Set-Cookie': clearedSessionCookie() })
    }
    if (route.kind === 'auth-session') {
      const s = currentSession(request)
      return json(200, s ? { authenticated: true, sub: s.sub, issued_at: s.iat, expires_at: s.exp } : { authenticated: false, login: '/command/login' })
    }
    if (route.kind === 'not-found') return json(404, { error: 'not_found', boundary: 'neuruh-gateway' })
    if (route.kind === 'method-refused') return json(405, { error: 'method_not_on_public_boundary', boundary: 'neuruh-gateway' })
    if (route.kind === 'command-redirect') return redirect('/command', 308)

    // Everything below needs an operator session.
    const session = currentSession(request)
    if (!session) {
      if (route.kind === 'command-ui' && route.target === '/') return redirect('/command/login?next=' + encodeURIComponent('/command'), 303)
      return json(401, { error: 'unauthenticated', login: '/command/login' })
    }
    if (!cfg.originConfigured) {
      const reason = 'origin not configured on this deployment: ' + cfg.problems.filter((p) => /ORIGIN/.test(p)).join('; ')
      return route.kind === 'command-ui' && route.target === '/'
        ? html(503, originOfflinePage({ reason, checkedAt: new Date(now()).toISOString() }))
        : json(503, { error: 'origin_not_configured' })
    }
    if (route.kind === 'gateway-status') {
      const origin = await originStatus(session.sub)
      return json(200, {
        gateway: { version: GATEWAY_VERSION, deployment: cfg.deployment, region: cfg.region, contract: 'neuruh.gateway-origin.v1', edge_access: Boolean(cfg.cfAccess) },
        session: { sub: session.sub, expires_at: session.exp },
        origin,
        observed_at: new Date(now()).toISOString(),
      })
    }

    const target = route.target + (url.search || '')
    try {
      if (route.kind === 'command-post') {
        if (!sameOrigin(request, url)) return json(403, { error: 'cross_origin_refused' })
        const body = (await request.text()).slice(0, 256 * 1024)
        const upstream = await toOrigin({ method: 'POST', target, sub: session.sub, body: body || '{}', timeoutMs: CHAT_TIMEOUT_MS })
        return await relay(upstream)
      }
      if (route.kind === 'command-stream') {
        // A reconnecting EventSource sends its cursor as Last-Event-ID; it is newer than the ?since= it
        // first opened with, and it travels inside the signed target, not as a header.
        const params = new URLSearchParams(url.search)
        const lastId = request.headers.get('last-event-id')
        if (lastId) params.set('since', lastId)
        const streamTarget = route.target + (params.size ? '?' + params : '')
        const upstream = await toOrigin({ method: 'GET', target: streamTarget, sub: session.sub, accept: 'text/event-stream', timeoutMs: 0, signal: request.signal })
        if (upstream.status === 401) return json(502, { error: 'origin_refused_gateway' })
        return relay(upstream)
      }
      const upstream = await toOrigin({ method: 'GET', target, sub: session.sub })
      if (upstream.status === 401) return json(502, { error: 'origin_refused_gateway', detail: 'the origin rejected the gateway signature' })
      return await relay(upstream, { headOnly: request.method === 'HEAD', extra: route.target === '/' ? { 'Content-Security-Policy': COMMAND_CSP } : {} })
    } catch (err) {
      const reason = String(err?.message || err).slice(0, 160)
      if (route.kind === 'command-ui' && route.target === '/') return html(503, originOfflinePage({ reason, checkedAt: new Date(now()).toISOString() }))
      return json(503, { error: 'origin_unreachable', reason })
    }
  }
}
