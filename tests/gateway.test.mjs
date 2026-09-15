/**
 * Neuruh gateway court: the public boundary in front of the organism.
 * Runs the real handler against a fake origin that enforces the same signed
 * contract as Command's gateway-origin listener (neuruh-cockpit).
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { CONTRACT_VECTOR, sha256Hex, signature, verifyRequest } from '../gateway/contract.mjs'
import { createGateway, safeNext, COMMAND_CSP } from '../gateway/handler.mjs'
import { classify, COMMAND_ASSET } from '../gateway/routes.mjs'
import { hashOperatorKey, mintOperatorKey, SESSION_COOKIE } from '../gateway/session.mjs'
import { scrubText } from '../gateway/scrub.mjs'

const ORIGIN_SECRET = 'gateway-test-origin-secret-0123456789abcdefgh'
const SESSION_SECRET = 'gateway-test-session-secret-0123456789abcdefg'
const BASE = 'https://neuruh.com'
const KEY = mintOperatorKey('founder')
const HASH = await hashOperatorKey(KEY)

function env(extra = {}) {
  return {
    NEURUH_OPERATOR_KEYS: `founder=${HASH}`,
    NEURUH_SESSION_SECRET: SESSION_SECRET,
    NEURUH_ORIGIN_URL: 'https://origin.neuruh.test',
    NEURUH_GATEWAY_ORIGIN_SECRET: ORIGIN_SECRET,
    ...extra,
  }
}

/** Fake origin: verifies every request like Command's listener, records it, answers from `routes`. */
function fakeOrigin(routes = {}) {
  const calls = []
  const fetch = async (url, init) => {
    const headers = Object.fromEntries(Object.entries(init.headers).map(([k, v]) => [k.toLowerCase(), v]))
    const body = init.body ? Buffer.from(init.body) : Buffer.alloc(0)
    const v = verifyRequest(ORIGIN_SECRET, { method: init.method, headers, body })
    calls.push({ url, method: init.method, headers, body: body.toString('utf8'), verified: v })
    if (!v.ok) return new Response(JSON.stringify({ error: v.reason }), { status: 401 })
    const handler = routes[v.target.split('?')[0]] || routes['*']
    if (!handler) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: { 'content-type': 'application/json' } })
    return handler(v, body.toString('utf8'))
  }
  return { fetch, calls }
}

const jsonRes = (obj, extra = {}) => new Response(JSON.stringify(obj), { status: 200, headers: { 'content-type': 'application/json; charset=utf-8', 'x-neuruh-origin': 'neuruh-command', 'x-neuruh-origin-head': 'abc1234', ...extra } })

async function login(gateway) {
  const res = await gateway(new Request(BASE + '/api/auth/login?__nrh_path=/api/auth/login', {
    method: 'POST', headers: { origin: BASE, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ key: KEY, next: '/command#needs-you' }),
  }))
  assert.equal(res.status, 303)
  const cookie = res.headers.get('set-cookie')
  return { res, cookie: cookie.split(';')[0] }
}

const get = (gateway, p, headers = {}) => gateway(new Request(BASE + p, { headers }))

test('contract vector is pinned identically in both repos', () => {
  const v = CONTRACT_VECTOR
  assert.equal(signature(v.secret, { method: v.method, target: v.target, ts: v.ts, nonce: v.nonce, sub: v.sub, bodySha256: sha256Hex(v.body) }),
    '4JUA6yhM9vMIYLHnZAhPUuVB1Z23b7H86sCx2WfJ9F0')
})

test('public: gateway health says what is configured and never where the origin is', async () => {
  const gw = createGateway(env(), { fetch: fakeOrigin().fetch, failDelayMs: 0 })
  const res = await get(gw, '/api/gateway/health')
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.ok, true)
  assert.equal(body.auth_configured, true)
  assert.equal(body.origin_configured, true)
  assert.doesNotMatch(JSON.stringify(body), /origin\.neuruh\.test|secret/i)
})

test('without a session: /command goes to sign-in, the API and Command assets refuse', async () => {
  const origin = fakeOrigin({ '*': () => jsonRes({ leaked: true }) })
  const gw = createGateway(env(), { fetch: origin.fetch, failDelayMs: 0 })
  const page = await get(gw, '/command')
  assert.equal(page.status, 303)
  assert.equal(page.headers.get('location'), '/command/login?next=%2Fcommand')
  for (const p of ['/api/live/events', '/api/current-truth', '/command-live.js', '/spatial-host/host.js', '/api/live/stream']) {
    const r = await get(gw, p)
    assert.equal(r.status, 401, p)
    assert.equal((await r.json()).error, 'unauthenticated')
  }
  assert.equal(origin.calls.length, 0, 'nothing reached the origin')
  const form = await get(gw, '/command/login?next=%2Fcommand')
  assert.equal(form.status, 200)
  assert.match(form.headers.get('content-security-policy'), /default-src 'none'/)
  assert.match(await form.text(), /OPERATOR KEY/)
})

test('sign-in: wrong key refused, cross-site refused, right key → hardened session cookie', async () => {
  const gw = createGateway(env(), { fetch: fakeOrigin().fetch, failDelayMs: 0 })
  const bad = await gw(new Request(BASE + '/api/auth/login', { method: 'POST', headers: { origin: BASE, 'content-type': 'application/x-www-form-urlencoded' }, body: 'key=nko_founder_' + 'A'.repeat(43) }))
  assert.equal(bad.status, 303)
  assert.match(bad.headers.get('location'), /^\/command\/login\?error=1/)
  assert.equal(bad.headers.get('set-cookie'), null)
  const cross = await gw(new Request(BASE + '/api/auth/login', { method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/x-www-form-urlencoded' }, body: 'key=' + KEY }))
  assert.equal(cross.status, 403)
  const crossFetchMeta = await gw(new Request(BASE + '/api/auth/login', { method: 'POST', headers: { origin: 'null', 'sec-fetch-site': 'cross-site', 'content-type': 'application/x-www-form-urlencoded' }, body: 'key=' + KEY }))
  assert.equal(crossFetchMeta.status, 403, 'a cross-site submission is refused on fetch metadata')
  const noSignal = await gw(new Request(BASE + '/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'key=' + KEY }))
  assert.equal(noSignal.status, 403, 'a request with neither signal is refused')
  // Chrome sends "Origin: null" for a form POST from a page served with Referrer-Policy: no-referrer,
  // which these pages are. Fetch metadata is what makes that submission legible.
  const ownForm = await gw(new Request(BASE + '/api/auth/login', {
    method: 'POST', headers: { origin: 'null', 'sec-fetch-site': 'same-origin', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ key: KEY, next: '/command' }),
  }))
  assert.equal(ownForm.status, 303, "the surface's own sign-in form is accepted")
  const { res } = await login(gw)
  assert.equal(res.headers.get('location'), '/command#needs-you')
  const c = res.headers.get('set-cookie')
  for (const attr of [`${SESSION_COOKIE}=`, 'HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/']) assert.ok(c.includes(attr), attr)
  assert.ok(!/Domain=/i.test(c), '__Host- cookie carries no Domain')
})

test('with a session: Command reads are signed, routed on the target, and scrubbed of loopback URLs', async () => {
  const origin = fakeOrigin({
    '/api/live/control-plane': () => jsonRes({ fr: { probe: { url: 'http://127.0.0.1:19090/v1/readiness' } }, public: 'https://app.deedsonar.com' }),
    '/': () => new Response('<html><script src="/command-hosted.js"></script></html>', { headers: { 'content-type': 'text/html; charset=utf-8' } }),
  })
  const gw = createGateway(env(), { fetch: origin.fetch, failDelayMs: 0 })
  const { cookie } = await login(gw)
  const r = await get(gw, '/api/live/control-plane?__nrh_path=/api/live/control-plane&refresh=1', { cookie })
  assert.equal(r.status, 200)
  const text = await r.text()
  assert.doesNotMatch(text, /127\.0\.0\.1/)
  assert.match(text, /neuruh-private:\/\/loopback-19090\/v1\/readiness/)
  assert.match(text, /https:\/\/app\.deedsonar\.com/)
  assert.equal(r.headers.get('x-neuruh-gw-scrubbed'), '1')
  assert.equal(r.headers.get('x-neuruh-origin-head'), 'abc1234')
  assert.equal(r.headers.get('cache-control'), 'no-store')
  const call = origin.calls.at(-1)
  assert.equal(call.verified.target, '/api/live/control-plane?refresh=1', 'signed target excludes the rewrite marker')
  assert.equal(call.verified.sub, 'founder')
  assert.equal(new URL(call.url).pathname, '/__neuruh_gateway', 'the transport path carries nothing')
  const doc = await get(gw, '/command', { cookie })
  assert.equal(doc.status, 200)
  assert.equal(doc.headers.get('content-security-policy'), COMMAND_CSP)
  assert.match(COMMAND_CSP, /connect-src 'self' https:\/\/www\.gstatic\.com/)
  assert.equal(origin.calls.at(-1).verified.target, '/')
})

test('only Command read routes cross: everything else is refused at the gateway', async () => {
  const origin = fakeOrigin({ '*': () => jsonRes({ ok: true }) })
  const gw = createGateway(env(), { fetch: origin.fetch, failDelayMs: 0 })
  const { cookie } = await login(gw)
  const before = origin.calls.length
  const cases = [
    ['GET', '/api/broker/broker.get_artifact_manifest?path=/', 404],
    ['GET', '/api/live/not-a-route', 404],
    ['GET', '/api/gateway', 404],
    ['GET', '/api/presence/session', 404],
    ['DELETE', '/api/health', 405],
    ['POST', '/api/current-truth', 405],
    ['PUT', '/command', 405],
  ]
  for (const [method, p, status] of cases) {
    const r = await gw(new Request(BASE + p, { method, headers: { cookie, origin: BASE } }))
    assert.equal(r.status, status, `${method} ${p}`)
  }
  assert.equal(origin.calls.length, before, 'none of these reached the origin')
  assert.equal((await get(gw, '/command/anything', { cookie })).status, 308)
})

test('Presence exchange: same-origin POST forwarded with its body signed; cross-site refused', async () => {
  const origin = fakeOrigin({ '/api/presence/chat': (v, body) => jsonRes({ echoed: JSON.parse(body) }) })
  const gw = createGateway(env(), { fetch: origin.fetch, failDelayMs: 0 })
  const { cookie } = await login(gw)
  const body = JSON.stringify({ message: 'what changed?' })
  const ok = await gw(new Request(BASE + '/api/presence/chat', { method: 'POST', headers: { cookie, origin: BASE, 'content-type': 'application/json' }, body }))
  assert.equal(ok.status, 200)
  assert.deepEqual((await ok.json()).echoed, { message: 'what changed?' })
  const cross = await gw(new Request(BASE + '/api/presence/chat', { method: 'POST', headers: { cookie, origin: 'https://evil.example', 'content-type': 'application/json' }, body }))
  assert.equal(cross.status, 403)
})

test('event stream: Last-Event-ID travels in the signed target; frames are scrubbed across chunk boundaries', async () => {
  const enc = new TextEncoder()
  const origin = fakeOrigin({
    '/api/live/stream': () => new Response(new ReadableStream({
      start(c) {
        c.enqueue(enc.encode('event: organism\nid: 2026-09-15T20:00:01Z\ndata: {"u":"http://127.0.'))
        c.enqueue(enc.encode('0.1:8520/x"}\n\n'))
        c.close()
      },
    }), { headers: { 'content-type': 'text/event-stream; charset=utf-8' } }),
  })
  const gw = createGateway(env(), { fetch: origin.fetch, failDelayMs: 0 })
  const { cookie } = await login(gw)
  const r = await get(gw, '/api/live/stream?since=2026-09-15T19:00:00Z', { cookie, 'last-event-id': '2026-09-15T20:00:00Z' })
  assert.equal(r.status, 200)
  assert.equal(r.headers.get('content-type'), 'text/event-stream; charset=utf-8')
  const text = await r.text()
  assert.match(text, /neuruh-private:\/\/loopback-8520\/x/)
  assert.doesNotMatch(text, /127\.0\.0\.1/)
  assert.equal(origin.calls.at(-1).verified.target, '/api/live/stream?since=2026-09-15T20%3A00%3A00Z')
})

test('origin down or refusing: honest 503 / 502, never a fabricated answer', async () => {
  const down = createGateway(env(), { fetch: async () => { throw new Error('connect ECONNREFUSED') }, failDelayMs: 0 })
  const { cookie } = await login(down)
  const page = await get(down, '/command', { cookie })
  assert.equal(page.status, 503)
  assert.match(await page.text(), /organism origin is not reachable/)
  const api = await get(down, '/api/current-truth', { cookie })
  assert.equal(api.status, 503)
  assert.equal((await api.json()).error, 'origin_unreachable')
  const status = await (await get(down, '/api/gateway/status', { cookie })).json()
  assert.equal(status.origin.state, 'unreachable')
  const wrongSecret = createGateway(env({ NEURUH_GATEWAY_ORIGIN_SECRET: 'x'.repeat(40) }), { fetch: fakeOrigin({ '*': () => jsonRes({}) }).fetch, failDelayMs: 0 })
  const c2 = (await login(wrongSecret)).cookie
  assert.equal((await get(wrongSecret, '/api/founder-gates', { cookie: c2 })).status, 502)
  assert.equal((await (await get(wrongSecret, '/api/gateway/status', { cookie: c2 })).json()).origin.state, 'refused')
})

test('sessions: tampered, expired and rotated-key sessions are rejected', async () => {
  let clock = Date.now()
  const origin = fakeOrigin({ '*': () => jsonRes({ ok: true }) })
  const gw = createGateway(env(), { fetch: origin.fetch, now: () => clock, failDelayMs: 0 })
  const { cookie } = await login(gw)
  assert.equal((await get(gw, '/api/founder-gates', { cookie })).status, 200)
  const [name, token] = cookie.split('=')
  const tampered = `${name}=${token.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A'))}`
  assert.equal((await get(gw, '/api/founder-gates', { cookie: tampered })).status, 401)
  clock += 13 * 3600 * 1000
  assert.equal((await get(gw, '/api/founder-gates', { cookie })).status, 401, 'expired after the 12h default')
  const rotated = createGateway(env({ NEURUH_OPERATOR_KEYS: `founder=${await hashOperatorKey(KEY)}` }), { fetch: origin.fetch, failDelayMs: 0 })
  assert.equal((await get(rotated, '/api/founder-gates', { cookie })).status, 401, 're-hashing the key revokes old sessions')
})

test('login redirects only to the Command surface', () => {
  assert.equal(safeNext('/command#needs-you'), '/command#needs-you')
  assert.equal(safeNext('/command'), '/command')
  for (const bad of ['//evil.example', 'https://evil.example', '/command/../x', '/commandeer', 'javascript:alert(1)', '/api/x']) assert.equal(safeNext(bad), '/command', bad)
})

test('unconfigured deployment fails closed', async () => {
  const gw = createGateway({}, { fetch: fakeOrigin().fetch, failDelayMs: 0 })
  assert.equal((await get(gw, '/command/login')).status, 503)
  assert.equal((await get(gw, '/api/live/events')).status, 401)
  const health = await (await get(gw, '/api/gateway/health')).json()
  assert.equal(health.auth_configured, false)
  assert.equal(health.origin_configured, false)
})

test('route map: Command assets are exactly the names Command serves', () => {
  for (const p of ['/command-live.js', '/command-hosted.js', '/laric-operator.js', '/surfaces-menu.js', '/spatial-host/host.js', '/spatial-host/assets/generated/organism-core.glb', '/operating-model/host.css']) {
    assert.equal(classify('GET', p).kind, 'command-ui', p)
  }
  for (const p of ['/commands.js', '/command-live.js.map/../x', '/index.html', '/_next/static/x.js', '/spatial-host/../../etc/passwd']) {
    assert.notEqual(classify('GET', p).kind, 'command-ui', p)
  }
})

test('the public site owns none of the paths the gateway reserves', async () => {
  const roots = ['apps/neuruh-web/public', 'apps/neuruh-web/app']
  const reserved = /^(api|command|deedsonar|spatial-host|operating-model)$/
  for (const root of roots) {
    for (const name of await readdir(root)) {
      assert.ok(!reserved.test(name), `${root}/${name} collides with a gateway path`)
      assert.ok(!COMMAND_ASSET.test('/' + name), `${root}/${name} collides with a Command asset path`)
    }
  }
})

test('vercel.json routes every reserved path to the gateway and DeedSonar to its own app', async () => {
  const v = JSON.parse(await readFile('vercel.json', 'utf8'))
  const rw = Object.fromEntries(v.rewrites.map((r) => [r.source, r.destination]))
  for (const src of ['/api/:path*', '/command', '/command/:path*', '/surfaces-menu.js', '/spatial-host/:path*', '/operating-model/:path*']) {
    assert.match(rw[src] || '', /^\/api\/gateway\?__nrh_path=/, src)
  }
  const ds = v.redirects.find((r) => r.source === '/deedsonar/:path*')
  assert.equal(ds.destination, 'https://app.deedsonar.com/:path*')
  assert.equal(ds.permanent, false, 'temporary until the founder decides; a cached 308 is hard to undo')
  assert.equal(v.functions['api/gateway.mjs'].maxDuration, 300)
})

test('the gateway knows no private address and ships no secret', async () => {
  for (const dir of ['gateway', 'api']) {
    for (const name of await readdir(dir)) {
      if (!name.endsWith('.mjs')) continue
      const src = await readFile(path.join(dir, name), 'utf8')
      assert.doesNotMatch(src, /https?:\/\/(?:127\.0\.0\.1|localhost):\d/, `${dir}/${name} names a loopback URL`)
      assert.doesNotMatch(src, /(?:sk|ghp|github_pat)_[A-Za-z0-9_-]{12,}|scrypt\$\d+\$\d+\$\d+\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{40,}/, `${dir}/${name} embeds a secret`)
    }
  }
  assert.equal(scrubText('ws://localhost:8520/x and 0.0.0.0:6333').count, 2)
})
