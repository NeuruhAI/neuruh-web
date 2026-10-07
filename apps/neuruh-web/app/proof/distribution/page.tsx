import Link from 'next/link'
import signature from '../../../../../public/truth/signature.json'
import { getPublicObject, getPublicObjects, getPublicSnapshot } from '../../../../../packages/public-truth/client'
import { EvidenceDisclosure, TruthModeBadge } from '../../../components/TruthPrimitives'
import type { ClassifiedMetric, PublicObject } from '../../../../../packages/public-truth/types'
import { pageMeta } from '../../../lib/publicSeo'
import styles from '../../../components/DistributionProof.module.css'

export const metadata = pageMeta({
  path: '/proof/distribution',
  title: 'Distribution proof',
  description:
    'Where Neuruh is actually published, and in what state: live, installable, canonical, in external review, blocked, or unverified — each compiled from the same dated truth snapshot as the rest of this site.',
})

/**
 * The order distribution surfaces are read in. Every id must resolve to a canonical
 * `system` object in the compiled snapshot; a missing one fails the build rather than
 * rendering a surface with invented state.
 */
const SURFACE_ORDER = [
  'dist-neuruh-com',
  'dist-stdio-mcp',
  'dist-claude-code',
  'dist-public-commons',
  'dist-xai-grok',
  'dist-pypi',
  'dist-mcp-registry',
  'dist-cursor',
  'dist-copilot-cli',
] as const

/** What each distribution state means, so a reader never has to infer it. */
const STATE_MEANING: Record<string, string> = {
  LIVE_PROVEN: 'Exercised end to end on the stated date.',
  INSTALLABLE: 'Installs from a public source; read its limitation before relying on it.',
  CANONICAL: 'Published and verified against its own index.',
  EXTERNAL_REVIEW: 'Submitted and waiting on someone else. Not accepted, not live.',
  BLOCKED: 'Cannot proceed. The reason is stated, not softened.',
  UNVERIFIED: 'Never actually run. Not claimed to work.',
}

function requireObject(id: string): PublicObject {
  const object = getPublicObject(id)
  if (!object) {
    throw new Error(
      `distribution proof: canonical truth object "${id}" is missing from the compiled snapshot. ` +
        'This page renders compiled truth only and will not invent a value.',
    )
  }
  return object
}

function requireMetric(object: PublicObject, name: string): ClassifiedMetric {
  const metric = object.metrics?.find((candidate) => candidate.name === name)
  if (!metric) {
    throw new Error(
      `distribution proof: canonical metric "${name}" is missing from object "${object.id}". ` +
        'This page renders compiled truth only and will not invent a value.',
    )
  }
  return metric
}

const day = (iso: string) => iso.slice(0, 10)

export default function DistributionProofPage() {
  const snapshot = getPublicSnapshot()
  const surfaces = SURFACE_ORDER.map(requireObject)
  const commons = requireObject('public-commons')
  const court = requireObject('release-court')
  const mcp = requireObject('dist-stdio-mcp')
  const claude = requireObject('dist-claude-code')

  // Every surface object carried in the snapshot, so an added surface cannot go unrendered.
  const unlisted = getPublicObjects('system').filter(
    (object) => !SURFACE_ORDER.includes(object.id as (typeof SURFACE_ORDER)[number]),
  )

  const gates: Array<[string, ClassifiedMetric]> = [
    ['Broken links', requireMetric(court, 'broken_links')],
    ['Serious accessibility violations', requireMetric(court, 'serious_accessibility_violations')],
    ['Critical accessibility violations', requireMetric(court, 'critical_accessibility_violations')],
    ['Secret-scan hits', requireMetric(court, 'secret_scan_hits')],
    ['Private-path leaks', requireMetric(court, 'private_path_leaks')],
    ['False live claims', requireMetric(court, 'false_live_claims')],
  ]
  const pagesChecked = requireMetric(court, 'pages_checked')
  const viewports = requireMetric(court, 'accessibility_viewports')

  const pythonTests = requireMetric(commons, 'python_tests_at_advertised_tags')
  const packagesTested = requireMetric(commons, 'python_packages_tested')
  const packagesMatching = requireMetric(commons, 'packages_matching_advertised_count')
  const passingTests = requireMetric(commons, 'passing_tests')
  const mcpTools = requireMetric(mcp, 'mcp_tools_exposed')
  const skills = requireMetric(claude, 'plugin_skills')

  const courtDay = day(court.last_verified_at)
  const datasetVerified = day(snapshot.dataset.last_verified_at)

  return (
    <main id="main">
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow">Proof · Distribution</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            Where this is published, and in what state.
          </h1>
          <p className="sec-sub">
            Nine surfaces. Two are live and exercised, one installs today with a stated caveat, one is canonical,
            one waits on somebody else, three are blocked, and one has never been run. Every state below is read
            from the same compiled snapshot as the rest of this site — this page holds no separate list.
          </p>
          <p className="source-line">
            Snapshot <b>{snapshot.dataset.truth_mode}</b> · dataset verified{' '}
            <time dateTime={snapshot.dataset.last_verified_at}>{datasetVerified}</time> · stale{' '}
            <b>{snapshot.dataset.stale ? 'TRUE' : 'FALSE'}</b> · living state <b>{snapshot.living_state}</b>{' '}
            (an unresolved contradiction is preserved, not hidden) · not connected to a live system · sha256 <b>{signature.snapshot_sha256.slice(0, 16)}…</b>
          </p>
          {snapshot.dataset.stale && (
            <p className="claim-boundary">
              This snapshot is past its last full verification date, and says so rather than restamping itself.
              Individual objects below carry their own dates; read those, not this page&rsquo;s freshness.
            </p>
          )}
        </div>
      </section>

      <section className="sec sec-alt" aria-labelledby="gates-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Release court</p>
          <h2 className="sec-h" id="gates-h">The gates a candidate clears before it may ship.</h2>
          <p className="sec-sub">
            Measured against the built release candidate on{' '}
            <time dateTime={court.last_verified_at}>{courtDay}</time>. Rendering this page does not re-run them.
          </p>
          <dl className="zeros-ledger">
            {gates.map(([label, metric]) => (
              <div key={metric.name}>
                <dt>{label}</dt>
                <dd>
                  {metric.value.toLocaleString('en-US')}{' '}
                  <span className={`metric-strip__meta ${styles.inlineMeta}`}>
                    {metric.classification} · <time dateTime={metric.as_of}>{day(metric.as_of)}</time>
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="source-line">
            Coverage: {pagesChecked.value.toLocaleString('en-US')} prerendered pages, accessibility audited at{' '}
            {viewports.value} viewport widths with axe-core.
          </p>
          <EvidenceDisclosure object={court} />
        </div>
      </section>

      <section className="sec" aria-labelledby="surfaces-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Public surfaces</p>
          <h2 className="sec-h" id="surfaces-h">Nine surfaces, named states.</h2>
          <p className="sec-sub">A state is a claim, so each one is defined here rather than left to the reader.</p>
          <dl className="zeros-ledger">
            {Object.entries(STATE_MEANING).map(([state, meaning]) => (
              <div key={state}>
                <dt>{meaning}</dt>
                <dd>{state.replaceAll('_', ' ')}</dd>
              </div>
            ))}
          </dl>
          <div className={`object-ledger ${styles.ledger}`}>
            {surfaces.map((surface) => (
              <article
                className={`truth-object ${styles.surface}`}
                key={surface.id}
                id={surface.id}
                data-distribution-state={surface.maturity}
              >
                <div className="truth-object__head">
                  <h3 className={styles.title}>{surface.name}</h3>
                  <span className="truth-badge" data-truth-mode={surface.truth_mode}>
                    {surface.maturity.replaceAll('_', ' ')}
                  </span>
                </div>
                <p>{surface.summary}</p>
                <dl className="fact-row">
                  <div>
                    <dt>State</dt>
                    <dd>{surface.maturity.replaceAll('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt>Claim class</dt>
                    <dd>{surface.claim_class.replaceAll('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt>Truth mode</dt>
                    <dd>
                      <TruthModeBadge mode={surface.truth_mode} />
                    </dd>
                  </div>
                </dl>
                {surface.metrics && surface.metrics.length > 0 && (
                  <ul className="metric-strip">
                    {surface.metrics.map((metric) => (
                      <li key={metric.name}>
                        <span className="metric-strip__value">{metric.value.toLocaleString('en-US')}</span>
                        <span className="metric-strip__name">{metric.name.replaceAll('_', ' ')}</span>
                        <span className="metric-strip__meta">
                          {metric.classification} · <time dateTime={metric.as_of}>{day(metric.as_of)}</time>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <EvidenceDisclosure object={surface} />
              </article>
            ))}
          </div>
          {unlisted.length > 0 && (
            <p className="claim-boundary">
              {unlisted.length} further distribution surface{unlisted.length === 1 ? '' : 's'} exist in the snapshot
              and {unlisted.length === 1 ? 'is' : 'are'} not rendered above:{' '}
              {unlisted.map((object) => object.name).join(', ')}.
            </p>
          )}
        </div>
      </section>

      <section className="sec sec-alt" aria-labelledby="commons-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Public Commons</p>
          <h2 className="sec-h" id="commons-h">What the test total actually counts.</h2>
          <p className="sec-sub">
            {pythonTests.value.toLocaleString('en-US')} is the Python test total re-derived across the{' '}
            {packagesTested.value} Public Commons suites, each run at the tag the index advertises. It is not a
            total Neuruh test count, and nothing here claims it is. {packagesMatching.value} of{' '}
            {packagesTested.value} matched the count their index entry advertised; the one that did not was the
            index entry itself, since corrected.
          </p>
          <dl className="zeros-ledger">
            <div>
              <dt>Python tests across the Commons suites, at advertised tags</dt>
              <dd>
                {pythonTests.value.toLocaleString('en-US')}{' '}
                <span className={`metric-strip__meta ${styles.inlineMeta}`}>
                  {pythonTests.classification} · <time dateTime={pythonTests.as_of}>{day(pythonTests.as_of)}</time>
                </span>
              </dd>
            </div>
            <div>
              <dt>Passing tests across the whole commons, including Node</dt>
              <dd>
                {passingTests.value.toLocaleString('en-US')}{' '}
                <span className={`metric-strip__meta ${styles.inlineMeta}`}>
                  {passingTests.classification} · <time dateTime={passingTests.as_of}>{day(passingTests.as_of)}</time>
                </span>
              </dd>
            </div>
          </dl>
          <p>
            <Link className="v2-link" href="/open-source">
              The commons itself →
            </Link>
          </p>
        </div>
      </section>

      <section className="sec" aria-labelledby="mcp-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Plugin and MCP</p>
          <h2 className="sec-h" id="mcp-h">{mcpTools.value} MCP tools. The rest are command-line utilities.</h2>
          <p className="sec-sub">
            The server exposes <code>context_pack</code>, <code>cheap_route</code> and <code>proof_card</code> as
            MCP tools. State diff and handoff pack are CLIs and are not reachable as MCP tools — a distinction
            worth stating plainly, because a manifest that blurs it is a false capability claim.
          </p>
          <div className="claim-boundary">
            <p>
              <strong>Install order matters.</strong> Installing the plugin registers {skills.value} skills and one
              MCP server, and the skills work immediately. It does <em>not</em> install the Python package, so the
              MCP server has nothing to import until the package is installed separately. Without that step the
              server exits at import and the plugin lists no tools.
            </p>
          </div>
          <p className="source-line">
            Package first, then plugin. Both steps and a one-line handshake check are documented in the
            repository&rsquo;s quickstart.
          </p>
        </div>
      </section>

      <section className="sec sec-alt" aria-labelledby="not-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Not claimed</p>
          <h2 className="sec-h" id="not-h">What is deliberately absent from this page.</h2>
          <p className="sec-sub">
            A distribution page is exactly where a candidate quietly becomes a release, so these are named rather
            than omitted.
          </p>
          <dl className="zeros-ledger">
            <div>
              <dt>Fulfillment for the priced offers</dt>
              <dd>founder-operated</dd>
            </div>
            <div>
              <dt>A cashier being live</dt>
              <dd>not automated fulfillment</dd>
            </div>
            <div>
              <dt>Submission to a third-party marketplace</dt>
              <dd>not acceptance</dd>
            </div>
            <div>
              <dt>A manifest existing for a consumer</dt>
              <dd>not a verified install</dd>
            </div>
          </dl>
          <p>
            <Link className="v2-link" href="/refusals">
              Every boundary we hold →
            </Link>{' '}
            <Link className="v2-link" href="/proof">
              The primary evidence ledger →
            </Link>
          </p>
        </div>
      </section>

      <section className="sec" aria-labelledby="deep-h">
        <div className="sec-inner">
          <h2 className="sec-h" id="deep-h">Deep inspection</h2>
          <details className="evidence-disclosure">
            <summary>Read these states from the snapshot yourself</summary>
            <p className="ev-line">
              Each surface above is an object of kind <code>system</code> in the compiled snapshot served at{' '}
              <a className="v2-link" href="/truth/snapshot.json">
                /truth/snapshot.json
              </a>
              , with its checksum at{' '}
              <a className="v2-link" href="/truth/signature.json">
                /truth/signature.json
              </a>
              . The distribution state is the object&rsquo;s <code>maturity</code>; its caveats are its{' '}
              <code>limitations</code>. This page adds no facts of its own, which is the point of it existing.
            </p>
          </details>
        </div>
      </section>
    </main>
  )
}
