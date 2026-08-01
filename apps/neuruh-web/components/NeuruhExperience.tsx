'use client'

/**
 * Spike 1 — the Direction A material argument, rendered for real.
 *
 * The copy is the prototype's copy, unaltered, because ENGINEERING_HANDOFF.md
 * makes the DOM the source of truth for hierarchy and because screenshot parity
 * against design intent is one of the required measurements. Rewriting it here
 * would make that comparison meaningless.
 */

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MembraneReport } from '@/components/scene/Membranes'
import { SceneBoundary } from '@/components/dom/SceneBoundary'
import type { Capability } from '@/lib/capability'
import { CHAPTERS, TRACE_STEPS, type CameraName, type SceneStateName } from '@/lib/sceneStates'
import { readSpike1Config } from '@/lib/spike1Config'
import { readSeed } from '@/lib/rng'
import { useTrace } from '@/lib/useTrace'
import { getHarness } from '@/lib/metrics'

// The whole WebGL runtime sits behind this boundary — see Spike0Client.
const Spike1Scene = dynamic(() => import('@/components/scene/Spike1Scene'), { ssr: false })

export function NeuruhExperience({
  forceMotion,
  forceTier,
}: { forceMotion?: 'full' | 'reduced'; forceTier?: 0 | 1 | 2 | 3 } = {}) {
  const [capability, setCapability] = useState<Capability | null>(null)
  const [membrane, setMembrane] = useState<MembraneReport | null>(null)
  const [chapter, setChapter] = useState(1)
  const config = useMemo(() => readSpike1Config(), [])
  const seed = readSeed()

  const bound = CHAPTERS[Math.min(CHAPTERS.length - 1, Math.max(0, chapter - 1))]
  const state: SceneStateName = config.pinnedState ?? bound.state
  const camera: CameraName = config.pinnedCamera ?? bound.cam

  const reduced = capability?.motion === 'reduced'
  const trace = useTrace(reduced, config.autoTrace)

  const onCapability = useCallback((c: Capability) => setCapability(c), [])
  const onMembraneReport = useCallback((r: MembraneReport) => setMembrane(r), [])

  // Chapter advance by IntersectionObserver at the thresholds the contract
  // names. Native scroll only — scroll-jacking is anti-reference A03 and the
  // most common accessibility failure among the sites the recon surveyed.
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  useEffect(() => {
    if (config.pinnedState) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const n = Number((e.target as HTMLElement).dataset.chapter)
          if (Number.isFinite(n)) setChapter(n)
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -20% 0px' },
    )
    chapterRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [config.pinnedState])

  // Keyboard, SCENE_CONTRACT.md §11. The scene interactions are reachable from
  // the DOM because the canvas is aria-hidden and must not hold affordances.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && /input|textarea|select/i.test(el.tagName)) return
      if (e.key === 't' || e.key === 'T') {
        setChapter(4)
        document.getElementById('ch4')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
        trace.start()
      } else if (e.key === 'r' || e.key === 'R') {
        trace.reset()
      } else if (e.key === 'ArrowDown') {
        const next = Math.min(CHAPTERS.length, chapter + 1)
        document.getElementById(`ch${next}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      } else if (e.key === 'ArrowUp') {
        const prev = Math.max(1, chapter - 1)
        document.getElementById(`ch${prev}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chapter, reduced, trace])

  useEffect(() => {
    if (!capability) return
    getHarness().mark('interactive')
    getHarness().meta = {
      ...getHarness().meta,
      approach: config.approach,
      requestedLayers: config.layers,
      renderedLayers: membrane?.layers ?? null,
      membraneTriangles: membrane?.triangles ?? null,
      proceduralTextureBytes: membrane?.proceduralTextureBytes ?? null,
      segments: config.segments,
      doubleSided: config.doubleSided,
      state,
      camera,
      seed,
    }
  }, [capability, config, membrane, state, camera, seed])

  const setRef = (i: number) => (el: HTMLElement | null) => {
    chapterRefs.current[i] = el
  }

  return (
    <>
      <a className="skip-link" href="#ch8">
        Skip to entry
      </a>

      <SceneBoundary onCapability={onCapability} forcedMotion={forceMotion} forcedTier={forceTier}>
        {(cap, onFailure) => (
          <Spike1Scene
            config={{
              ...config,
              approach: cap.tier === 3 ? 'physical' : 'baked',
              layers: cap.tier === 3 ? 2 : cap.tier === 2 ? 4 : 3,
              doubleSided: false,
            }}
            state={state}
            camera={camera}
            seed={seed}
            traceProgress={trace.progress}
            traceComplete={trace.complete}
            capability={cap}
            onFailure={onFailure}
            onChannelPointerDown={state === 'metabolism' ? trace.start : undefined}
            onMembraneReport={onMembraneReport}
          />
        )}
      </SceneBoundary>

      <main className="dom" id="main">
        <div className="container container--editorial">
          <section
            className="chapter"
            id="ch1"
            ref={setRef(0)}
            data-chapter="1"
            data-state="dormant"
            data-cam="wide"
          >
            <div className="chapter__inner">
              <p className="n-label">Neuruh</p>
              <h1
                className="t-cinema-1"
                style={{ marginBlock: 'var(--space-5)', color: 'var(--text-primary)' }}
              >
                Fragmented signal
                <br />
                becomes governed action.
              </h1>
              <p className="t-lede">
                Neuruh turns fragmented signals, knowledge, and physical-world complexity into governed
                intelligence and executable systems.
              </p>
              <p className="verb">Scroll · chapter 1 of 8</p>
              <p
                className="tier0-note t-body-sm"
                style={{ color: 'var(--text-faint)', marginTop: 'var(--space-5)' }}
              >
                Your device or preferences ruled out the interactive scene. You are seeing the authored
                static route — the full argument, none of the motion.
              </p>
            </div>
          </section>

          <section className="chapter" id="ch2" ref={setRef(1)} data-chapter="2" data-state="fragmented" data-cam="wide">
            <div className="chapter__inner">
              <p className="chapter__n">02 — Fragmented world</p>
              <h2 className="t-cinema-3" style={{ color: 'var(--text-primary)' }}>
                Most of what matters arrives broken.
              </h2>
              <p className="t-body-lg">
                County records that disagree with the plat. A sensor reading with no timestamp. Three
                systems that each hold a third of the answer and none that hold the question. This is not
                a data problem waiting for a bigger model — it is a <em>structural</em> problem, and it is
                where Neuruh starts.
              </p>
              <p className="verb">Motion verb — recognition</p>
            </div>
          </section>

          <section className="chapter" id="ch3" ref={setRef(2)} data-chapter="3" data-state="awakening" data-cam="mid">
            <div className="chapter__inner">
              <p className="chapter__n">03 — The N-Cell awakens</p>
              <h2 className="t-cinema-3" style={{ color: 'var(--text-primary)' }}>
                Recognition is the first act, not inference.
              </h2>
              <p className="t-body-lg">
                Before anything is concluded, a fragment is <em>identified</em>: what it is, where it came
                from, when it was true. The membrane admits selectively. What it refuses is recorded as
                clearly as what it accepts — a system that quietly drops what it cannot parse is a system
                that will lie to you later.
              </p>
              <p className="verb">Motion verb — recognition</p>
            </div>
          </section>

          <section className="chapter" id="ch4" ref={setRef(3)} data-chapter="4" data-state="metabolism" data-cam="close">
            <div className="chapter__inner">
              <p className="chapter__n">04 — Intelligence metabolism</p>
              <h2 className="t-cinema-3" style={{ color: 'var(--text-primary)' }}>
                Signal becomes evidence. Evidence keeps its receipts.
              </h2>
              <p className="t-body-lg">
                Channels carry each fragment inward, corroborating it against other sources as it travels.
                Where two sources disagree, the contradiction is <strong>held open</strong> — both claims
                preserved, both provenances intact, neither styled as the winner. Downstream work that
                depends on the disputed value is gated until a human resolves it.
              </p>

              <div className="trace" data-testid="trace">
                <div className="trace__head">
                  <p className="n-label">Signature interaction</p>
                  <button
                    className="n-btn n-btn--ghost t-ui-sm"
                    style={{ height: '1.75rem' }}
                    onClick={trace.reset}
                    data-testid="trace-reset"
                  >
                    Reset
                  </button>
                </div>
                <p className="trace__hint t-body-sm" style={{ marginTop: 'var(--space-3)' }}>
                  Trace one piece of evidence from raw signal to governed execution. Press{' '}
                  <kbd className="t-data-sm">T</kbd>, or use the button — the scene channel is
                  aria-hidden, so the reachable control lives here.
                </p>
                <div className="row">
                  <button className="n-btn n-btn--primary t-ui-sm" onClick={trace.start} data-testid="trace-start">
                    Trace the evidence channel
                  </button>
                </div>
                <div className="trace__steps">
                  {TRACE_STEPS.map((s, i) => (
                    <div
                      key={s.id}
                      className={`trace__step${trace.step > i ? ' is-on' : ''}${
                        i === TRACE_STEPS.length - 1 && trace.complete ? ' is-receipt' : ''
                      }`}
                      data-testid={`trace-step-${s.id}`}
                      data-on={trace.step > i ? 'true' : 'false'}
                    >
                      <span className="trace__s">{s.id}</span>
                      <div>
                        <p className="trace__claim">{s.claim}</p>
                        <p className="trace__prov">{s.provenance}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: 'var(--space-4)' }}>
                  <span className="fixture-badge">fixture · travis county working set</span>
                </p>
              </div>

              <p className="verb">Motion verbs — organization, contradiction</p>
            </div>
          </section>

          <section className="chapter" id="ch5" ref={setRef(4)} data-chapter="5" data-state="vertical" data-cam="vertical">
            <div className="chapter__inner">
              <p className="chapter__n">05 — Vertical worlds</p>
              <h2 className="t-cinema-3" style={{ color: 'var(--text-primary)' }}>
                One architecture. Distinct products.
              </h2>
              <p className="t-body-lg">
                Field Scout works parcels. Deed Sonar works title. Lead Recipe OS works pipelines. They do
                not share a look — they share a <em>spine</em>. Every one inherits the same trust
                semantics: green still means verified, amber still means a human is required, red still
                means two sources disagree. Only the accent changes.
              </p>
              <p className="verb">Motion verb — adaptation</p>
            </div>
          </section>

          <section className="chapter" id="ch6" ref={setRef(5)} data-chapter="6" data-state="gating" data-cam="core">
            <div className="chapter__inner">
              <p className="chapter__n">06 — Knowing becomes doing</p>
              <h2 className="t-cinema-3" style={{ color: 'var(--text-primary)' }}>
                Nothing reaches the world without passing the core.
              </h2>
              <p className="t-body-lg">
                Governance is not a settings page. It is a structural gate every action travels through,
                and it has four honest answers — granted, scoped, withheld, revoked. A withheld action is
                not a broken feature; it is the system telling you it <em>could</em> act and is choosing
                not to.
              </p>
              <div className="n-gate" data-authority="scoped" style={{ marginTop: 'var(--space-5)' }}>
                <div className="n-gate__head">
                  <span className="n-gate__ring">◐</span>
                  <div>
                    <p className="n-gate__title">Scoped</p>
                    <p className="n-gate__scope">read + enrich · no outbound contact</p>
                  </div>
                </div>
                <p className="n-gate__reason">
                  Outbound contact requires a separate grant. One unresolved contradiction upstream is
                  holding two downstream recipes.
                </p>
              </div>
              <p className="verb">Motion verbs — gating, execution</p>
            </div>
          </section>

          <section className="chapter" id="ch7" ref={setRef(6)} data-chapter="7" data-state="receipt" data-cam="mid">
            <div className="chapter__inner">
              <p className="chapter__n">07 — Receipt and adaptation</p>
              <h2 className="t-cinema-3" style={{ color: 'var(--text-primary)' }}>
                Proof returns, and the system changes because of it.
              </h2>
              <p className="t-body-lg">
                Every executed action emits a receipt: what was done, under whose authority, with what
                scope, and what came back. Those receipts feed inward and reweight the system. This is the
                only place Neuruh shows sustained green — because it is the only place something is
                finished.
              </p>
              <div className="n-receipt" style={{ marginTop: 'var(--space-5)' }}>
                <dl>
                  <dt>action</dt>
                  <dd>recipe.execute · outreach_v3</dd>
                  <dt>authority</dt>
                  <dd>granted · grant_id=0x8C21</dd>
                  <dt>result</dt>
                  <dd>2 delivered · 1 deferred (contradiction hold)</dd>
                  <dt>receipt</dt>
                  <dd>rcpt_01K9F2M7Q4 · 2026-07-31T21:44:12Z</dd>
                </dl>
              </div>
              <p className="verb">Motion verbs — receipt, adaptation</p>
            </div>
          </section>
        </div>

        <section className="enter chapter" id="ch8" ref={setRef(7)} data-chapter="8" data-state="entry" data-cam="wide">
          <div className="container container--editorial">
            <div className="chapter__inner">
              <p className="chapter__n">08 — Enter Neuruh</p>
              <h2
                className="t-cinema-2"
                style={{ color: 'var(--text-primary)', marginBlock: 'var(--space-4) var(--space-5)' }}
              >
                Bring us something
                <br />
                that disagrees with itself.
              </h2>
              <p className="t-body-lg">
                The fastest way to understand Neuruh is to hand it a real contradiction from your own data
                and watch what it refuses to conclude.
              </p>
              <div className="row">
                <a className="n-btn n-btn--primary" href="#ch8">
                  Request a working session
                </a>
                <a className="n-btn n-btn--secondary" href="#ch4">
                  See the architecture again
                </a>
              </div>
              <p className="n-source">
                Every figure on this page is fixture data from a real Travis County working set, marked as
                fixture in Blackbox. Nothing on this page is a live counter.
              </p>
            </div>
          </div>
        </section>
      </main>

    </>
  )
}
