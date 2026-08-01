import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const appRoot = 'apps/neuruh-web/.next/server/app'
const routes = [
  'index', 'accessible', 'no-webgl', 'reduced-motion', 'organism', 'galaxy', 'worlds',
  'worlds/deedsonar', 'research/adaptive-intelligence', 'research/case-zero', 'founder', 'proof',
]

async function html(route) {
  return readFile(path.join(appRoot, `${route}.html`), 'utf8')
}

function mainMarkup(document) {
  return document.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? ''
}

function truthTuples(document) {
  return [...document.matchAll(/<section[^>]+data-chapter-id="([^"]+)"[^>]+data-state="([^"]+)"[^>]+data-truth-mode="([^"]+)"/g)]
    .map((match) => match.slice(1))
}

test('all semantic production routes prerender main DOM without canvas or fake LIVE mode', async () => {
  for (const route of routes) {
    const document = await html(route)
    assert.match(document, /<main[^>]+id="main"/i, route)
    assert.doesNotMatch(document, /<canvas\b/i, route)
    assert.doesNotMatch(document, /data-truth-mode="LIVE"/, route)
  }
})

test('accessible, no-WebGL, reduced-motion, and tier-zero truth tuples are identical', async () => {
  const accessible = await html('accessible')
  const noWebgl = await html('no-webgl')
  const reduced = await html('reduced-motion')
  const tierZero = await html('index')
  assert.equal(mainMarkup(accessible), mainMarkup(noWebgl))
  assert.equal(truthTuples(accessible).length, 11)
  assert.deepEqual(truthTuples(noWebgl), truthTuples(accessible))
  assert.deepEqual(truthTuples(reduced), truthTuples(accessible))
  assert.deepEqual(truthTuples(tierZero), truthTuples(accessible))
})

test('native keyboard route and trace controls are present in semantic production DOM', async () => {
  const document = await html('index')
  assert.match(document, /<a[^>]+href="\/organism"[^>]*>Organism<\/a>/)
  assert.match(document, /<a[^>]+href="#main"[^>]*>Skip to content<\/a>/)
  assert.match(document, /<button[^>]+data-testid="trace-start"/)
  const clientSource = await readFile('apps/neuruh-web/components/NeuruhExperience.tsx', 'utf8')
  for (const key of ['ArrowDown', 'ArrowUp', "event.key === 't'", "event.key === 'r'"]) assert.match(clientSource, new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
})

test('tier-zero modern-browser transfer stays within budget and loads zero scene implementation bytes', async () => {
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
  console.log(`tier0 artifact transfer estimate: ${(transferBytes / 1024).toFixed(1)} KB gzip`)
  assert.ok(transferBytes <= 180 * 1024, `${transferBytes} exceeds tier-zero budget`)
})

test('Galaxy production DOM exposes contradiction and sourced relationship ledger', async () => {
  const document = await html('galaxy')
  assert.match(document, /data-contradiction-id="galaxy-connectivity-boundary"/)
  assert.match(document, /Relationship ledger/)
  assert.match(document, /Source[\s\S]{0,30}src-/)
  assert.match(document, /No canvas, orbit, or illustrative edge\./)
})
