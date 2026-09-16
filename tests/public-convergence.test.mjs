import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { PROBLEM_SLUGS, PUBLIC_PROBLEMS } from '../apps/neuruh-web/lib/publicProblems.ts'
import { SOLVE_CLASSES, SOLVE_ROUTES } from '../apps/neuruh-web/lib/publicSolve.ts'

/**
 * Issue #10 convergence court (2026-09-16): the front door, the discovery cluster and the answer surface
 * exist, and the negative controls from Workstream 10 hold — no hardcoded public numbers, no stale truth
 * presented as live, no invented price or cashier, no invented live connectivity, no figure without its
 * wording ceiling, no broken canonical link.
 */
const source = (file) => readFile(file, 'utf8')
const snapshot = JSON.parse(await readFile('public/truth/snapshot.json', 'utf8'))
const metric = (object, name) => snapshot.objects.find((o) => o.id === object)?.metrics?.find((m) => m.name === name)

const REQUIRED_PROBLEMS = [
  'data-you-cannot-use', 'ai-you-cannot-verify', 'workflows-that-break',
  'property-data-without-opportunity', 'automation-without-authority', 'systems-nobody-can-explain',
]
const NEW_SOURCES = [
  'apps/neuruh-web/app/solve/page.tsx', 'apps/neuruh-web/components/SolveTarget.tsx', 'apps/neuruh-web/lib/publicSolve.ts',
  'apps/neuruh-web/app/problems/page.tsx', 'apps/neuruh-web/app/problems/[slug]/page.tsx', 'apps/neuruh-web/lib/publicProblems.ts',
  'apps/neuruh-web/app/faq/page.tsx', 'apps/neuruh-web/lib/publicFaq.ts', 'apps/neuruh-web/lib/publicProofFacts.ts',
]
const FACTORY = /Mother|\bAXON\b|\bAegis\b|\bIAR\b|REI-X|recipe[- ]engine|scoring weights|secret topology|system prompt|customer PII|Founder Runtime|Switchboard|Honey Pot|Sentinel\b|\bSOPS\b/

test('the six discovery pages, /solve and /faq exist and are in the sitemap', async () => {
  assert.deepEqual(PROBLEM_SLUGS, REQUIRED_PROBLEMS)
  for (const file of NEW_SOURCES) assert.ok(existsSync(file), file)
  const sitemap = await source('apps/neuruh-web/app/sitemap.ts')
  for (const route of ["'/solve'", "'/problems'", "'/faq'", 'PROBLEM_SLUGS.map']) assert.ok(sitemap.includes(route), route)
  for (const [file, route] of [['apps/neuruh-web/app/solve/page.tsx', '/solve'], ['apps/neuruh-web/app/problems/page.tsx', '/problems'], ['apps/neuruh-web/app/faq/page.tsx', '/faq']]) {
    assert.match(await source(file), new RegExp(`path: '${route}'`), `${file} canonical path must equal its route`)
  }
  assert.match(await source('apps/neuruh-web/app/problems/[slug]/page.tsx'), /path: `\/problems\/\$\{slug\}`/)
  assert.match(await source('apps/neuruh-web/components/HomeV2.tsx'), /href="\/solve">Give Neuruh a target</)
})

test('negative control — no hardcoded public numbers: every figure on the new surfaces is a snapshot reference', async () => {
  for (const p of PUBLIC_PROBLEMS) {
    for (const key of ['title', 'description', 'failure', 'capability', 'proofClaim', 'boundary']) {
      assert.doesNotMatch(p[key], /\d/, `${p.slug}.${key} carries a literal number`)
    }
    for (const line of [...p.whyToolsFail, ...p.evidenceNeeded]) assert.doesNotMatch(line, /\d/, `${p.slug} list carries a literal number`)
    assert.ok(metric(p.proof.object, p.proof.metric), `${p.slug} proof ${p.proof.object}.${p.proof.metric} must exist in the compiled snapshot`)
  }
  for (const name of SOLVE_CLASSES) {
    const route = SOLVE_ROUTES[name]
    for (const key of ['mission', 'receive', 'proofClaim']) assert.doesNotMatch(route[key], /\d/, `${name}.${key} carries a literal number`)
    assert.ok(metric(route.proof.object, route.proof.metric), `${name} proof must exist in the compiled snapshot`)
    assert.ok(PROBLEM_SLUGS.includes(route.problemSlug), `${name} routes to a real failure mode`)
  }
  const faq = await source('apps/neuruh-web/lib/publicFaq.ts')
  const answers = faq.slice(faq.indexOf('PUBLIC_FAQ = ['), faq.indexOf('] as const'))
  assert.doesNotMatch(answers, /\d/, 'FAQ answers carry no figure of their own; figures live on /proof')
})

test('negative control — no invented price, cashier or booking URL on the new surfaces', async () => {
  for (const file of NEW_SOURCES) {
    const text = await source(file)
    assert.doesNotMatch(text, /\$\s?\d/, `${file} prints a price that is not read from the offer catalog`)
    assert.doesNotMatch(text, /stripe\.com|cal\.com\/|https:\/\/re\.neuruh\.com/, `${file} hardcodes a commercial URL instead of the attribution spine`)
    assert.doesNotMatch(text, FACTORY, `${file} leaks an internal name`)
  }
  for (const file of ['apps/neuruh-web/app/problems/[slug]/page.tsx', 'apps/neuruh-web/app/solve/page.tsx']) {
    const text = await source(file)
    assert.match(text, /offerHref\(offer\)/, `${file} must attribute its cashier through offerHref`)
    assert.match(text, /estateHref\(/, `${file} must attribute the real-estate front door through estateHref`)
  }
})

test('negative control — no stale truth presented as live, no invented live connectivity', async () => {
  const pkg = JSON.parse(await source('package.json'))
  assert.equal(snapshot.dataset.live_connectivity, false)
  assert.equal(snapshot.dataset.stale, false, 'the served snapshot must be compiled at its own verification instant')
  assert.equal(pkg.scripts['compile:truth'].match(/--as-of=(\S+)/)[1], snapshot.dataset.last_verified_at)
  assert.notEqual(snapshot.dataset.truth_mode, 'LIVE')
  assert.equal(snapshot.objects.some((o) => o.truth_mode === 'LIVE'), false)
  for (const file of ['apps/neuruh-web/components/HomeV2.tsx', 'apps/neuruh-web/components/SiteFooter.tsx', ...NEW_SOURCES, 'apps/neuruh-web/app/proof/page.tsx']) {
    assert.doesNotMatch(await source(file), /live connectivity|living state|CONTRADICTING/, `${file} renders machine state as a status`)
  }
  // A superseded figure is HISTORICAL in the snapshot, never current.
  assert.equal(metric('deedsonar', 'tests_green_at_production_sha').classification, 'HISTORICAL')
  assert.equal(metric('deedsonar', 'customer_tape_steps_reachable_20260914').classification, 'HISTORICAL')
  assert.equal(metric('deedsonar', 'current_estate_properties').as_of.slice(0, 10), snapshot.dataset.last_verified_at.slice(0, 10))
  const surfaces = ['apps/neuruh-web/lib/publicCaseStudies.ts', 'apps/neuruh-web/lib/top10.ts', 'apps/neuruh-web/components/CaseStudyGrid.tsx', 'apps/neuruh-web/app/proof/page.tsx']
  for (const file of surfaces) {
    const text = await source(file)
    assert.doesNotMatch(text, /06cbb841/, `${file} still presents the 2026-09-14 production tree as current`)
    assert.doesNotMatch(text, /already-public production SHA|court is green: 1,510|production court records 1,510/, `${file} presents the 2026-08-23 court as current`)
  }
})

test('negative control — no figure without its wording ceiling', async () => {
  const proof = await source('apps/neuruh-web/app/proof/page.tsx')
  // Every evidence line that interpolates a snapshot figure opens with that figure's evidence mode.
  const lines = [...proof.matchAll(/`([^`]*\$\{(?:fmt\()?n\([^`]*)`/g)].map((m) => m[1])
  assert.ok(lines.length >= 8, 'expected the evidence lines on /proof')
  for (const line of lines) assert.match(line, /\$\{mode\(/, `evidence line without a mode: ${line.slice(0, 80)}`)
  assert.match(proof, /data-testid="evidence-modes"/)
  const problem = await source('apps/neuruh-web/app/problems/[slug]/page.tsx')
  for (const field of ['fact.mode', 'fact.asOf', 'not a live feed']) assert.ok(problem.includes(field), `problem proof missing ${field}`)
  const solve = await source('apps/neuruh-web/app/solve/page.tsx')
  for (const field of ['fact.asOf', 'fact.mode', 'not a live feed']) assert.ok(solve.includes(field), `solve proof missing ${field}`)
})

test('/solve keeps the target in the browser and routes only to existing offers', async () => {
  const component = await source('apps/neuruh-web/components/SolveTarget.tsx')
  assert.doesNotMatch(component, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|action=/, 'the target text must never leave the browser')
  assert.match(component, /nothing you type is sent, stored, or read/)
  assert.deepEqual([...SOLVE_CLASSES], ['Property', 'Business', 'Data', 'Opportunity', 'Research', 'Other'])
  for (const name of SOLVE_CLASSES) assert.ok(['O01', 'O02', 'O05', 'FSA'].includes(SOLVE_ROUTES[name].offerId), name)
})
