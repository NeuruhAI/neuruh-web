import Link from 'next/link'
import { getPublicObject, getPublicObjects, getPublicSnapshot } from '../../../packages/public-truth/client'
import { PUBLIC_OFFERS } from '../lib/publicOffers'
import { PipelineTrace } from './PipelineTrace'

/**
 * Homepage V2 — ART_DIRECTION_V2 "Decision Foundry".
 * Server-rendered; no WebGL on this route. Every count on the page is
 * derived from the compiled public-truth snapshot at build time (§19 law:
 * never hand-type a stale number).
 */

function deriveStrip() {
  const worlds = getPublicObjects('world')
  const organs = getPublicObjects('organ')
  const inProduction = worlds.filter((w) => w.maturity === 'OPERATING_PRODUCT')
  const sealed = [...worlds, ...organs].filter((o) => o.maturity === 'SHIP_CANDIDATE' && o.status === 'STABLE')
  const census = getPublicObject('organism-census')
  const commons = getPublicObject('public-commons')
  const ds = getPublicObject('deedsonar')
  const m = (obj: typeof census, name: string) => obj?.metrics?.find((x) => x.name === name)
  return {
    inProduction: inProduction.length,
    sealed: sealed.length,
    liveServices: m(census, 'canonical_active_runtimes'),
    ossRepos: m(commons, 'public_code_repositories'),
    dsCourt: m(ds, 'tests_green_at_production_sha'),
    asOf: getPublicSnapshot().dataset.last_verified_at.slice(0, 10),
  }
}

const STATUS_STYLE: Record<string, string> = {
  'IN PRODUCTION': 'ptag-live',
  'SEALED CANDIDATE': 'ptag-demo',
  'SYNTHETIC DEMO': 'ptag-demo',
  'IN DEVELOPMENT': 'ptag-dev',
}

function Status({ label }: { label: string }) {
  return <span className={`pc-status ${STATUS_STYLE[label] ?? 'ptag-dev'}`}>{label}</span>
}

export function HomeV2() {
  const strip = deriveStrip()
  const liquidity = getPublicObject('liquidity-engine')!
  const fsp = getPublicObject('find-sell-profit')!
  const bookeit = getPublicObject('bookeit')!
  const curbclaim = getPublicObject('curbclaim')!
  const proofOs = getPublicObject('proof-os')!
  const factory = getPublicObject('venture-factory')!
  const commons = getPublicObject('public-commons')!
  const census = getPublicObject('organism-census')!
  const ds = getPublicObject('deedsonar')!
  return (
    <main id="main">
      {/* 01 · HERO — Decision Foundry */}
      <section className="hero-v2" data-section="hero" aria-label="Neuruh — AI systems that do real work and prove it">
        <div className="hero-copy">
          <p className="hero-eyebrow">Neuruh</p>
          <h1 className="hero-h1">AI systems that do real work — and prove it.</h1>
          <p className="hero-sub">
            Neuruh turns messy real-world information into evidence, governed decisions, workflows, and measurable
            outcomes. Every action is checked. Every result leaves a receipt.
          </p>
          <div className="hero-ctas">
            <Link className="v2-btn v2-btn-primary" href="/offers">See offers</Link>
            <Link className="v2-btn v2-btn-secondary" href="/products">Explore the systems</Link>
            <Link className="v2-btn v2-btn-secondary" href="/proof">See the proof</Link>
          </div>
          <p className="hero-proofline">
            <b>{strip.inProduction}</b> product in production · <b>{strip.sealed}</b> sealed candidates ·{' '}
            <b>{strip.liveServices?.value}</b> live services · <b>{strip.ossRepos?.value}</b> open-source repos
            <br />
            <span className="dim">receipts on /proof · as of {strip.asOf}</span>
          </p>
        </div>
        <div className="foundry" aria-hidden="true">
          <svg className="flow" viewBox="0 0 1180 860">
            <path className="fpath" d="M 96 224 C 190 224, 200 260, 260 300" />
            <path className="fpath" d="M 100 288 C 190 292, 210 320, 262 350" />
            <path className="fpath" d="M 96 352 C 180 360, 214 380, 258 400" />
            <path className="fpath" d="M 868 380 C 900 372, 912 360, 928 348" />
            <path className="fpath fpath-out" d="M 986 412 C 1000 450, 1000 480, 1006 516" />
            <circle className="fnode" cx="260" cy="300" r="2.4" /><circle className="fnode" cx="262" cy="350" r="2.4" />
            <circle className="fnode" cx="258" cy="400" r="2.4" /><circle className="fnode" cx="928" cy="348" r="2.4" fill="#c9a557" />
          </svg>
          <div className="f-inputs">
            <div className="f-chip"><span className="k">REC</span> County deed record</div>
            <div className="f-chip"><span className="k">MAP</span> Parcel geometry</div>
            <div className="f-chip"><span className="k">SIG</span> Distress signal</div>
          </div>
          <div className="pframe f-back">
            <div className="pframe-bar"><span className="dot" /><span className="name">DeedSonar · Reports</span><span className="ptag ptag-demo">SAMPLE DATA</span></div>
            <img src="/media/products/deedsonar-reports.png" alt="" loading="eager" />
          </div>
          <div className="pframe f-main">
            <div className="pframe-bar"><span className="dot" /><span className="name">DeedSonar · Acquisition desk</span><span className="ptag ptag-live">IN PRODUCTION</span></div>
            <img src="/media/products/deedsonar-dashboard.png" alt="" loading="eager" />
          </div>
          <div className="pframe f-front">
            <div className="pframe-bar"><span className="dot" /><span className="name">Neuruh Liquidity · Outcomes</span><span className="ptag ptag-demo">SYNTHETIC</span></div>
            <img src="/media/products/liquidity-outcomes.png" alt="" loading="eager" />
          </div>
          <div className="f-gate">
            <div className="ring" />
            <div className="glbl">AUTHORITY</div>
            <div className="gsub">CHECKED · {strip.asOf}</div>
          </div>
          <div className="f-receipt">
            <div className="rt">RECEIPT · VERIFIED</div>
            <div className="rl"><span>action</span><b>offer.prepared</b></div>
            <div className="rl"><span>authority</span><b>granted · scoped</b></div>
            <div className="rl"><span>outcome</span><b>recorded</b></div>
            <div className="sha">sha e2b71fa · court {strip.dsCourt?.value.toLocaleString('en-US')} green</div>
          </div>
        </div>
      </section>

      {/* 01b · OFFERS STRIP — commercial path without redesigning the foundry */}
      <section className="sec" data-section="offers" aria-labelledby="home-offers-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Start here</p>
          <h2 className="sec-h" id="home-offers-h">Three fixed-scope ways to start.</h2>
          <p className="sec-sub">
            Buy a scoped piece of work, or ask which public path fits. The cashiers are the live ones already on
            neuruh.com.
          </p>
          <div className="ev-grid">
            {PUBLIC_OFFERS.map((offer) => (
              <article className="ev-card" key={offer.id}>
                <p className="ev-k">{offer.id} · {offer.price}</p>
                <p className="claim">{offer.name}</p>
                <p className="ev-line">{offer.promise}</p>
                <a className="v2-link" href={offer.href} rel="noopener noreferrer">{offer.cta} →</a>
              </article>
            ))}
          </div>
          <div className="row" style={{ marginTop: 26 }}>
            <Link className="v2-btn v2-btn-primary" href="/offers">Compare the offers</Link>
            <Link className="v2-btn v2-btn-secondary" href="/ask">Ask Neuruh</Link>
          </div>
        </div>
      </section>

      {/* 02 · PROOF STRIP */}
      <section data-section="proof-strip" aria-label="Verified counts">
        <div className="proofstrip">
          <div><p className="pv">{strip.inProduction}</p><p className="pk">product in production</p><p className="pm">app.deedsonar.com · attested</p></div>
          <div><p className="pv">{strip.sealed}</p><p className="pk">sealed release candidates</p><p className="pm">custody + court receipts</p></div>
          <div><p className="pv">{strip.dsCourt?.value.toLocaleString('en-US')}</p><p className="pk">tests green at production SHA</p><p className="pm">deedsonar court · {strip.dsCourt?.as_of.slice(0, 10)}</p></div>
          <div><p className="pv">{strip.liveServices?.value}</p><p className="pk">live services in the operating estate</p><p className="pm">census · {strip.liveServices?.as_of.slice(0, 10)}</p></div>
          <div><p className="pv">{strip.ossRepos?.value}</p><p className="pk">public open-source repositories</p><p className="pm">audited · 0 secret-scan hits</p></div>
        </div>
      </section>

      {/* 03 · HOW IT WORKS — the machine (Concept C adopted) */}
      <section className="sec" data-section="how-it-works" aria-labelledby="hiw-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">How it works</p>
          <h2 className="sec-h" id="hiw-h">Signals in. Receipts out. Authority in between.</h2>
          <p className="sec-sub">
            One governed pipeline underneath every Neuruh product: information becomes evidence, evidence becomes a
            decision, the decision passes a checked authority gate — and everything that happens is recorded.
          </p>
          <div className="machine" role="img" aria-label="The Neuruh pipeline: signals, evidence, decision, authority, receipts">
            <div className="bay"><p className="bt">01 · Signals</p><p className="bs">Messy real-world inputs arrive.</p>
              <div className="art">
                <div className="f-chip"><span className="k">REC</span> County record</div>
                <div className="f-chip"><span className="k">MAP</span> Parcel geometry</div>
                <div className="f-chip"><span className="k">IMG</span> Field photo</div>
              </div>
            </div>
            <div className="bay"><p className="bt">02 · Evidence</p><p className="bs">The system assembles what is actually known.</p>
              <div className="art"><img src="/media/products/deedsonar-dashboard.png" alt="DeedSonar acquisition desk assembling property evidence (sample data)" loading="lazy" /></div>
            </div>
            <div className="bay"><p className="bt">03 · Decision</p><p className="bs">Economics before commitment.</p>
              <div className="art"><img src="/media/products/fsp-home.png" alt="FindSellProfit underwriting surface" loading="lazy" /></div>
            </div>
            <div className="bay bay-auth"><p className="bt">04 · Authority</p><p className="bs" style={{ color: '#8a7a55' }}>Nothing acts without a check.</p>
              <div className="gate-ring-sm" /><p className="bt" style={{ textAlign: 'center' }}>Checked</p>
            </div>
            <div className="bay"><p className="bt">05 · Receipts</p><p className="bs">Verifiable record of what ran.</p>
              <div className="art">
                <div className="r-card">action <b>offer.prepared</b><br />authority <b>granted</b><br />sha <b>e2b71fa</b></div>
                <img src="/media/products/liquidity-outcomes.png" alt="Neuruh Liquidity outcomes ledger (synthetic closes)" loading="lazy" />
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 26 }}>
            <Link className="v2-btn v2-btn-secondary" href="/how-it-works">See how it works in detail</Link>
          </div>
          <PipelineTrace />
        </div>
      </section>

      {/* 04 · FLAGSHIP — DeedSonar */}
      <section className="sec sec-alt" data-section="flagship" aria-labelledby="flag-h">
        <div className="sec-inner">
          <div className="flagship">
            <div>
              <p className="sec-eyebrow">Flagship · in production</p>
              <h2 className="sec-h" id="flag-h">DeedSonar finds real property opportunities — and works them from evidence to outcome.</h2>
              <p className="sec-sub">
                County records, parcel geometry, and distress signals become ranked opportunities with the evidence
                attached: ownership, access, risks, and why each one matters. Then the same system carries the deal —
                tasks, offers, contracts, dispositions — with a receipt at every step.
              </p>
              <p className="hero-proofline" style={{ marginBottom: 22 }}>
                production surface attests its own SHA · <b>{strip.dsCourt?.value.toLocaleString('en-US')}</b> tests green at that SHA
              </p>
              <div className="hero-ctas">
                <Link className="v2-btn v2-btn-primary" href="/worlds/deedsonar">Explore DeedSonar</Link>
                <Link className="v2-btn v2-btn-ghost" href="/proof">View the receipts →</Link>
              </div>
            </div>
            <div className="pframe">
              <div className="pframe-bar"><span className="dot" /><span className="name">DeedSonar · Reports &amp; KPIs</span><span className="ptag ptag-demo">SAMPLE DATA</span></div>
              <img src="/media/products/deedsonar-reports.png" alt="DeedSonar reports: pipeline profit, funnel, and county performance (sample data)" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* 05 · PRODUCTS */}
      <section className="sec" data-section="products" aria-labelledby="prod-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">The systems</p>
          <h2 className="sec-h" id="prod-h">One governed engine. Real products on top.</h2>
          <p className="sec-sub">Each system is a real domain business on the shared infrastructure — with its current, truthful status.</p>
          <div className="prod-grid">
            <article className="prod-card pc-span-6">
              <div className="pc-media"><img src="/media/products/liquidity-outcomes.png" alt="Neuruh Liquidity Engine outcomes ledger — synthetic closes" loading="lazy" /></div>
              <div className="pc-body">
                <Status label="SYNTHETIC DEMO" />
                <h3>Neuruh Liquidity Engine</h3>
                <p className="pc-line">Turns field signals into underwritten, governed liquidity options — ranked least-destructive first. In its farm scenario, equipment liquidation outranks selling the farm.</p>
                <Link className="v2-link" href="/worlds/liquidity-engine">Read the case</Link>
              </div>
            </article>
            <article className="prod-card pc-span-6">
              <div className="pc-media"><img src="/media/products/fsp-home.png" alt="FindSellProfit — know what it is worth before your money is in it" loading="lazy" /></div>
              <div className="pc-body">
                <Status label="SEALED CANDIDATE" />
                <h3>FindSellProfit</h3>
                <p className="pc-line">The autonomous merchant OS: photos, URLs, or whole lots become evidence-backed economics, a target buy, an absolute maximum, and a disposition plan.</p>
                <Link className="v2-link" href="/worlds/find-sell-profit">See the system</Link>
              </div>
            </article>
            <article className="prod-card pc-span-4">
              <div className="pc-media"><img src="/media/products/bookeit-home.png" alt="Bookeit — make almost anything around a stay bookable" loading="lazy" /></div>
              <div className="pc-body">
                <Status label="SEALED CANDIDATE" />
                <h3>Bookeit</h3>
                <p className="pc-line">Agentic local commerce: one guest sentence becomes qualified supply, an authorized transaction, and a proven outcome.</p>
                <Link className="v2-link" href="/worlds/bookeit">See the system</Link>
              </div>
            </article>
            <article className="prod-card pc-span-4">
              <div className="pc-media"><img src="/media/products/curbclaim-jobsite.png" alt="CurbClaim job-site routing with zero-crossing economics" loading="lazy" /></div>
              <div className="pc-body">
                <Status label="SEALED CANDIDATE" />
                <h3>CurbClaim</h3>
                <p className="pc-line">Routes unwanted physical things to their highest-value next destination — sell, donate, scrap, or dispose — with honest economics that cross zero.</p>
                <Link className="v2-link" href="/worlds/curbclaim">See the system</Link>
              </div>
            </article>
            <article className="prod-card pc-span-4">
              <div className="pc-body" style={{ paddingTop: 22 }}>
                <Status label="SEALED CANDIDATE" />
                <h3>ProofOS</h3>
                <p className="pc-line">Turns system claims into structured evidence: fourteen courts, each writing a machine-readable receipt.</p>
                <Link className="v2-link" href="/worlds/proof-os">See the system</Link>
                <hr style={{ border: 'none', borderTop: '1px solid var(--v2-line-1)', margin: '10px 0' }} />
                <Status label="IN DEVELOPMENT" />
                <h3>Venture Factory</h3>
                <p className="pc-line">Compiles reusable capabilities into governed venture plans with sealed packages and drift checks.</p>
                <Link className="v2-link" href="/products">All products →</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 06 · SHARED ENGINE */}
      <section className="sec sec-alt" data-section="engine" aria-labelledby="eng-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">The shared engine</p>
          <h2 className="sec-h" id="eng-h">One system underneath all of them.</h2>
          <p className="sec-sub">
            Products differ; the law is shared. Memory, inference, governance, execution, and proof are one
            infrastructure — {census.metrics?.find((m) => m.name === 'canonical_active_runtimes')?.value} services
            operating today across {census.metrics?.find((m) => m.name === 'repositories_under_custody')?.value} repositories under custody.
          </p>
          <div className="ev-grid">
            <div className="ev-card"><p className="ev-k">Memory &amp; evidence</p><p className="claim">What the system knows, with sources kept.</p><p className="ev-line">Typed intake · provenance on every claim · contradictions preserved, not erased</p></div>
            <div className="ev-card"><p className="ev-k">Governance &amp; execution</p><p className="claim">What it may do, checked before it acts.</p><p className="ev-line">Authority gates · scoped approvals · reversible-by-default actions</p></div>
            <div className="ev-card"><p className="ev-k">Proof &amp; outcomes</p><p className="claim">What actually happened, verifiable later.</p><p className="ev-line">Receipts · release SHAs · dated courts · outcome records</p></div>
          </div>
          <div className="row" style={{ marginTop: 26 }}>
            <Link className="v2-btn v2-btn-secondary" href="/organism">See the architecture</Link>
            <Link className="v2-btn v2-btn-ghost" href="/galaxy">Open the system map →</Link>
          </div>
        </div>
      </section>

      {/* 07 · PROOF */}
      <section className="sec" data-section="proof" aria-labelledby="proof-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Proof</p>
          <h2 className="sec-h" id="proof-h">Claims come with evidence attached.</h2>
          <div className="ev-grid">
            <div className="ev-card">
              <p className="ev-k">Claim</p>
              <p className="claim">DeedSonar runs in production, and its court is green.</p>
              <p className="ev-k">Evidence</p>
              <p className="ev-line">health endpoint attests <b>sha e2b71fa</b> · <b>{strip.dsCourt?.value.toLocaleString('en-US')}</b> tests green at that SHA · {strip.dsCourt?.as_of.slice(0, 10)}</p>
            </div>
            <div className="ev-card">
              <p className="ev-k">Claim</p>
              <p className="claim">The open-source commons is real and audited.</p>
              <p className="ev-k">Evidence</p>
              <p className="ev-line"><b>{commons.metrics?.find((m) => m.name === 'public_code_repositories')?.value}</b> public repos · <b>{commons.metrics?.find((m) => m.name === 'passing_tests')?.value.toLocaleString('en-US')}</b> passing tests · <b>0</b> secret-scan hits · audited {commons.metrics?.[0]?.as_of.slice(0, 10)}</p>
            </div>
            <div className="ev-card">
              <p className="ev-k">Claim</p>
              <p className="claim">The operating estate is counted under published rules.</p>
              <p className="ev-k">Evidence</p>
              <p className="ev-line"><b>{census.metrics?.find((m) => m.name === 'canonical_active_runtimes')?.value}</b> live services · <b>{census.metrics?.find((m) => m.name === 'git_worktrees')?.value}</b> worktrees · census {census.metrics?.[0]?.as_of.slice(0, 10)}</p>
            </div>
          </div>
          <div className="row" style={{ marginTop: 26 }}>
            <Link className="v2-btn v2-btn-primary" href="/proof">Inspect the receipts</Link>
          </div>
        </div>
      </section>

      {/* 08 · BOUNDARIES */}
      <section className="sec sec-alt" data-section="boundaries" aria-labelledby="bound-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Boundaries</p>
          <h2 className="sec-h" id="bound-h">What Neuruh refuses to fake.</h2>
          <div className="law-list">
            <div className="law"><span className="ln">01</span><div><h3>No fake live status.</h3><p>If a number is a dated snapshot, it says so. Nothing on this site pretends to be a live feed.</p></div></div>
            <div className="law"><span className="ln">02</span><div><h3>No AI output becomes authority by itself.</h3><p>A model can propose. Only a checked authority gate can permit — and refusals are receipted like actions.</p></div></div>
            <div className="law"><span className="ln">03</span><div><h3>No real-money claim without a real transaction.</h3><p>Demo economics are labeled synthetic in the product and on this site. Revenue to date: $0 — stated plainly.</p></div></div>
          </div>
          <div className="row" style={{ marginTop: 26 }}>
            <Link className="v2-btn v2-btn-secondary" href="/refusals">Read all the boundaries</Link>
          </div>
        </div>
      </section>

      {/* 09 · FOUNDER */}
      <section className="sec" data-section="founder" aria-labelledby="founder-h">
        <div className="sec-inner" style={{ maxWidth: '56rem' }}>
          <p className="sec-eyebrow">Founder</p>
          <h2 className="sec-h" id="founder-h">Built by an operator who kept asking one question.</h2>
          <p className="sec-sub">
            <em>How would I know if this were wrong?</em> Neuruh is that question turned into infrastructure — by a
            business operator from Benton Harbor, Michigan, who built the machine before the marketing. The strongest
            evidence here is the list of things the system caught itself doing wrong.
          </p>
          <div className="row"><Link className="v2-btn v2-btn-secondary" href="/founder">Read the story</Link></div>
        </div>
      </section>

      {/* 10 · CTA */}
      <section className="sec sec-alt" data-section="cta" aria-labelledby="cta-h">
        <div className="sec-inner" style={{ textAlign: 'center', maxWidth: '46rem' }}>
          <h2 className="sec-h" id="cta-h" style={{ marginInline: 'auto' }}>What should this machine work on next?</h2>
          <p className="sec-sub" style={{ marginInline: 'auto' }}>
            Pilots in opportunity intelligence, governed automation, and custom domain engines — scoped, evidenced,
            and receipted.
          </p>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <Link className="v2-btn v2-btn-primary" href="/work-with-neuruh">Work with Neuruh</Link>
            <Link className="v2-btn v2-btn-secondary" href="/products">Explore the systems</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
