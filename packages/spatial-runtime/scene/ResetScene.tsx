'use client'

/**
 * ResetScene — the 2026-08-24 visual-reset hero.
 *
 * Replaces the N-Cell tissue VISUAL while preserving every engineering
 * contract: SceneShell runtime (tier profile, tokens, reduced motion),
 * CameraRig pose law (five named poses, no orbit), the eight-state table
 * (eased, never cut), and ?seed/?frame determinism.
 *
 * Palette: carbon / steel / ice, one brass seam (the authority accent).
 * Three concepts ship behind ?concept= for the founder court:
 *   core     — machined faceted steel core, ice lattice through the seams,
 *              orbital evidence rings, one brass gate ring
 *   strata   — five smoked strata (signal→receipt) with light conduits and
 *              a single brass authority plane
 *   aperture — carbon ring-machine; steel iris blades; information beams
 *              pass only through the gated aperture
 */

import { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Fog,
  IcosahedronGeometry,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  SphereGeometry,
  SpriteMaterial,
  TorusGeometry,
  Vector3,
} from 'three'
import { CameraRig } from './CameraRig'
import { LightRig } from './LightRig'
import { SCENE_STATES, type CameraName, type SceneStateName } from '@/lib/sceneStates'
import { readPinnedFrame } from '@/lib/rng'
import type { SceneRuntime } from './SceneShell'
import type { Spike1Config } from '@/lib/spike1Config'
import type { Capability } from '@/lib/capability'
import type { MembraneReport } from './Membranes'

export type ResetConcept = 'core' | 'strata' | 'aperture'

export function readConcept(search = typeof window !== 'undefined' ? window.location.search : ''): ResetConcept {
  const raw = new URLSearchParams(search).get('concept')
  return raw === 'strata' || raw === 'aperture' || raw === 'core' ? raw : 'strata'
}

/* Material constants — CARBON · STEEL · ICE · one brass seam. */
const CARBON = '#141b24'
const CARBON_DEEP = '#0c1118'
const STEEL = '#5b7ca3'
const SLATE = '#31404f'
const ICE = '#8fc3e0'
const ICE_HOT = '#cfe6f7'
const BRASS = '#c9a049'

function useEased(state: SceneStateName, durationMs: number, cut: boolean) {
  const target = SCENE_STATES[state]
  const current = useRef({ ...SCENE_STATES.dormant })
  const [, force] = useState(0)
  useFrame((_, delta) => {
    const c = current.current
    const k = cut ? 1 : 1 - Math.exp((-delta * 1000 * 3.2) / durationMs)
    let moved = false
    for (const key of ['membrane', 'fragments', 'focusRadius', 'channels', 'core', 'nodes', 'filaments'] as const) {
      const next = MathUtils.lerp(c[key], target[key], k)
      if (Math.abs(next - c[key]) > 1e-4) moved = true
      c[key] = next
    }
    if (moved) force((v) => v + 1)
  })
  return { eased: current.current, coreLit: target.coreLit }
}

/** Deterministic clock: real time normally, frozen at ?frame=N/60 when pinned. */
function useSceneClock(reduced: boolean) {
  const pinned = readPinnedFrame()
  const t = useRef(0)
  useFrame((_, delta) => {
    if (pinned !== null) t.current = pinned / 60
    else if (!reduced) t.current += delta
  })
  return t
}

function mulberry(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let z = s
    z = Math.imul(z ^ (z >>> 15), z | 1)
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61)
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296
  }
}

/* ── Shared: orbital light traces (evidence in, receipts out) ─────────── */
function Traces({
  clock,
  seed,
  radius,
  tilt,
  count,
  intensity,
  outward,
  speed,
}: {
  clock: { current: number }
  seed: number
  radius: number
  tilt: [number, number, number]
  count: number
  intensity: number
  outward: number
  speed: number
}) {
  const mesh = useRef<InstancedMesh>(null)
  const { geometry, material, phases } = useMemo(() => {
    const g = new SphereGeometry(0.016, 6, 6)
    const m = new MeshBasicMaterial({ color: new Color(ICE), transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false })
    const rand = mulberry(seed * 7 + Math.round(radius * 100))
    const p = Array.from({ length: count }, () => ({ a: rand() * Math.PI * 2, v: 0.6 + rand() * 0.8, r: radius * (0.985 + rand() * 0.03) }))
    return { geometry: g, material: m, phases: p }
  }, [count, radius, seed])
  const m4 = useMemo(() => new Matrix4(), [])
  useFrame(() => {
    const inst = mesh.current
    if (!inst) return
    const t = clock.current
    for (let i = 0; i < phases.length; i++) {
      const ph = phases[i]
      const a = ph.a + t * speed * ph.v
      const drift = 1 + outward * 0.25 * ((i % 2) * 2 - 1) * ((t * 0.11 + ph.a) % 1)
      m4.makeTranslation(Math.cos(a) * ph.r * drift, 0, Math.sin(a) * ph.r * drift)
      inst.setMatrixAt(i, m4)
    }
    inst.instanceMatrix.needsUpdate = true
    material.opacity = 0.15 + 0.75 * intensity
  })
  return (
    <group rotation={tilt}>
      <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />
    </group>
  )
}

/* ── Concept A: THE GOVERNED CORE ─────────────────────────────────────── */
function GovernedCore({ rt, clock, seed, eased, coreLit, detail }: ConceptProps) {
  const group = useRef<import('three').Group>(null)
  const mats = useMemo(() => {
    const shellGeo = new IcosahedronGeometry(1.02, 1)
    return {
      shellGeo,
      shell: new MeshStandardMaterial({ color: new Color(CARBON), metalness: 0.88, roughness: 0.34, flatShading: true }),
      edges: new EdgesGeometry(shellGeo, 12),
      edgeMat: new MeshBasicMaterial({ color: new Color(STEEL), transparent: true, opacity: 0.5 }),
      lattice: new IcosahedronGeometry(0.86, 2),
      latticeMat: new MeshBasicMaterial({ color: new Color(ICE), wireframe: true, transparent: true, blending: AdditiveBlending, depthWrite: false }),
      inner: new SphereGeometry(0.52, 24, 24),
      innerMat: new MeshStandardMaterial({ color: new Color(CARBON_DEEP), emissive: new Color(ICE), emissiveIntensity: 0.4, roughness: 0.6, metalness: 0.1 }),
      ring: new TorusGeometry(1.62, 0.012, 10, 180),
      ring2: new TorusGeometry(2.02, 0.008, 10, 200),
      ringMat: new MeshStandardMaterial({ color: new Color(SLATE), metalness: 0.85, roughness: 0.38 }),
      brassRing: new TorusGeometry(1.3, 0.02, 12, 160),
      brassMat: new MeshStandardMaterial({ color: new Color(BRASS), metalness: 1, roughness: 0.28, emissive: new Color(BRASS), emissiveIntensity: 0.12 }),
    }
  }, [])
  useFrame(() => {
    const t = clock.current
    if (group.current) group.current.rotation.y = t * 0.05
    mats.latticeMat.opacity = 0.1 + 0.5 * eased.core
    mats.innerMat.emissiveIntensity = 0.25 + 1.15 * eased.core
    mats.brassMat.emissiveIntensity = coreLit ? 0.35 + 0.1 * Math.sin(t * 2.1) : 0.1
  })
  return (
    <group position={[0, 0.05, 0]}>
      <group ref={group}>
        <mesh geometry={mats.shellGeo} material={mats.shell} />
        <lineSegments geometry={mats.edges} material={mats.edgeMat} />
        <mesh geometry={mats.lattice} material={mats.latticeMat} />
        <mesh geometry={mats.inner} material={mats.innerMat} />
      </group>
      <mesh geometry={mats.ring} material={mats.ringMat} rotation={[Math.PI / 2.35, 0.12, 0]} />
      <mesh geometry={mats.ring2} material={mats.ringMat} rotation={[Math.PI / 1.75, -0.35, 0.2]} />
      <mesh geometry={mats.brassRing} material={mats.brassMat} rotation={[Math.PI / 2.1, 0.55, 0.35]} />
      <Traces clock={clock} seed={seed} radius={1.62} tilt={[Math.PI / 2.35, 0.12, 0]} count={26 * detail} intensity={eased.channels} outward={0} speed={0.55} />
      <Traces clock={clock} seed={seed + 1} radius={2.02} tilt={[Math.PI / 1.75, -0.35, 0.2]} count={18 * detail} intensity={eased.filaments} outward={1} speed={-0.4} />
    </group>
  )
}

/* ── Concept B: THE PROOF STRATA (winner, HERO_DECISION 2026-08-24) ───── */
const STRATA = ['signal', 'evidence', 'decision', 'authority', 'receipt'] as const

function makeLabelTexture(text: string, color: string) {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 96
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.clearRect(0, 0, 512, 96)
  ctx.font = '600 44px ui-monospace, Menlo, Consolas, monospace'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  const chars = text.toUpperCase().split('')
  let x = 8
  for (const ch of chars) {
    ctx.fillText(ch, x, 52)
    x += ctx.measureText(ch).width + 12
  }
  return canvas
}

function ProofStrata({ rt, clock, seed, eased, coreLit, detail }: ConceptProps) {
  const group = useRef<import('three').Group>(null)
  const slabRefs = useRef<Array<import('three').Group | null>>([])
  const beadMesh = useRef<InstancedMesh>(null)
  const parts = useMemo(() => {
    const plane = new BoxGeometry(3.3, 0.05, 2.1)
    const planeEdges = new EdgesGeometry(plane, 30)
    const rand = mulberry(seed * 13 + 5)
    // Conduits connect ADJACENT strata at fixed lattice points — structure,
    // not scatter. Beads ride them upward: claims ascending toward receipt.
    const conduits = Array.from({ length: 12 }, (_, i) => ({
      x: -1.25 + (i % 4) * 0.78 + (rand() - 0.5) * 0.3,
      z: -0.62 + Math.floor(i / 4) * 0.6 + (rand() - 0.5) * 0.24,
      gap: i % 4,
      phase: rand(),
      speed: 0.35 + rand() * 0.3,
    }))
    const labels = STRATA.map((name) => {
      const canvas = makeLabelTexture(name, name === 'authority' ? BRASS : ICE)
      if (!canvas) return null
      const tex = new CanvasTexture(canvas)
      tex.anisotropy = 4
      const mat = new SpriteMaterial({ map: tex, transparent: true, opacity: 0.72, depthWrite: false })
      return mat
    })
    return {
      plane,
      planeEdges,
      conduits,
      labels,
      nodeGeo: new SphereGeometry(0.02, 8, 8),
      beadGeo: new SphereGeometry(0.036, 10, 10),
      slab: new MeshStandardMaterial({ color: new Color('#131b25'), metalness: 0.62, roughness: 0.4 }),
      slabEdge: new MeshBasicMaterial({ color: new Color('#7da3c9'), transparent: true, opacity: 0.7 }),
      brassSlab: new MeshStandardMaterial({ color: new Color('#241d10'), metalness: 0.92, roughness: 0.3, emissive: new Color(BRASS), emissiveIntensity: 0.06 }),
      brassEdge: new MeshBasicMaterial({ color: new Color(BRASS), transparent: true, opacity: 0.95 }),
      conduitGeo: new CylinderGeometry(0.01, 0.01, 1, 6),
      conduitMat: new MeshBasicMaterial({ color: new Color(ICE), transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false }),
      nodeMat: new MeshBasicMaterial({ color: new Color(ICE_HOT), transparent: true, blending: AdditiveBlending, depthWrite: false }),
      beadMat: new MeshBasicMaterial({ color: new Color(ICE_HOT), transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false }),
      brassGlow: new MeshBasicMaterial({ color: new Color('#e8c987'), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }),
    }
  }, [seed])
  const m4 = useMemo(() => new Matrix4(), [])
  const beadColor = useMemo(() => new Color(), [])
  useFrame(() => {
    const t = clock.current
    if (group.current) group.current.rotation.y = -0.46 + (rt.reducedMotion ? 0 : Math.sin(t * 0.045) * 0.018)
    // fragmented state pulls the strata apart; assembled states close the stack.
    const gapScale = 1 + eased.fragments * 0.55
    slabRefs.current.forEach((g, i) => {
      if (g) g.position.y = (i - 2) * 0.6 * gapScale
    })
    parts.conduitMat.opacity = 0.18 + 0.5 * eased.channels
    parts.nodeMat.opacity = 0.15 + 0.75 * eased.nodes
    parts.brassEdge.opacity = coreLit ? 1 : 0.8
    parts.brassSlab.emissiveIntensity = coreLit ? 0.16 + 0.05 * Math.sin(t * 2) : 0.06
    // Beads: claims ascending; brighter pulse crossing the authority gap.
    const inst = beadMesh.current
    if (inst) {
      const visible = Math.min(parts.conduits.length, 6 + detail * 3)
      for (let i = 0; i < parts.conduits.length; i++) {
        const c = parts.conduits[i]
        if (i >= visible) {
          m4.makeTranslation(0, -50, 0)
          inst.setMatrixAt(i, m4)
          continue
        }
        const prog = (t * c.speed * (0.35 + 0.65 * eased.channels) + c.phase) % 1
        const y = (c.gap - 2) * 0.6 * gapScale + prog * 0.6 * gapScale
        m4.makeTranslation(c.x, y, c.z)
        inst.setMatrixAt(i, m4)
        const crossingAuthority = c.gap === 2 && prog > 0.82
        inst.setColorAt(i, beadColor.set(crossingAuthority ? '#f0d089' : ICE_HOT))
      }
      inst.instanceMatrix.needsUpdate = true
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true
      parts.beadMat.opacity = 0.35 + 0.6 * eased.channels
    }
  })
  return (
    <group ref={group} position={[0.46, -0.28, 0]} rotation={[0.09, -0.46, 0.02]} scale={1.06}>
      {STRATA.map((name, i) => {
        const brass = name === 'authority'
        return (
          <group
            key={name}
            position={[i * 0.055, (i - 2) * 0.6, i * -0.035]}
            ref={(el) => {
              slabRefs.current[i] = el
            }}
          >
            <mesh geometry={parts.plane} material={brass ? parts.brassSlab : parts.slab} />
            <lineSegments geometry={parts.planeEdges} material={brass ? parts.brassEdge : parts.slabEdge} />
            {parts.labels[i] && <sprite material={parts.labels[i]!} position={[1.92, 0.12, 1.05]} scale={[0.62, 0.12, 1]} />}
          </group>
        )
      })}
      {parts.conduits.slice(0, 6 + detail * 3).map((c, i) => (
        <group key={i}>
          <mesh geometry={parts.conduitGeo} material={parts.conduitMat} position={[c.x, (c.gap - 1.5) * 0.6, c.z]} scale={[1, 0.6, 1]} />
          <mesh geometry={parts.nodeGeo} material={parts.nodeMat} position={[c.x, (c.gap - 1) * 0.6 + 0.04, c.z]} />
        </group>
      ))}
      <instancedMesh ref={beadMesh} args={[parts.beadGeo, parts.beadMat, parts.conduits.length]} frustumCulled={false} />
    </group>
  )
}

/* ── Concept C: THE APERTURE ──────────────────────────────────────────── */
function Aperture({ rt, clock, seed, eased, coreLit, detail }: ConceptProps) {
  const blades = useRef<import('three').Group>(null)
  const parts = useMemo(() => {
    return {
      housing: new TorusGeometry(1.5, 0.3, 24, 96),
      housingMat: new MeshStandardMaterial({ color: new Color(CARBON), metalness: 0.85, roughness: 0.42, flatShading: false }),
      housingRim: new TorusGeometry(1.86, 0.015, 10, 160),
      rimMat: new MeshStandardMaterial({ color: new Color(STEEL), metalness: 0.9, roughness: 0.3 }),
      blade: new BoxGeometry(0.92, 0.5, 0.05),
      bladeMat: new MeshStandardMaterial({ color: new Color('#1b2530'), metalness: 0.9, roughness: 0.33, flatShading: true }),
      bladeEdge: new BoxGeometry(0.92, 0.03, 0.055),
      bladeEdgeMat: new MeshStandardMaterial({ color: new Color(BRASS), metalness: 1, roughness: 0.3, emissive: new Color(BRASS), emissiveIntensity: 0.1 }),
      glow: new SphereGeometry(0.34, 24, 24),
      glowMat: new MeshBasicMaterial({ color: new Color(ICE_HOT), transparent: true, blending: AdditiveBlending, depthWrite: false }),
      beam: new BoxGeometry(3.4, 0.012, 0.012),
      beamMat: new MeshBasicMaterial({ color: new Color(ICE), transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false }),
    }
  }, [])
  useFrame(() => {
    const t = clock.current
    const open = 0.16 + 0.5 * eased.core
    if (blades.current) {
      blades.current.children.forEach((child, i) => {
        const a = (i / blades.current!.children.length) * Math.PI * 2
        child.position.set(Math.cos(a) * (0.62 + open * 0.55), Math.sin(a) * (0.62 + open * 0.55), 0)
        child.rotation.z = a + Math.PI / 2 + open * 0.9
      })
      blades.current.rotation.z = t * 0.03
    }
    parts.glowMat.opacity = 0.25 + 0.65 * eased.core
    parts.bladeEdgeMat.emissiveIntensity = coreLit ? 0.4 : 0.08
    parts.beamMat.opacity = 0.12 + 0.5 * eased.channels
  })
  const rand = mulberry(seed * 3 + 11)
  const beams = Array.from({ length: 4 + detail * 2 }, (_, i) => ({
    rot: (rand() - 0.5) * 0.7,
    y: (rand() - 0.5) * 0.8,
    z: (rand() - 0.5) * 0.4,
  }))
  return (
    <group position={[0.15, 0.1, 0]} rotation={[0.12, -0.5, 0.04]}>
      <mesh geometry={parts.housing} material={parts.housingMat} />
      <mesh geometry={parts.housingRim} material={parts.rimMat} />
      <group ref={blades}>
        {Array.from({ length: 8 }, (_, i) => (
          <group key={i}>
            <mesh geometry={parts.blade} material={parts.bladeMat} />
            <mesh geometry={parts.bladeEdge} material={parts.bladeEdgeMat} position={[0, -0.26, 0]} />
          </group>
        ))}
      </group>
      <mesh geometry={parts.glow} material={parts.glowMat} />
      {beams.map((b, i) => (
        <mesh key={i} geometry={parts.beam} material={parts.beamMat} position={[1.9, b.y, b.z]} rotation={[0, 0, b.rot]} />
      ))}
      <Traces clock={clock} seed={seed + 3} radius={1.86} tilt={[0, 0, 0]} count={20 * detail} intensity={eased.filaments} outward={1} speed={0.45} />
    </group>
  )
}

interface ConceptProps {
  rt: SceneRuntime
  clock: { current: number }
  seed: number
  eased: (typeof SCENE_STATES)['dormant']
  coreLit: boolean
  detail: number
}

/* ── Assembly under the existing camera/light/fog law ─────────────────── */
export function ResetSceneInner({
  rt,
  config,
  state,
  camera,
  seed,
  onMembraneReport,
}: {
  rt: SceneRuntime
  config: Spike1Config
  state: SceneStateName
  camera: CameraName
  seed: number
  onMembraneReport?: (r: MembraneReport) => void
}) {
  const concept = useMemo(() => readConcept(), [])
  const scene = useThree((s) => s.scene)
  const { eased, coreLit } = useEased(config.pinnedState ?? state, rt.tokens.chapterDuration, rt.reducedMotion)
  const clock = useSceneClock(rt.reducedMotion)
  const reported = useRef(false)
  useFrame(() => {
    if (!reported.current) {
      reported.current = true
      onMembraneReport?.({ layers: 0, triangles: 0, proceduralTextureBytes: 0 } as MembraneReport)
    }
  })
  useMemo(() => {
    scene.fog = new Fog(new Color('#0a0f16'), rt.tokens.fogNear, rt.tokens.fogFar)
    scene.background = null
  }, [rt.tokens.fogFar, rt.tokens.fogNear, scene])
  const detail = rt.capability.tier >= 3 ? 2 : 1
  const shared = { rt, clock, seed, eased, coreLit, detail }
  return (
    <>
      <LightRig tokens={rt.tokens} />
      <CameraRig
        pose={config.pinnedCamera ?? camera}
        fov={rt.capability.coarsePointer ? rt.tokens.fovMobile : rt.tokens.fovDesktop}
        damping={rt.tokens.cameraDamping}
        cut={rt.reducedMotion}
      />
      {concept === 'core' && <GovernedCore {...shared} />}
      {concept === 'strata' && <ProofStrata {...shared} />}
      {concept === 'aperture' && <Aperture {...shared} />}
    </>
  )
}
