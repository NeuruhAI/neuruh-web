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

export const WORLD_IDS = ['bookeit', 'curbclaim', 'datum', 'deedsonar', 'factory-visual-cortex', 'find-sell-profit', 'lead-recipe-os', 'proof-os'] as const

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
