export type TruthMode = 'LIVE' | 'VERIFIED_SNAPSHOT' | 'SANDBOX' | 'CONCEPTUAL' | 'PLANNED' | 'BLOCKED' | 'UNKNOWN'
export type ClaimClass = 'THREAD_CONFIRMED' | 'OBSERVED' | 'ARCHITECTURE' | 'PROPOSED_IMPLEMENTATION' | 'HYPOTHESIS' | 'UNVALIDATED_CLAIM'
export type LivingState = 'DORMANT' | 'SENSING' | 'INTEGRATING' | 'CONTRADICTING' | 'GOVERNING' | 'EXECUTING' | 'RECEIVING' | 'LEARNING' | 'STABLE' | 'BLOCKED' | 'QUARANTINED' | 'DEGRADED'

export interface PublicSource {
  ref: string
  class: string
  title: string
  path_or_uri: string
  public_safe: true
}

export interface PublicContradiction {
  id: string
  field: string
  status: 'UNRESOLVED'
  summary: string
  supporting_sources: string[]
  opposing_sources: string[]
}

export interface ClassifiedMetric {
  name: string
  value: number
  classification: 'MEASURED' | 'OBSERVED' | 'DERIVED' | 'BUDGET' | 'HISTORICAL'
  unit: string
  as_of: string
  source_ref: string
}

export interface PublicObject {
  id: string
  kind: 'organism' | 'organ' | 'world' | 'research' | 'proof' | 'system'
  name: string
  summary: string
  truth_mode: TruthMode
  claim_class: ClaimClass
  maturity: string
  status: string
  last_verified_at: string
  source: PublicSource
  evidence_summary: { status: string; statement: string; source_refs: string[] }
  public_route: string
  contradictions?: PublicContradiction[]
  metrics?: ClassifiedMetric[]
  limitations: string[]
}

export interface PublicRelationship {
  id: string
  type: string
  source_id: string
  target_id: string
  direction: 'OUTBOUND' | 'INBOUND' | 'BIDIRECTIONAL'
  truth_mode: TruthMode
  observed_at: string
  source_ref: string
  limitations?: string[]
}

