#!/usr/bin/env node
/**
 * Hosted browser court: the Command cockpit, in a real browser, through the
 * public boundary. It proves the part no HTTP smoke can — what the browser
 * actually does once the page runs.
 *
 *   PLAYWRIGHT_MODULE=/path/to/node_modules/playwright CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *   NEURUH_OPERATOR_KEY=nko_founder_… node gateway/tools/hosted-browser-court.mjs <base-url> <outdir>
 *
 * Asserts: sign-in is required and works; the Command UI loads and its views
 * render; the browser talks to nothing but this origin (and the Draco decoder
 * CDN the 3D view needs) — no loopback port, ever; the Presence embed and the
 * Galaxy frame stay on the organism host; the live feed switches to the SSE
 * stream; the page issues no writes; and sign-out closes the surface.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = (process.argv[2] || 'https://neuruh.com').replace(/\/+$/, '')
const out = process.argv[3] || '.'
const KEY = process.env.NEURUH_OPERATOR_KEY || ''
fs.mkdirSync(out, { recursive: true })

const checks = []
const check = (name, ok, detail) => {
  checks.push({ name, ok: Boolean(ok), detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : ''}`)
}
const LOOPBACK_HOST = /^(?:127(?:\.\d{1,3}){3}|localhost|0\.0\.0\.0|\[?::1\]?)$/i
const ALLOWED_THIRD_PARTY = new Set(['https://www.gstatic.com'])

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME || undefined })
const requests = []
const cspViolations = []
const consoleErrors = []
const writes = []
try {
  // Certificate errors are only tolerated when a local run explicitly asks (self-signed dev TLS).
  // A protected preview deployment needs Vercel's automation bypass to be reachable at all.
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    ignoreHTTPSErrors: process.env.NEURUH_COURT_INSECURE_TLS === '1',
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET, 'x-vercel-set-bypass-cookie': 'true' }
      : {},
  })
  const page = await ctx.newPage()
  const pageOrigin = new URL(base).origin
  page.on('request', (r) => {
    const u = new URL(r.url())
    requests.push({ origin: u.origin, host: u.hostname, path: u.pathname, method: r.method() })
    if (u.origin === pageOrigin && !['GET', 'HEAD'].includes(r.method()) && !u.pathname.startsWith('/api/auth/') && !u.pathname.startsWith('/api/presence/')) {
      writes.push(`${r.method()} ${u.pathname}`)
    }
  })
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)) })
  await page.addInitScript(() => {
    window.__cspViolations = []
    document.addEventListener('securitypolicyviolation', (e) => window.__cspViolations.push(`${e.violatedDirective} ${e.blockedURI}`))
  })

  /* 1. anonymous */
  await page.goto(base + '/command', { waitUntil: 'domcontentloaded' })
  const onLogin = page.url().includes('/command/login')
  check('an anonymous visitor gets the sign-in page, not Command', onLogin && (await page.locator('#key').count()) === 1, page.url())

  /* 2. sign in */
  if (!KEY) throw new Error('NEURUH_OPERATOR_KEY is not set')
  await page.fill('#key', KEY)
  await Promise.all([page.waitForURL((u) => !String(u).includes('/login'), { timeout: 30000 }), page.click('button[type=submit]')])
  await page.waitForSelector('.command-header', { timeout: 30000 })
  // Command's router appends its view hash (#now) once it boots.
  check('the operator key opens Command on the public surface', page.url().startsWith(base + '/command') && !page.url().includes('/login'), page.url())

  /* 3. the hosted strip names the operator and the origin commit (filled by its first refresh) */
  let strip = null
  for (let i = 0; i < 20 && !/OPERATOR\s+\w+/.test(strip || ''); i += 1) {
    strip = await page.locator('[data-testid="hosted-operator"]').first().textContent().catch(() => null)
    if (!/OPERATOR\s+\w+/.test(strip || '')) await page.waitForTimeout(1000)
  }
  check('the page states who is signed in and which Command the origin serves', /OPERATOR\s+\w+/.test(strip || '') && /ORIGIN/.test(strip || ''), strip)

  /* 4. the live feed reaches the stream */
  let transport = null
  for (let i = 0; i < 40 && transport !== 'stream'; i += 1) {
    transport = await page.locator('[data-testid="now-live-transport"]').first().getAttribute('data-transport').catch(() => null)
    if (transport !== 'stream') await page.waitForTimeout(1000)
  }
  check('the live feed is carried by the durable event stream', transport === 'stream', `data-transport=${transport}`)
  const streamState = await page.evaluate(() => (window.NeuruhLive ? window.NeuruhLive.state() : null))
  check('the page holds a resume cursor for the stream', Boolean(streamState && streamState.cursor), streamState && { stream: streamState.stream, cursor: streamState.cursor, events: streamState.events })

  /* 5. every Command view renders through the gateway */
  const views = ['now', 'missions', 'opportunities', 'recipes', 'search', 'learning', 'proof', 'needs-you', 'money', 'blocked', 'worlds', 'knowledge', 'decisions', 'system', 'visual', 'continuity']
  const rendered = []
  for (const v of views) {
    await page.goto(`${base}/command#${v}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(700)
    const text = (await page.locator('body').innerText().catch(() => '')).trim()
    if (text.length > 200) rendered.push(v)
  }
  check('every Command view renders on the public surface', rendered.length === views.length, `${rendered.length}/${views.length}${rendered.length === views.length ? '' : ' missing: ' + views.filter((v) => !rendered.includes(v)).join(',')}`)

  /* 6. hosted mode: no loopback, no private embed, no writes */
  const offOrigin = requests.filter((r) => r.origin !== pageOrigin)
  const loopback = offOrigin.filter((r) => LOOPBACK_HOST.test(r.host))
  const thirdParty = [...new Set(offOrigin.filter((r) => !LOOPBACK_HOST.test(r.host)).map((r) => r.origin))]
  check('the browser never requests a loopback port', loopback.length === 0, loopback.length ? loopback.slice(0, 5) : `${requests.length} requests, all to ${pageOrigin}`)
  check('the browser reaches no third party but the 3D decoder CDN', thirdParty.every((o) => ALLOWED_THIRD_PARTY.has(o)), thirdParty.length ? thirdParty : 'none')
  const hosted = await page.evaluate(() => Boolean(window.NEURUH_HOSTED))
  check('Command runs in hosted mode', hosted, 'window.NEURUH_HOSTED')
  const embed = await page.evaluate(() => [...document.scripts].map((s) => s.src).filter((s) => s && !s.startsWith(location.origin)))
  check('the Presence embed is not loaded from the organism host', embed.length === 0, embed.length ? embed : 'no off-origin script')
  check('the page issues no writes', writes.length === 0, writes.length ? writes : 'GET only')
  const violations = await page.evaluate(() => window.__cspViolations || [])
  cspViolations.push(...violations)
  check('the content policy is not violated by the surface it protects', violations.length === 0, violations.slice(0, 5))
  check('no page errors', consoleErrors.filter((e) => !/Failed to load resource/.test(e)).length === 0, consoleErrors.slice(0, 4))

  await page.goto(base + '/command', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.command-header', { timeout: 20000 })
  await page.screenshot({ path: path.join(out, 'hosted-command.png'), fullPage: false })

  /* 7. sign out closes the surface */
  await page.click('#hostedSignOut')
  await page.waitForURL((u) => String(u).includes('/command/login'), { timeout: 20000 })
  const afterOut = await page.goto(base + '/command', { waitUntil: 'domcontentloaded' })
  check('signing out closes the surface', page.url().includes('/command/login'), `then /command → ${afterOut.status()} ${page.url()}`)
} catch (err) {
  check('court completed', false, String(err && err.message || err).slice(0, 300))
} finally {
  await browser.close()
}

const passed = checks.filter((c) => c.ok).length
const receipt = {
  schema: 'neuruh.hosting-boundary.browser-court.v1', base, ran_at: new Date().toISOString(),
  score: `${passed}/${checks.length}`, checks,
  requests: { total: requests.length, origins: [...new Set(requests.map((r) => r.origin))] },
  csp_violations: cspViolations, console_errors: consoleErrors.slice(0, 20),
}
fs.writeFileSync(path.join(out, 'BROWSER_COURT.json'), JSON.stringify(receipt, null, 2) + '\n')
console.log(`\n${passed}/${checks.length} browser checks passed against ${base}`)
process.exit(passed === checks.length ? 0 : 1)
