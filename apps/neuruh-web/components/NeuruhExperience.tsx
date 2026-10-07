'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ALIVE_CHAPTERS, livingStatePlain } from '../../../packages/public-truth/experience'
import type { LivingState, TruthMode } from '../../../packages/public-truth/types'
import { SandboxTrace } from './SandboxTrace'
import { TwinControls, type ReadingMode } from './TwinControls'
import { TruthModeBadge } from './TruthPrimitives'
import type { MembraneReport } from '@/components/scene/Membranes'
import { SceneBoundary } from '@/components/dom/SceneBoundary'
import type { Capability } from '@/lib/capability'
import type { CameraName, SceneStateName } from '@/lib/sceneStates'
import { readSpike1Config } from '@/lib/spike1Config'
import { readSeed } from '@/lib/rng'
import { useTrace } from '@/lib/useTrace'
import { getHarness } from '@/lib/metrics'

const Spike1Scene = dynamic(() => import('@/components/scene/ResetSceneEntry'), { ssr: false })

const STRATA_LEGEND = ['Signal', 'Evidence', 'Decision', 'Authority', 'Receipt'] as const

export interface TruthSummary {
  truthMode: TruthMode
  lastVerifiedAt: string
  limitation: string
  livingState: LivingState
  liveConnectivity: false
  sourceRef: string
}

export function NeuruhExperience({
  forceMotion,
  forceTier,
  truth,
}: {
  forceMotion?: 'full' | 'reduced'
  forceTier?: 0 | 1 | 2 | 3
  truth: TruthSummary
}) {
  const [capability, setCapability] = useState<Capability | null>(null)
  const [membrane, setMembrane] = useState<MembraneReport | null>(null)
  const [chapter, setChapter] = useState(1)
  const [paused, setPaused] = useState(false)
  const [readingMode, setReadingMode] = useState<ReadingMode>('story')
  const config = useMemo(() => readSpike1Config(), [])
  const seed = readSeed()

  const bound = ALIVE_CHAPTERS[Math.min(ALIVE_CHAPTERS.length - 1, Math.max(0, chapter - 1))]
  const state: SceneStateName = config.pinnedState ?? bound.rendererState
  const camera: CameraName = config.pinnedCamera ?? bound.camera
  const reduced = capability?.motion === 'reduced'
  const trace = useTrace(reduced, config.autoTrace)
  const canPause = (capability?.tier ?? 0) > 0 && !reduced

  const onCapability = useCallback((next: Capability) => setCapability(next), [])
  const onMembraneReport = useCallback((report: MembraneReport) => setMembrane(report), [])
  const chapterRefs = useRef<Array<HTMLElement | null>>([])

  const goToChapter = useCallback((next: number) => {
    const clamped = Math.min(ALIVE_CHAPTERS.length, Math.max(1, next))
    document.getElementById(`ch${clamped}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }, [reduced])

  useEffect(() => {
    if (config.pinnedState) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const next = Number((entry.target as HTMLElement).dataset.chapter)
        if (Number.isFinite(next)) setChapter(next)
      }
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -20% 0px' })
    chapterRefs.current.forEach((element) => element && observer.observe(element))
    return () => observer.disconnect()
  }, [config.pinnedState])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null
      if (element && /input|textarea|select/i.test(element.tagName)) return
      if (event.key === 't' || event.key === 'T') {
        const traceChapter = ALIVE_CHAPTERS.findIndex((item) => item.feature === 'trace') + 1
        setChapter(traceChapter)
        goToChapter(traceChapter)
        trace.start()
      } else if (event.key === 'r' || event.key === 'R') {
        trace.reset()
      } else if (event.key === 'ArrowDown') {
        goToChapter(chapter + 1)
      } else if (event.key === 'ArrowUp') {
        goToChapter(chapter - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chapter, goToChapter, trace])

  useEffect(() => {
    document.documentElement.setAttribute('data-scene-paused', paused ? 'true' : 'false')
    document.documentElement.setAttribute('data-reading-mode', readingMode)
  }, [paused, readingMode])

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
      state,
      semanticState: bound.semanticState,
      publicLivingState: truth.livingState,
      truthMode: truth.truthMode,
      camera,
      seed,
      paused,
      readingMode,
    }
  }, [bound.semanticState, camera, capability, config, membrane, paused, readingMode, seed, state, truth.livingState, truth.truthMode])

  const setRef = (index: number) => (element: HTMLElement | null) => {
    chapterRefs.current[index] = element
  }

  return (
    <>
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
            paused={paused}
            traceProgress={trace.progress}
            traceComplete={trace.complete}
            capability={cap}
            onFailure={onFailure}
            onChannelPointerDown={bound.feature === 'trace' ? trace.start : undefined}
            onMembraneReport={onMembraneReport}
          />
        )}
      </SceneBoundary>

      <main className="dom" id="main" data-public-living-state={truth.livingState} data-reading-mode={readingMode}>
        <div className="container container--editorial">
          {ALIVE_CHAPTERS.map((item, index) => (
            <section
              className="chapter alive-chapter"
              id={`ch${index + 1}`}
              key={item.id}
              ref={setRef(index)}
              data-chapter={index + 1}
              data-chapter-id={item.id}
              data-state={item.semanticState}
              data-renderer-state={item.rendererState}
              data-cam={item.camera}
              data-truth-mode={item.truthMode}
            >
              <div className={index === 0 ? 'chapter__inner chapter__inner--hero' : 'chapter__inner'}>
                <div className="chapter-meta">
                  <p className="chapter__n">{index === 0 ? 'Neuruh — Governed AI systems' : `${String(index + 1).padStart(2, '0')} — ${item.label}`}</p>
                  <TruthModeBadge mode={item.truthMode} />
                </div>
                <h1 className={index === 0 ? 't-hero' : 't-cinema-3'}>{item.title}</h1>
                <p className={index === 0 ? 't-body-lg hero-support' : 't-body-lg'}>{item.body}</p>
                {index === 0 && (
                  <>
                    <div className="row hero-ctas">
                      <Link className="n-btn n-btn--primary" href="/products">Explore the systems</Link>
                      <Link className="n-btn n-btn--secondary" href="/proof">See the proof</Link>
                    </div>
                    <p className="hero-signal">
                      1 product in production · 4 sealed candidates · 18 live services · 36 open-source repos
                      <span className="hero-signal__meta">receipts on /proof · as of 2026-08-23</span>
                    </p>
                    <p className="hero-domains" aria-label="Domains Neuruh operates in">
                      Real estate · Commerce · Local services · Asset recovery · Venture systems · Proof
                    </p>
                  </>
                )}
                <p className="claim-boundary"><strong>Claim boundary:</strong> {item.claimBoundary}</p>
                <p className="verb">{livingStatePlain(item.semanticState)}</p>

                {readingMode === 'reality' && (
                  <aside className="strata-legend" aria-label="Proof strata">
                    <p className="n-label">Proof strata</p>
                    <ol>
                      {STRATA_LEGEND.map((name) => <li key={name}>{name}</li>)}
                    </ol>
                  </aside>
                )}

                {item.feature === 'truth' && (
                  <aside className="truth-panel" aria-label="Current public truth snapshot">
                    <dl>
                      <dt>Truth mode</dt><dd>{truth.truthMode}</dd>
                      <dt>Current living state</dt><dd>{livingStatePlain(truth.livingState)}</dd>
                      <dt>Live connectivity</dt><dd>NONE</dd>
                      <dt>Last verified</dt><dd><time dateTime={truth.lastVerifiedAt}>{truth.lastVerifiedAt}</time></dd>
                      <dt>Source</dt><dd>{truth.sourceRef}</dd>
                    </dl>
                    <p>{truth.limitation}</p>
                    <p className="tier0-note">Authored static route active. Truth, relationships, evidence, and limitations remain available without WebGL.</p>
                  </aside>
                )}

                {item.feature === 'contradiction' && (
                  <aside className="contradiction-object" data-contradiction-id="galaxy-connectivity-boundary">
                    <p className="n-label">Contradiction · UNRESOLVED</p>
                    <p>The Galaxy interface and operating intent are observed. Production connectivity for its displayed state is not proven.</p>
                    <p className="source-line">Supporting: src-galaxy-canon · Opposing boundary: src-alive-ruling</p>
                  </aside>
                )}

                {item.feature === 'trace' && (
                  <SandboxTrace step={trace.step} complete={trace.complete} onStart={trace.start} onReset={trace.reset} />
                )}

                {item.feature === 'entry' && (
                  <div className="row">
                    <Link className="n-btn n-btn--primary" href="/products">See the products</Link>
                    <Link className="n-btn n-btn--secondary" href="/proof">Inspect proof</Link>
                    <Link className="n-btn n-btn--secondary" href="/refusals">Read the refusals</Link>
                    <Link className="n-btn n-btn--ghost" href="/contact">Work with Neuruh</Link>
                  </div>
                )}

                {item.feature !== 'entry' && <Link className="text-link" href={item.href}>Open {item.label} →</Link>}
              </div>
            </section>
          ))}
        </div>
      </main>

      <TwinControls
        chapter={chapter}
        chapterCount={ALIVE_CHAPTERS.length}
        paused={paused || reduced}
        canPause={canPause}
        readingMode={readingMode}
        onPauseToggle={() => setPaused((value) => !value)}
        onPrev={() => goToChapter(chapter - 1)}
        onNext={() => goToChapter(chapter + 1)}
        onReadingMode={setReadingMode}
      />
    </>
  )
}
