import snapshotJson from '../../public/truth/snapshot.json'
import type { LivingState, PublicObject, PublicRelationship, TruthMode } from './types'

const snapshot = snapshotJson as unknown as {
  schema_version: string
  dataset: {
    id: string
    label: string
    truth_mode: TruthMode
    generated_at: string
    last_verified_at: string
    stale_after: string
    stale: boolean
    live_connectivity: false
    limitation: string
  }
  living_state: LivingState
  sources: Array<{ ref: string; class: string; title: string; path_or_uri: string; public_safe: true }>
  objects: PublicObject[]
  relationships: PublicRelationship[]
}

export const WORLD_IDS = ['bookeit', 'curbclaim', 'datum', 'deedsonar', 'factory-visual-cortex', 'find-sell-profit', 'lead-recipe-os', 'liquidity-engine', 'proof-os'] as const

export function getPublicSnapshot() {
  return snapshot
}

export function getTruthSummary() {
  return {
    truthMode: snapshot.dataset.truth_mode,
    lastVerifiedAt: snapshot.dataset.last_verified_at,
    limitation: snapshot.dataset.limitation,
    livingState: snapshot.living_state,
    liveConnectivity: snapshot.dataset.live_connectivity,
    stale: snapshot.dataset.stale,
    sourceRef: snapshot.dataset.id,
  }
}

export function getPublicObject(id: string) {
  return snapshot.objects.find((object) => object.id === id)
}

export function getPublicObjects(kind?: PublicObject['kind']) {
  return kind ? snapshot.objects.filter((object) => object.kind === kind) : snapshot.objects
}

export function getRelationshipsFor(id: string) {
  return snapshot.relationships.filter((relationship) => relationship.source_id === id || relationship.target_id === id)
}

/**
 * Evidence mode of one dated figure, relative to the snapshot that carries it (issue #10, Workstream 1.2):
 *   VERIFIED SNAPSHOT  re-read within a day of this snapshot's verification
 *   ATTESTED           an earlier dated receipt carried forward unchanged, still the newest for that figure
 *   HISTORICAL         superseded by a newer receipt; kept with its date, never presented as current
 * Rendering never re-verifies anything, so no mode here is LIVE.
 */
export type EvidenceMode = 'VERIFIED SNAPSHOT' | 'ATTESTED' | 'HISTORICAL'
export const EVIDENCE_MODES: readonly EvidenceMode[] = ['VERIFIED SNAPSHOT', 'ATTESTED', 'HISTORICAL']
const VERIFIED_WINDOW_MS = 24 * 60 * 60 * 1000

export function evidenceMode(metric: { classification: string; as_of: string }): EvidenceMode {
  if (metric.classification === 'HISTORICAL') return 'HISTORICAL'
  const gap = Date.parse(snapshot.dataset.last_verified_at) - Date.parse(metric.as_of)
  return gap <= VERIFIED_WINDOW_MS ? 'VERIFIED SNAPSHOT' : 'ATTESTED'
}
