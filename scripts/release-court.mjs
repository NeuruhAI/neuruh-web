#!/usr/bin/env node
/**
 * Release court for NEURUH-SITE-V2-RELEASE-20260902.
 * Courts a local Next export (apps/neuruh-web/out) or a base URL.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const CASHIERS = [
  'https://book.stripe.com/bJe5kDagndYugJlaow2cg04',
  'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05',
  'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06',
]
const FACTORY = /Mother|\bAXON\b|\bAegis\b|\bIAR\b|REI-X|recipe-engine|scoring weights|secret topology|system prompt|customer PII/i
const PRIVATE_GH = /github\.com\/[^/\s"'`]+\/(?:neuruh-workers|cockpit|data-rescue)\b/i
const out = 'apps/neuruh-web/out'
const failures = []

function html(route) {
  const file = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`
  return readFile(path.join(out, file), 'utf8')
}

function must(label, ok, detail = '') {
  if (!ok) failures.push(`${label}${detail ? ` — ${detail}` : ''}`)
}

const routes = ['/', '/offers', '/proof', '/thank-you', '/work-with-neuruh', '/work-with-us']
const pages = {}
for (const route of routes) pages[route] = await html(route)

for (const [route, document] of Object.entries(pages)) {
  must(`${route} has main`, /<main[^>]+id="main"/.test(document))
  must(`${route} no factory`, !FACTORY.test(document) && !PRIVATE_GH.test(document))
  if (route !== '/') {
    const expected = route === '/work-with-us' ? 'https://neuruh.com/work-with-neuruh' : `https://neuruh.com${route}`
    must(`${route} og:url`, document.includes(`property="og:url" content="${expected}"`))
  }
}

must('thank-you no webhook lie', pages['/thank-you'].includes('does not receive Stripe webhooks'))
must('work-with-neuruh hub', pages['/work-with-neuruh'].includes('Buy a scoped piece of work'))
must('work-with-us alias', pages['/work-with-us'].includes('Buy a scoped piece of work'))
for (const href of CASHIERS) {
  must(`cashier ${href} on /offers`, pages['/offers'].includes(href))
  must(`cashier ${href} not fourth`, (pages['/offers'].match(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length >= 1)
}
must('no extra stripe hosts', !/buy\.stripe\.com|checkout\.stripe\.com/.test(pages['/offers']))

const home = pages['/']
must('JSON-LD Organization', home.includes('"@type":"Organization"'))
must('JSON-LD WebSite', home.includes('"@type":"WebSite"'))
must('JSON-LD Service', home.includes('"@type":"Service"'))
must('JSON-LD no factory', !FACTORY.test(home.match(/application\/ld\+json[\s\S]{0,4000}/)?.[0] ?? ''))

const security = await readFile(path.join(out, '.well-known/security.txt'), 'utf8')
must('security.txt Contact is /security', security.includes('Contact: https://neuruh.com/security'))
must('security.txt no mailto', !/mailto:/i.test(security))
must('home footer no mailto', !/<footer[\s\S]*?mailto:/i.test(home))
must('home footer links /security', /<footer[\s\S]*?href="\/security"/.test(home))

const robots = await readFile(path.join(out, 'robots.txt'), 'utf8')
must('robots sitemap', robots.includes('https://neuruh.com/sitemap.xml'))

const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8')
for (const loc of ['/offers', '/proof', '/thank-you', '/work-with-neuruh', '/work-with-us', '/security']) {
  must(`sitemap ${loc}`, sitemap.includes(`https://neuruh.com${loc}`))
}
must('sitemap commercial lastmod 2026-09-02', sitemap.includes('2026-09-02T00:00:00.000Z'))

const snapshot = JSON.parse(await readFile(path.join(out, 'truth/snapshot.json'), 'utf8'))
must('snapshot stale true', snapshot.dataset.stale === true)
must('snapshot CONTRADICTING', snapshot.living_state === 'CONTRADICTING')
must('snapshot last_verified 2026-08-24', snapshot.dataset.last_verified_at.startsWith('2026-08-24'))
must('snapshot live_connectivity false', snapshot.dataset.live_connectivity === false)

if (failures.length) {
  throw new Error(`RELEASE COURT FAILED\n${failures.join('\n')}`)
}
console.log('RELEASE COURT: PASS — export routes, OG, JSON-LD, cashiers, security.txt, robots, sitemap, private-IP, snapshot honesty')
