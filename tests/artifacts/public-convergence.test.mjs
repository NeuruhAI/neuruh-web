import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Built-HTML smoke for the 2026-09-16 convergence surfaces: /solve, /problems/*, /faq, and the
 * evidence modes on /proof. Runs against the prerendered server output, like the other artifact courts.
 */
const APP = 'apps/neuruh-web/.next/server/app'
// React separates adjacent text nodes with empty comments; the visible text is what is courted.
const html = async (route) => (await readFile(path.join(APP, `${route}.html`), 'utf8')).replace(/<!-- -->/g, '')
const PROBLEMS = [
  'data-you-cannot-use', 'ai-you-cannot-verify', 'workflows-that-break',
  'property-data-without-opportunity', 'automation-without-authority', 'systems-nobody-can-explain',
]
const snapshot = JSON.parse(await readFile('public/truth/snapshot.json', 'utf8'))

function canonical(document, route) {
  assert.ok(document.includes(`<link rel="canonical" href="https://neuruh.com${route}"/>`), `${route} canonical`)
  assert.ok(document.includes(`property="og:url" content="https://neuruh.com${route}"`), `${route} og:url`)
  assert.match(document, /<main[^>]+id="main"/, `${route} main`)
  assert.doesNotMatch(document, /data-truth-mode="LIVE"|living state|live connectivity NONE/, `${route} machine-state banner`)
}

test('/solve prerenders the target front door with no outbound form', async () => {
  const document = await html('solve')
  canonical(document, '/solve')
  assert.match(document, /Give Neuruh a target/)
  assert.match(document, /data-testid="solve-input"/)
  for (const name of ['property', 'business', 'data', 'opportunity', 'research', 'other']) assert.match(document, new RegExp(`data-testid="solve-class-${name}"`))
  assert.doesNotMatch(document, /<form[^>]+action="http/i, 'the target is never posted anywhere')
})

test('every failure-mode page carries a dated, mode-labeled proof, a boundary and one attributed action', async () => {
  const index = await html('problems')
  canonical(index, '/problems')
  for (const slug of PROBLEMS) {
    const document = await html(`problems/${slug}`)
    canonical(document, `/problems/${slug}`)
    assert.ok(index.includes(`/problems/${slug}`), `index links ${slug}`)
    const proof = document.match(/data-testid="problem-proof"[\s\S]*?<\/article>/)?.[0] ?? ''
    assert.match(proof, /Proof · (VERIFIED SNAPSHOT|ATTESTED|HISTORICAL)/, `${slug} proof mode`)
    assert.match(proof, /as of <time dateTime="\d{4}-\d{2}-\d{2}">/, `${slug} proof date`)
    assert.match(proof, /not a live feed/, `${slug} proof ceiling`)
    assert.match(document, /data-testid="problem-boundary"/, `${slug} boundary`)
    const cta = document.match(/<a[^>]+data-testid="problem-cta"[^>]*>/)?.[0] ?? ''
    assert.match(cta.replace(/&amp;/g, '&'), /client_reference_id=root-o0[125]"|utm_source=neuruh&utm_medium=site&utm_campaign=root&utm_content=/, `${slug} CTA attributed`)
  }
})

test('/faq publishes FAQPage structured data that matches the visible answers', async () => {
  const document = await html('faq')
  canonical(document, '/faq')
  const block = [...document.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .find((data) => data['@type'] === 'FAQPage')
  assert.ok(block, 'FAQPage JSON-LD present')
  assert.ok(block.mainEntity.length >= 8)
  for (const question of block.mainEntity) {
    assert.equal(question['@type'], 'Question')
    assert.ok(document.includes(question.name.replace(/’/g, '’')), `visible question: ${question.name}`)
  }
})

test('/proof labels VERIFIED SNAPSHOT, ATTESTED and HISTORICAL figures and keeps the superseded court count off the page', async () => {
  const document = await html('proof')
  for (const mode of ['VERIFIED SNAPSHOT', 'ATTESTED', 'HISTORICAL']) assert.ok(document.includes(`data-evidence-mode="${mode}"`), mode)
  assert.ok(document.includes(snapshot.dataset.last_verified_at.slice(0, 10)), 'verification date rendered')
  // Founder ruling 2026-09-25: the superseded 2026-08-23 test-count court is not shown on /proof at all.
  assert.doesNotMatch(document, /1,510 tests|tests green at release/, 'the 2026-08-23 court count must not render on /proof')
  assert.doesNotMatch(document, /06cbb841/, 'the 2026-09-14 production tree is not presented as current')
  const estate = snapshot.objects.find((o) => o.id === 'deedsonar').metrics.find((m) => m.name === 'current_estate_properties')
  assert.ok(document.includes(estate.value.toLocaleString('en-US')), 'current estate figure rendered from the snapshot')
})

test('sitemap lists the convergence routes', async () => {
  const sitemap = await readFile(path.join(APP, 'sitemap.xml.body'), 'utf8').catch(() => readFile(path.join(APP, 'sitemap.xml'), 'utf8'))
  for (const route of ['/solve', '/problems', '/faq', ...PROBLEMS.map((slug) => `/problems/${slug}`)]) {
    assert.ok(sitemap.includes(`<loc>https://neuruh.com${route}</loc>`), route)
  }
})
