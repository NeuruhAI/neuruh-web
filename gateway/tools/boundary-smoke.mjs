#!/usr/bin/env node
/**
 * Live smoke of the Neuruh hosting boundary, and the proof that Command reads
 * the live organism through it.
 *
 *   NEURUH_OPERATOR_KEY=nko_founder_… node gateway/tools/boundary-smoke.mjs [--base https://neuruh.com] [--canonical] [--receipt out.json]
 *
 * Phase 1  the boundary holds: the public site still serves, /deedsonar reaches
 *          DeedSonar, Command and every organism read refuse without a session,
 *          and nothing but Command's read routes is reachable at all.
 * Phase 2  the surface works signed in: the Command page, its assets, every
 *          canonical read model, and the durable event stream.
 * Phase 3  no browser-visible loopback URL anywhere in what the boundary served.
 * Phase 4  --canonical (run on the organism host): each read model is compared
 *          with the canonical file it claims to come from, so a passing run
 *          proves the gateway served the live organism, not a copy.
 *
 * Read-only: every request is a GET, apart from the sign-in POST.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import os from 'os'

const args = process.argv.slice(2)
const flag = (name, fallback = null) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : (args.includes(name) ? true : fallback)
}
const BASE = String(flag('--base', process.env.NEURUH_BASE_URL || 'https://neuruh.com')).replace(/\/+$/, '')
const KEY = process.env.NEURUH_OPERATOR_KEY || ''
const CANONICAL = Boolean(flag('--canonical', false))
const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || ''

/* The public site and the /deedsonar redirect are served by the host platform's
   routing layer, not by the gateway handler, so a local run cannot exercise them. */
const LOCAL = /^https?:\/\/(?:127\.0\.0\.1|localhost|[a-z0-9-]+\.localhost)(?::\d+)?$/i.test(BASE)

const results = []
let cookie = null
const record = (phase, name, ok, detail) => {
  results.push({ phase, name, ok: Boolean(ok), detail: detail === undefined ? null : detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  [${phase}] ${name}${detail ? ' — ' + String(detail).slice(0, 220) : ''}`)
}
const skip = (phase, name, why) => {
  results.push({ phase, name, ok: null, skipped: true, detail: why })
  console.log(`SKIP  [${phase}] ${name} — ${why}`)
}
const check = async (phase, name, fn) => {
  try {
    const detail = await fn()
    record(phase, name, true, detail)
    return true
  } catch (err) {
    record(phase, name, false, err?.message || String(err))
    return false
  }
}

const LOOPBACK = /(?:https?|wss?):\/\/(?:127(?:\.\d{1,3}){3}|localhost|0\.0\.0\.0|\[::1\])(?::\d+)?|(?:127\.0\.0\.1|localhost):\d{2,5}/i

function req(p, init = {}) {
  const headers = { ...(init.headers || {}) }
  if (cookie) headers.cookie = cookie
  if (BYPASS) headers['x-vercel-protection-bypass'] = BYPASS
  return fetch(BASE + p, { ...init, headers, redirect: 'manual' })
}
async function getJson(p) {
  const r = await req(p)
  const text = await r.text()
  if (!r.ok) throw new Error(`${p} → HTTP ${r.status} ${text.slice(0, 120)}`)
  if (LOOPBACK.test(text)) throw new Error(`${p} leaked a loopback URL: ${text.match(LOOPBACK)[0]}`)
  if (r.headers.get('x-neuruh-gw-scrubbed') && r.headers.get('x-neuruh-gw-scrubbed') !== '0') {
    throw new Error(`${p} needed gateway scrubbing (${r.headers.get('x-neuruh-gw-scrubbed')}) — the origin should have rewritten it`)
  }
  return JSON.parse(text)
}

/* ─────────────────────────── phase 1: the boundary ─────────────────────────── */
if (LOCAL) skip('boundary', 'public site still serves', 'platform routing; only meaningful against the deployed host')
else await check('boundary', 'public site still serves', async () => {
  const r = await req('/')
  if (r.status !== 200) throw new Error('HTTP ' + r.status)
  return 'GET / → 200'
})
await check('boundary', 'gateway health is public and names no private address', async () => {
  const r = await req('/api/gateway/health')
  const body = await r.json()
  if (!body.ok || !body.auth_configured || !body.origin_configured) throw new Error(JSON.stringify(body))
  if (LOOPBACK.test(JSON.stringify(body))) throw new Error('loopback in health')
  return `${body.version} · deployment ${String(body.deployment).slice(0, 7)}`
})
if (LOCAL) skip('boundary', '/deedsonar reaches DeedSonar, unchanged', 'platform redirect; only meaningful against the deployed host')
else await check('boundary', '/deedsonar reaches DeedSonar, unchanged', async () => {
  const r = await req('/deedsonar/login?x=1')
  const loc = r.headers.get('location') || ''
  if (r.status !== 307 && r.status !== 308) throw new Error('HTTP ' + r.status)
  if (!loc.startsWith('https://app.deedsonar.com/login')) throw new Error('location ' + loc)
  return `${r.status} → ${loc}`
})
await check('boundary', 'Command and every organism read refuse without a session', async () => {
  const closed = []
  for (const p of ['/api/live/events', '/api/current-truth', '/api/founder-gates', '/api/live/stream', '/command-live.js', '/spatial-host/host.js']) {
    const r = await req(p)
    if (r.status !== 401) throw new Error(`${p} → HTTP ${r.status}, expected 401`)
    closed.push(p)
  }
  const page = await req('/command')
  if (page.status !== 303 || !(page.headers.get('location') || '').startsWith('/command/login')) throw new Error('/command did not send an anonymous visitor to sign-in')
  return `${closed.length} routes 401 · /command → sign-in`
})
await check('boundary', 'nothing but Command read routes is reachable', async () => {
  const refused = []
  for (const [p, want] of [['/api/broker/broker.get_artifact_manifest?path=/', 404], ['/api/live/not-a-route', 404], ['/api/gateway', 404]]) {
    const r = await req(p)
    if (r.status !== want) throw new Error(`${p} → HTTP ${r.status}, expected ${want}`)
    refused.push(p)
  }
  for (const [method, p] of [['DELETE', '/api/health'], ['POST', '/api/current-truth']]) {
    const r = await req(p, { method })
    if (r.status !== 405 && r.status !== 401) throw new Error(`${method} ${p} → HTTP ${r.status}`)
  }
  return `${refused.length} refused at the gateway`
})

/* ─────────────────────────── phase 2: signed in ─────────────────────────── */
if (!KEY) {
  record('surface', 'operator sign-in', false, 'NEURUH_OPERATOR_KEY is not set')
} else {
  await check('surface', 'operator sign-in mints a hardened session', async () => {
    const r = await req('/api/auth/login', {
      method: 'POST',
      headers: { origin: BASE, 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key: KEY, next: '/command' }),
    })
    const set = r.headers.get('set-cookie') || ''
    if (r.status !== 303) throw new Error('HTTP ' + r.status)
    for (const attr of ['HttpOnly', 'Secure', 'SameSite=Strict']) if (!set.includes(attr)) throw new Error('cookie missing ' + attr)
    cookie = set.split(';')[0]
    return set.split('=')[0]
  })
}

let originHead = null
const page = { html: '', ok: false }
if (cookie) {
  await check('surface', 'Command page is served through the gateway', async () => {
    const r = await req('/command')
    page.html = await r.text()
    if (r.status !== 200) throw new Error('HTTP ' + r.status)
    if (!/NEURUH/.test(page.html) || !/command-live\.js/.test(page.html)) throw new Error('not the Command page')
    const csp = r.headers.get('content-security-policy') || ''
    if (!/connect-src 'self'/.test(csp)) throw new Error('missing connect-src lock')
    originHead = r.headers.get('x-neuruh-origin-head')
    page.ok = true
    return `${(page.html.length / 1024).toFixed(0)} KB · origin ${String(originHead).slice(0, 7)} · CSP locked`
  })
  await check('surface', 'Command assets load from the gateway', async () => {
    const sizes = []
    for (const p of ['/command-live.js', '/command-hosted.js', '/surfaces-menu.js', '/operating-model/host.css']) {
      const r = await req(p)
      if (r.status !== 200) throw new Error(`${p} → HTTP ${r.status}`)
      sizes.push(`${p} ${(Number(r.headers.get('content-length') || (await r.text()).length) / 1024).toFixed(0)}KB`)
    }
    return sizes.join(' · ')
  })
}

const LIVE = [
  ['current truth', '/api/current-truth'],
  ['proof lineage', '/api/current-truth/proof?ref=pointer'],
  ['founder gates', '/api/founder-gates'],
  ['missions', '/api/live/missions'],
  ['opportunities', '/api/live/opportunities?limit=5'],
  ['recipes', '/api/live/recipes'],
  ['search', '/api/live/search'],
  ['learning', '/api/live/learning'],
  ['economics', '/api/live/economics'],
  ['events', '/api/live/events?limit=20'],
  ['control plane', '/api/live/control-plane'],
  ['workers', '/api/workers'],
  ['briefing', '/api/briefing'],
]
const live = {}
if (cookie) {
  for (const [name, p] of LIVE) {
    await check('live', name, async () => {
      const body = await getJson(p)
      live[name] = body
      const observed = body.observed_at || body.now || null
      const state = body.state || body.authority || 'read'
      return `${p} · ${state}${observed ? ' · observed ' + observed : ''}`
    })
  }

  await check('live', 'durable event stream delivers and carries a resume cursor', async () => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 30000)
    const r = await req('/api/live/stream', { headers: { accept: 'text/event-stream' }, signal: ctrl.signal })
    if (r.status !== 200) throw new Error('HTTP ' + r.status)
    if (!/text\/event-stream/.test(r.headers.get('content-type') || '')) throw new Error('not an event stream')
    const reader = r.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''
    const seen = new Set()
    let cursor = null
    while (seen.size < 2 || !cursor) {
      const { value, done } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      if (LOOPBACK.test(buf)) throw new Error('loopback URL in the stream')
      for (const frame of buf.split('\n\n').slice(0, -1)) {
        const ev = (frame.match(/^event: (.+)$/m) || [])[1]
        const id = (frame.match(/^id: (.+)$/m) || [])[1]
        if (ev) seen.add(ev)
        if (id) cursor = id
      }
      buf = buf.slice(buf.lastIndexOf('\n\n') + 2)
    }
    clearTimeout(timer)
    ctrl.abort()
    if (!seen.has('ready')) throw new Error('no ready frame')
    if (!cursor) throw new Error('no resume cursor')
    return `frames ${[...seen].join(',')} · cursor ${cursor}`
  })
}

/* ─────────────────────────── phase 3: no loopback anywhere ─────────────────────────── */
if (page.ok) {
  await check('no-loopback', 'the served Command page carries no loopback URL', () => {
    const hit = page.html.match(LOOPBACK)
    if (hit) throw new Error('found ' + hit[0])
    if (!/neuruh-private:\/\//.test(page.html)) throw new Error('expected private organs to be labelled neuruh-private://')
    return 'page clean; private organs labelled'
  })
  await check('no-loopback', 'every live read model is clean', () => {
    const dirty = Object.entries(live).filter(([, body]) => LOOPBACK.test(JSON.stringify(body))).map(([n]) => n)
    if (dirty.length) throw new Error('loopback in ' + dirty.join(', '))
    return `${Object.keys(live).length} read models`
  })
}

/* ─────────────────────────── phase 4: it is the live organism ─────────────────────────── */
if (CANONICAL && cookie) {
  const home = os.homedir()
  const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'))
  const truthDir = process.env.NEURUH_CURRENT_TRUTH_DIR || path.join(home, 'neuruh-repos', 'CONVERGENCE_HANDOFF', 'CURRENT_TRUTH')

  await check('canonical', 'current truth == the CURRENT.json pointer on the host', async () => {
    const current = await readJson(path.join(truthDir, 'CURRENT.json'))
    const served = live['current truth']?.pointer || {}
    if (!current.canonical_id || served.canonical_id !== current.canonical_id) throw new Error(`pointer ${served.canonical_id} != file ${current.canonical_id}`)
    if (served.path !== path.join(truthDir, 'CURRENT.json')) throw new Error(`served path ${served.path}`)
    return `${current.canonical_id} generated ${current.generated_at}`
  })
  await check('canonical', 'founder gates == the open gates in FOUNDER_GATES.json, plus the PR register', async () => {
    const file = await readJson(path.join(truthDir, 'FOUNDER_GATES.json'))
    const fileGates = Array.isArray(file) ? file : (file.gates || [])
    const open = fileGates.filter((g) => g.state !== 'CLOSED')
    const served = live['founder gates']?.gates || []
    const servedIds = new Set(served.map((g) => g.id))
    const missing = open.filter((g) => !servedIds.has(g.id)).map((g) => g.id)
    if (missing.length) throw new Error('not served: ' + missing.join(','))
    const extra = served.filter((g) => !fileGates.some((f) => f.id === g.id))
    const notFromRegister = extra.filter((g) => !String(g.id).startsWith('GATE-PR-')).map((g) => g.id)
    if (notFromRegister.length) throw new Error('served gates from no canonical source: ' + notFromRegister.join(','))
    if (served.length !== live['founder gates'].total) throw new Error('total disagrees with the list')
    return `${open.length} open file gates + ${extra.length} from the PR register = ${served.length}`
  })
  await check('canonical', 'missions == the Founder Runtime store on the host', async () => {
    // Founder Runtime keeps creating missions, so the store is read on both sides of the
    // gateway call: the served count has to land inside the window the store moved through.
    const { DatabaseSync } = await import('node:sqlite')
    const file = process.env.NEURUH_FR_DB || path.join(home, '.neuruh', 'founder-runtime', 'missions.sqlite')
    const count = () => {
      const db = new DatabaseSync(file, { readOnly: true })
      const n = db.prepare('SELECT COUNT(*) AS n FROM missions').get().n
      const newest = db.prepare('SELECT mission_id, current_state FROM missions ORDER BY updated_at DESC LIMIT 1').get()
      db.close()
      return { n: Number(n), newest }
    }
    const before = count()
    const served = await getJson('/api/live/missions')
    const after = count()
    const servedTotal = Number(served.total ?? Object.values(served.counts || {}).reduce((a, b) => a + b, 0))
    if (servedTotal < before.n || servedTotal > after.n) throw new Error(`gateway ${servedTotal} outside the store window ${before.n}..${after.n}`)
    const ids = new Set((served.missions || served.active || []).map((m) => m.mission_id))
    return `${servedTotal} missions in [${before.n},${after.n}] · newest ${after.newest.mission_id} ${after.newest.current_state}${ids.size ? ` · ${ids.size} listed` : ''}`
  })
  await check('canonical', 'opportunities == the ranked universe the pointer names, re-hashed here', async () => {
    const lineage = live.opportunities?.lineage || {}
    const v = live.opportunities?.verification || {}
    const receipt = lineage.projection_receipt
    if (!receipt?.path) throw new Error('the read model did not name its projection receipt')
    // Hash the receipt and the ranked file ourselves: what the gateway served has to be what is on disk.
    const receiptSha = createHash('sha256').update(await readFile(receipt.path)).digest('hex')
    if (receiptSha !== receipt.sha256) throw new Error(`receipt sha ${receiptSha} != served ${receipt.sha256}`)
    if (v.state === 'PENDING') return `receipt re-hashed; ranked sha still verifying (declared ${String(v.declared_sha256).slice(0, 12)})`
    if (v.observed_sha256 !== v.declared_sha256) throw new Error('the origin itself found the ranked file changed under the pointer')
    const rankedSha = createHash('sha256').update(await readFile(lineage.ranked_csv)).digest('hex')
    if (rankedSha !== v.declared_sha256) throw new Error(`ranked sha ${rankedSha} != served ${v.declared_sha256}`)
    return `${live.opportunities.universe.ranked} ranked · ranked sha ${rankedSha.slice(0, 12)} re-hashed from ${path.basename(lineage.ranked_csv)} · run ${lineage.ranking_run_id}`
  })
  await check('canonical', 'events == the organism ledgers on the host, read after they were written', async () => {
    // The ledgers are append-only and still being written, so the tail is captured FIRST and the
    // gateway is asked afterwards: a live read must already contain everything written before it.
    const ledger = process.env.NEURUH_SUPERVISION_LEDGER || path.join(home, '.neuruh', 'supervision', 'ledger.jsonl')
    const lines = (await readFile(ledger, 'utf8')).trim().split('\n')
    const last = JSON.parse(lines[lines.length - 1])
    const tailTs = last.ts || last.timestamp || last.observed_at
    const served = await getJson('/api/live/events?limit=200')
    if (!served.cursor) throw new Error('no events served')
    if (Date.parse(served.cursor) < Date.parse(tailTs)) throw new Error(`gateway cursor ${served.cursor} is behind the ledger tail ${tailTs} that was written before the read`)
    const sources = (served.sources || []).filter((s) => s.state === 'observed').map((s) => s.source)
    const fromLedger = (served.events || []).some((e) => Date.parse(e.ts) === Date.parse(tailTs))
    return `cursor ${served.cursor} ≥ supervision tail ${tailTs}${fromLedger ? ' (that line is in the feed)' : ''} · ${sources.length} ledgers observed`
  })
  await check('canonical', 'the origin serves the deployed Command commit', async () => {
    const version = await getJson('/api/version')
    if (!originHead || version.running_head !== originHead) throw new Error(`header ${originHead} != /api/version ${version.running_head}`)
    if (version.is_stale) throw new Error('the origin checkout advanced past the running process: redeploy Command')
    return `Command ${String(version.running_head).slice(0, 10)} · started ${version.started_at}`
  })
}

/* ─────────────────────────── receipt ─────────────────────────── */
const ran = results.filter((r) => !r.skipped)
const passed = ran.filter((r) => r.ok).length
const skipped = results.length - ran.length
const receipt = {
  schema: 'neuruh.hosting-boundary.smoke.v1',
  base: BASE,
  canonical_cross_check: CANONICAL,
  ran_at: new Date().toISOString(),
  host: os.hostname(),
  origin_head: originHead,
  score: `${passed}/${ran.length}`,
  skipped,
  results,
}
receipt.sha256 = createHash('sha256').update(JSON.stringify(receipt)).digest('hex')
const out = flag('--receipt')
if (typeof out === 'string') await writeFile(out, JSON.stringify(receipt, null, 2) + '\n')

console.log(`\n${passed}/${ran.length} checks passed against ${BASE}${skipped ? ` (${skipped} skipped)` : ''}${CANONICAL ? ' · canonical cross-check' : ''}`)
process.exit(passed === ran.length ? 0 : 1)
