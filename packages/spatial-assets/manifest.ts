export type AssetStage = 'detecting' | 'building-tissue' | 'channels-core' | 'ready'
export type Lod = 0 | 1 | 2

export const TISSUE_LODS = [
  { lod: 0 as Lod, triangles: 180000, tiers: [3] },
  { lod: 1 as Lod, triangles: 74000, tiers: [2] },
  { lod: 2 as Lod, triangles: 22000, tiers: [1] },
] as const

export const ASSET_BUDGET = { tier3WireKb: 1331.2, decodedMb: 80 } as const

export function selectLod(tier: 1 | 2 | 3): Lod {
  return tier === 3 ? 0 : tier === 2 ? 1 : 2
}

export function nextStage(stage: AssetStage): AssetStage {
  return stage === 'detecting' ? 'building-tissue' : stage === 'building-tissue' ? 'channels-core' : 'ready'
}
