import type { CameraName, SceneStateName } from '../spatial-runtime/contract/sceneStates'
import type { LivingState, TruthMode } from './types'

export interface AliveChapter {
  id: string
  label: string
  title: string
  body: string
  href: string
  truthMode: TruthMode
  claimBoundary: string
  semanticState: LivingState
  rendererState: SceneStateName
  camera: CameraName
  feature?: 'truth' | 'contradiction' | 'trace' | 'gate' | 'entry'
}

export const ALIVE_CHAPTERS: readonly AliveChapter[] = [
  {
    id: 'presence',
    label: 'Presence',
    title: 'A public self-model, with its limits intact.',
    body: 'Neuruh.com exposes a dated, public-safe projection of the organism: worlds, organs, evidence, relationships, contradictions, authority, and receipts.',
    href: '/',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'No private or production connector is attached.',
    semanticState: 'CONTRADICTING',
    rendererState: 'metabolism',
    camera: 'wide',
    feature: 'truth',
  },
  {
    id: 'estate',
    label: 'The Estate',
    title: 'Identity and custody before automation.',
    body: 'The Archive Refinery / Local AI Estate treats repositories, prototypes, engines, receipts, agents, and documents as typed assets with custody and provenance—not debris and not a remembered count.',
    href: '/organism#archive-refinery',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'The final private estate census is not exposed as public truth.',
    semanticState: 'SENSING',
    rendererState: 'fragmented',
    camera: 'wide',
  },
  {
    id: 'neural-core',
    label: 'Neural Core',
    title: 'Context is compiled, not dumped.',
    body: 'The Jeramie Neural Core architecture composes canonical definitions, schemas, episodes, contradictions, procedures, tools, evidence handles, authority, and risk into a bounded context packet.',
    href: '/organism#neural-core',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'Engineering architecture is not proof of a deployed personal model.',
    semanticState: 'INTEGRATING',
    rendererState: 'awakening',
    camera: 'mid',
  },
  {
    id: 'organism',
    label: 'Organism',
    title: 'Independent worlds become one system without becoming one app.',
    body: 'Execution Platform, Cockpit / Galaxy, Founder Command, Adaptive Intelligence, Neural Core, Archive Refinery, LARIC, Field Scout, and product worlds remain specialized while sharing contracts.',
    href: '/organism',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'The manifest describes roles and relationships, not universal runtime health.',
    semanticState: 'INTEGRATING',
    rendererState: 'vertical',
    camera: 'vertical',
  },
  {
    id: 'galaxy',
    label: 'Galaxy',
    title: 'The map must preserve disagreement.',
    body: 'Galaxy answers what exists, its state, dependencies, evidence, decision ownership, next action, and change over time. Its current public graph is curated from the manifest.',
    href: '/galaxy',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'Observed interface evidence does not prove production connectivity.',
    semanticState: 'CONTRADICTING',
    rendererState: 'metabolism',
    camera: 'close',
    feature: 'contradiction',
  },
  {
    id: 'adaptive-intelligence',
    label: 'Adaptive Intelligence',
    title: 'Claims earn promotion—or remain unresolved.',
    body: 'Raw becomes extracted, candidate, hypothesis, and tested before it can become canonical, rejected, superseded, or quarantined. Every change retains evidence and rollback.',
    href: '/research/adaptive-intelligence',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'Emergence remains outside the guaranteed cycle.',
    semanticState: 'LEARNING',
    rendererState: 'receipt',
    camera: 'mid',
  },
  {
    id: 'world-emitter',
    label: 'World Emitter',
    title: 'Shared substrate. Distinct commercial worlds.',
    body: 'DeedSonar, Find Sell Profit, Lead Recipe OS, DATUM, and Factory / Visual Cortex keep different promises and commercialization routes while inheriting the same evidence and governance law.',
    href: '/worlds',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'Product architecture and observed surfaces do not establish current revenue or deployment.',
    semanticState: 'GOVERNING',
    rendererState: 'vertical',
    camera: 'vertical',
  },
  {
    id: 'governed-execution',
    label: 'Governed Execution',
    title: 'Authority is a boundary, not a flourish.',
    body: 'A public-safe walkthrough can traverse signal, evidence, contradiction, scenario, authority gate, sandbox decision, receipt, and state update without an external write.',
    href: '/proof#sandbox-trace',
    truthMode: 'SANDBOX',
    claimBoundary: 'The walkthrough executes no production action.',
    semanticState: 'GOVERNING',
    rendererState: 'gating',
    camera: 'core',
    feature: 'trace',
  },
  {
    id: 'case-zero',
    label: 'Case Zero',
    title: 'A hypothesis becomes useful by risking rejection.',
    body: 'Latent Cross-Domain Emergence is framed as a blinded research protocol with predictions, domain ablations, competing hypotheses, controls, misses, and explicit rulings.',
    href: '/research/case-zero',
    truthMode: 'CONCEPTUAL',
    claimBoundary: 'No completed empirical result or universal law is claimed.',
    semanticState: 'QUARANTINED',
    rendererState: 'fragmented',
    camera: 'close',
  },
  {
    id: 'founder',
    label: 'Founder',
    title: 'The pieces were never the problem. Coherence was.',
    body: 'The founder architecture turns years of fragmentation, rebuilding, and persistence into a system that can preserve ownership, state, evidence, and honest incompleteness outside one person’s memory.',
    href: '/founder',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'No invented counts, investment totals, critics, or completeness claims.',
    semanticState: 'RECEIVING',
    rendererState: 'receipt',
    camera: 'mid',
  },
  {
    id: 'entry',
    label: 'Entry',
    title: 'Inspect the evidence. Follow the relationship. Keep the boundary visible.',
    body: 'Explore the organism, traverse Galaxy, inspect product worlds, follow the research, and verify what is proven, partial, conceptual, planned, blocked, or unknown.',
    href: '/proof',
    truthMode: 'VERIFIED_SNAPSHOT',
    claimBoundary: 'Deployment is not authorized; G1 is blocked externally and G2 is not certified.',
    semanticState: 'CONTRADICTING',
    rendererState: 'entry',
    camera: 'wide',
    feature: 'entry',
  },
] as const

export const ALIVE_TRACE_STEPS = [
  { id: 'S1', claim: 'Public-safe signal is registered', provenance: 'SANDBOX · source.registered · canonical-document' },
  { id: 'S2', claim: 'Claim is extracted with its source', provenance: 'SANDBOX · claim.extracted · source retained' },
  { id: 'S3', claim: 'Contradiction stays open', provenance: 'SANDBOX · claim.contradicted · both source sets visible' },
  { id: 'S4', claim: 'A reversible scenario is compiled', provenance: 'SANDBOX · scenario.compiled · no external write' },
  { id: 'S5', claim: 'Authority gate withholds production action', provenance: 'SANDBOX · decision.gated · read-only boundary' },
  { id: 'S6', claim: 'A sandbox receipt records the refusal', provenance: 'SANDBOX · receipt.recorded · outcome: NOT_EXECUTED' },
] as const
