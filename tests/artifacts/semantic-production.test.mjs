import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const appRoot = 'apps/neuruh-web/.next/server/app'
const routes = [
  'index', 'accessible', 'no-webgl', 'reduced-motion', 'organism', 'galaxy', 'worlds',
  'worlds/deedsonar', 'worlds/liquidity-engine', 'research/adaptive-intelligence',
  'research/case-zero', 'founder', 'proof', 'products', 'how-it-works', 'refusals', 'offers',
  'ask', 'work-with-neuruh', 'work-with-us', 'thank-you', 'cases', 'contact',
]

async function html(route) {
  return readFile(path.join(appRoot, `${route}.html`), 'utf8')
}

function mainMarkup(document) {
  return document.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? ''
}

function sectionIds(document) {
  return [...document.matchAll(/data-section="([^"]+)"/g)].map((match) => match[1])
}

test('all production routes prerender main DOM without canvas or fake LIVE mode', async () => {
  for (const route of routes) {
    const document = await html(route)
    assert.match(document, /<main[^>]+id="main"/i, route)
    assert.doesNotMatch(document, /<canvas\b/i, route)
    assert.doesNotMatch(document, /data-truth-mode="LIVE"/, route)
  }
})

test('accessible, no-WebGL, reduced-motion, and primary homepage carry identical story DOM', async () => {
  const accessible = await html('accessible')
  const noWebgl = await html('no-webgl')
  const reduced = await html('reduced-motion')
  const home = await html('index')
  assert.equal(mainMarkup(accessible), mainMarkup(noWebgl))
  assert.equal(mainMarkup(home), mainMarkup(accessible))
  assert.equal(mainMarkup(reduced), mainMarkup(accessible))
  const ids = sectionIds(home)
  assert.ok(ids.length >= 10, `homepage story has ${ids.length} sections`)
  for (const required of ['hero', 'offers', 'proof-strip', 'how-it-works', 'flagship', 'products', 'engine', 'proof', 'boundaries', 'founder', 'cta']) {
    assert.ok(ids.includes(required), `missing section ${required}`)
  }
})

test('keyboard route, skip link, and trace controls are present in production DOM', async () => {
  const document = await html('index')
  assert.match(document, /<a[^>]+href="\/organism"[^>]*>Organism<\/a>/)
  assert.match(document, /<a[^>]+href="#main"[^>]*>Skip to content<\/a>/)
  assert.match(document, /<button[^>]+data-testid="trace-start"/)
  const clientSource = await readFile('apps/neuruh-web/components/PipelineTrace.tsx', 'utf8')
  assert.match(clientSource, /event\.key === 'r'/)
})

test('homepage transfer stays within budget and loads zero scene implementation bytes', async () => {
  const document = await html('index')
  const tags = [...document.matchAll(/<(?:link|script)\b[^>]+(?:href|src)="(\/_next\/static\/[^"]+\.(?:js|css))"[^>]*>/g)]
  const refs = new Set(tags.filter((match) => !/\bnoModule\b/.test(match[0])).map((match) => match[1]))
  let transferBytes = gzipSync(document).byteLength
  for (const ref of refs) {
    const file = path.join('apps/neuruh-web/.next/static', ref.slice('/_next/static/'.length))
    const body = await readFile(file)
    transferBytes += gzipSync(body).byteLength
    assert.doesNotMatch(body.toString('utf8'), /neuruh-tissue-instanced-state|renderTransmissionPass|MeshTransmissionMaterial/, ref)
  }
  console.log(`homepage artifact transfer estimate: ${(transferBytes / 1024).toFixed(1)} KB gzip`)
  assert.ok(transferBytes <= 180 * 1024, `${transferBytes} exceeds homepage budget`)
})

test('commercial routes emit per-page Open Graph, JSON-LD, and the work-with-us alias', async () => {
  const home = await html('index')
  assert.match(home, /application\/ld\+json/)
  assert.match(home, /"@type":"Organization"/)
  assert.match(home, /"@type":"WebSite"/)
  assert.match(home, /"@type":"Service"/)
  assert.doesNotMatch(home, /Mother|\bAXON\b|scoring weights/)

  const pairs = [
    ['offers', 'https://neuruh.com/offers', 'Offers'],
    ['ask', 'https://neuruh.com/ask', 'Ask Neuruh'],
    ['work-with-neuruh', 'https://neuruh.com/work-with-neuruh', 'Work with Neuruh'],
    ['thank-you', 'https://neuruh.com/thank-you', 'Thank you'],
    ['cases', 'https://neuruh.com/cases', 'Cases'],
    ['proof', 'https://neuruh.com/proof', 'Proof'],
    ['contact', 'https://neuruh.com/contact', 'Contact'],
  ]
  for (const [route, url, title] of pairs) {
    const document = await html(route)
    assert.match(document, new RegExp(`property="og:url" content="${url}"`))
    assert.match(document, new RegExp(`property="og:title" content="${title}`))
  }

  const alias = await html('work-with-us')
  assert.match(alias, /Buy a scoped piece of work/)
  assert.match(alias, /rel="canonical" href="https:\/\/neuruh.com\/work-with-neuruh"/)
})

test('Galaxy production DOM exposes contradiction and sourced relationship ledger', async () => {
  const document = await html('galaxy')
  assert.match(document, /data-contradiction-id="galaxy-connectivity-boundary"/)
  assert.match(document, /Relationship ledger/)
  assert.match(document, /Source[\s\S]{0,30}src-/)
  assert.match(document, /No canvas, orbit, or illustrative edge\./)
})
