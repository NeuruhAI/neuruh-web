/**
 * Truth-source parity court for /proof/distribution.
 *
 * This route exists to replace a third-party proof page with a first-party one. That is only
 * worth doing if the first-party page cannot drift. These assertions fail when:
 *
 *   - the route hardcodes a fact that differs from canonical compiled truth
 *   - release or test totals drift between the route, /proof, and the snapshot
 *   - a surface's public state disagrees with what /proof renders
 *   - stale verification is rendered as current
 *   - a candidate becomes LIVE without canonical state supporting it
 *
 * Runs after build, against the prerendered HTML and the compiled snapshot.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)
const APP = 'apps/neuruh-web/.next/server/app'
const ROUTE_SOURCE = 'apps/neuruh-web/app/proof/distribution/page.tsx'

const snapshot = JSON.parse(await readFile('public/truth/snapshot.json', 'utf8'))
const served = JSON.parse(await readFile('apps/neuruh-web/public/truth/snapshot.json', 'utf8'))
const distributionHtml = await readFile(`${APP}/proof/distribution.html`, 'utf8')
const proofHtml = await readFile(`${APP}/proof.html`, 'utf8')
const routeSource = await readFile(ROUTE_SOURCE, 'utf8')

const object = (id) => snapshot.objects.find((candidate) => candidate.id === id)
const metric = (id, name) => object(id)?.metrics?.find((candidate) => candidate.name === name)
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ')

const SURFACES = [
  'dist-neuruh-com', 'dist-stdio-mcp', 'dist-claude-code', 'dist-public-commons',
  'dist-xai-grok', 'dist-pypi', 'dist-mcp-registry', 'dist-cursor', 'dist-copilot-cli',
]
const ALLOWED_STATES = new Set(['LIVE_PROVEN', 'INSTALLABLE', 'CANONICAL', 'EXTERNAL_REVIEW', 'BLOCKED', 'UNVERIFIED'])
/** States that assert something works. Reaching one requires canonical evidence, not prose. */
const ASSERTIVE_STATES = new Set(['LIVE_PROVEN', 'INSTALLABLE', 'CANONICAL'])

test('the served snapshot is byte-identical to the canonical one', () => {
  assert.deepEqual(served, snapshot, 'served public truth drifted from public/truth')
})

test('every distribution surface exists canonically with a defined state', () => {
  for (const id of SURFACES) {
    const surface = object(id)
    assert.ok(surface, `canonical object ${id} is missing; the route would fail to build`)
    assert.equal(surface.kind, 'system')
    assert.ok(ALLOWED_STATES.has(surface.maturity), `${id} has undefined distribution state ${surface.maturity}`)
    assert.ok(surface.limitations.length > 0, `${id} must carry at least one limitation`)
    assert.ok(surface.evidence_summary.source_refs.length > 0, `${id} must cite a source`)
  }
})

test('the route renders every canonical surface, so none can be silently dropped', () => {
  const body = text(distributionHtml)
  for (const id of snapshot.objects.filter((candidate) => candidate.kind === 'system').map((candidate) => candidate.id)) {
    assert.ok(
      distributionHtml.includes(`id="${id}"`) || body.includes(object(id).name),
      `surface ${id} exists in canonical truth but is not rendered on /proof/distribution`,
    )
  }
})

test('a surface only claims to work when canonical truth supports it', () => {
  for (const id of SURFACES) {
    const surface = object(id)
    if (!ASSERTIVE_STATES.has(surface.maturity)) continue
    assert.equal(surface.claim_class, 'OBSERVED', `${id} claims ${surface.maturity} without an OBSERVED claim class`)
    assert.notEqual(surface.truth_mode, 'BLOCKED', `${id} cannot be ${surface.maturity} while BLOCKED`)
    assert.notEqual(surface.truth_mode, 'UNKNOWN', `${id} cannot be ${surface.maturity} while UNKNOWN`)
  }
})

test('external review and unverified surfaces are never upgraded in the rendered page', () => {
  const body = text(distributionHtml)
  assert.equal(object('dist-xai-grok').maturity, 'EXTERNAL_REVIEW')
  assert.equal(object('dist-copilot-cli').maturity, 'UNVERIFIED')
  assert.equal(object('dist-copilot-cli').claim_class, 'UNVALIDATED_CLAIM')
  assert.match(body, /not accepted|Submitted is not accepted|submitted is not accepted/i)
  assert.doesNotMatch(body, /accepted by xAI|listed on the xAI|live on the xAI/i)
  assert.doesNotMatch(body, /Copilot CLI (works|verified|installs successfully)/i)
})

test('release gates render canonical values, and the zero gates are actually zero', () => {
  const body = text(distributionHtml)
  for (const name of [
    'broken_links', 'serious_accessibility_violations', 'critical_accessibility_violations',
    'secret_scan_hits', 'private_path_leaks', 'false_live_claims',
  ]) {
    const gate = metric('release-court', name)
    assert.ok(gate, `release court is missing gate ${name}`)
    assert.equal(gate.value, 0, `gate ${name} is ${gate.value}; a public release requires 0`)
  }
  assert.match(body, /Broken links 0/)
  assert.match(body, /False live claims 0/)
})

test('canonical link coverage equals what the dead-link court actually measures', async () => {
  const { stdout } = await run('node', ['scripts/verify-dead-links.mjs'])
  const measured = stdout.match(/(\d+) pages, ([\d,]+) internal refs/)
  assert.ok(measured, `could not read the dead-link court result from: ${stdout.trim()}`)
  assert.equal(
    metric('release-court', 'pages_checked').value,
    Number(measured[1]),
    'canonical pages_checked drifted from the dead-link court',
  )
  assert.equal(
    metric('release-court', 'internal_references_checked').value,
    Number(measured[2].replaceAll(',', '')),
    'canonical internal_references_checked drifted from the dead-link court',
  )
})

test('/proof and /proof/distribution agree on every shared number', () => {
  const distribution = text(distributionHtml)
  const proof = text(proofHtml)
  const shared = [
    metric('release-court', 'broken_links'),
    metric('release-court', 'serious_accessibility_violations'),
    metric('release-court', 'critical_accessibility_violations'),
    metric('dist-claude-code', 'plugin_skills'),
  ]
  for (const entry of shared) {
    const rendered = entry.value.toLocaleString('en-US')
    assert.ok(distribution.includes(rendered), `/proof/distribution does not render ${entry.name}`)
    assert.ok(proof.includes(rendered), `/proof does not render ${entry.name}`)
  }
  assert.ok(proof.includes('/proof/distribution'), '/proof must link to the distribution ledger')
})

test('the commons totals are rendered from canonical truth and correctly qualified', () => {
  const body = text(distributionHtml)
  const python = metric('public-commons', 'python_tests_at_advertised_tags')
  const all = metric('public-commons', 'passing_tests')
  assert.equal(python.value, 1336)
  assert.ok(all.value > python.value, 'the all-commons total must exceed the Python-only total')
  assert.ok(body.includes(python.value.toLocaleString('en-US')))
  // 1,336 is the Python total across the Commons suites — never the whole Neuruh test count.
  assert.match(body, /Python test total re-derived across the/i)
  assert.match(body, /not a total Neuruh test count/i)
})

test('staleness is rendered from the snapshot, never asserted as fresh', () => {
  const body = text(distributionHtml)
  assert.match(body, new RegExp(`stale ${snapshot.dataset.stale ? 'TRUE' : 'FALSE'}`, 'i'))
  assert.ok(body.includes(snapshot.living_state), 'the page must render the snapshot living state')
  assert.ok(
    body.includes(snapshot.dataset.last_verified_at.slice(0, 10)),
    'the page must render the dataset verification date',
  )
  if (snapshot.dataset.stale) {
    assert.match(body, /past its last full verification date/i, 'a stale snapshot must say so in words')
  }
})

test('the route holds no hardcoded copy of a canonical number', () => {
  // Every canonical metric value must reach the page through the truth client, never as a
  // literal in the route source. Small structural numbers (0, 1, 2) are excluded because they
  // appear in ordinary code; the values that matter here are all larger.
  const values = new Set()
  for (const candidate of snapshot.objects) {
    for (const entry of candidate.metrics ?? []) {
      if (Math.abs(entry.value) > 2) values.add(String(entry.value))
    }
  }
  // Strip the places a bare number is never a fact: string and template literals, the
  // arguments to string slicing, and inline style values. What remains is JSX-expression and
  // logic code, where a canonical number could only be a hardcoded duplicate of the truth.
  const scannable = routeSource
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, ' ')
    .replace(/\.slice\([^)]*\)/g, ' ')
    .replace(/style=\{\{[^}]*\}\}/g, ' ')
  const literals = scannable.match(/(?<![\w.$])\d[\d_]*(?:\.\d+)?/g) ?? []
  for (const literal of literals) {
    assert.ok(
      !values.has(literal),
      `${ROUTE_SOURCE} hardcodes ${literal}, which is a canonical metric value; read it from the snapshot instead`,
    )
  }
  // A duplicated fact written as text is still a duplicated fact — and the realistic drift is
  // a comma-formatted number pasted into JSX text ("1,336"), which tokenises as 1 and 336 and
  // slips past the literal scan above. JSX text is not a string literal, so it survives the same
  // stripping and can be matched whole, digit-boundary aware.
  for (const value of values) {
    for (const rendering of [value, Number(value).toLocaleString('en-US')]) {
      const pattern = new RegExp(`(?<![\\w,.])${rendering.replace('.', '\\.')}(?![\\w,.])`)
      assert.ok(
        !pattern.test(scannable),
        `${ROUTE_SOURCE} contains the canonical value ${rendering} as literal text; render it from the snapshot`,
      )
    }
  }
})

test('the route refuses to invent values when canonical truth is missing', () => {
  assert.match(routeSource, /throw new Error\(/, 'the route must fail visibly on missing truth')
  // Any nullish fallback is a silent default where a missing fact should have stopped the build.
  assert.doesNotMatch(
    routeSource,
    /\?\?(?!=)/,
    'the route must not fall back to a default for missing truth; let the accessor throw',
  )
  // Metric selection happens in exactly one place: the accessor that throws. A direct
  // `.metrics?.find(...)` anywhere else is a read that can silently yield undefined.
  const directReads = [...routeSource.matchAll(/\.metrics\?\.find\(/g)]
  assert.equal(
    directReads.length,
    1,
    'metrics must only be selected inside requireMetric, which throws when one is missing',
  )
  assert.match(routeSource, /function requireMetric/, 'requireMetric must exist')
  assert.match(routeSource, /function requireObject/, 'requireObject must exist')
})

test('candidates are not published as released', () => {
  const body = text(distributionHtml)
  assert.doesNotMatch(body, /Forensic Audit/i, 'Forensic Audit is a candidate and must not appear as a surface')
  assert.doesNotMatch(body, /automated fulfillment is live|fulfillment is automated/i)
  assert.doesNotMatch(body, /autonomy is live|fully autonomous/i)
  assert.match(body, /founder-operated/i, 'the page must state that fulfillment is founder-operated')
})

test('no local paths, private hosts, or internal identifiers reach the page', () => {
  assert.doesNotMatch(distributionHtml, /\/Users\/|\/home\/[a-z]/i)
  assert.doesNotMatch(distributionHtml, /127\.0\.0\.1|localhost:\d+|192\.168\.|10\.\d+\.\d+\.\d+/)
  assert.doesNotMatch(distributionHtml, /NEURUH-[A-Z-]*20\d{6}/, 'internal mission identifiers must not be published')
  assert.doesNotMatch(distributionHtml, /\bMother\b|\bAXON\b|\bAegis\b|\bIAR\b|recipe-engine/)
})
