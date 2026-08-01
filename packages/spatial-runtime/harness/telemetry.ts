export interface SpatialTelemetrySample {
  tier: 0 | 1 | 2 | 3
  gpu: string | null
  firstFrameMs: number | null
  gpuP95Ms: number | null
  contextLosses: number
  tier0: boolean
}

/** P0 hook only: records locally and intentionally has no transport endpoint. */
export function recordTelemetry(sample: SpatialTelemetrySample): void {
  if (typeof window === 'undefined') return
  ;(window as typeof window & { __NEURUH_TELEMETRY__?: SpatialTelemetrySample[] }).__NEURUH_TELEMETRY__ ??= []
  ;(window as typeof window & { __NEURUH_TELEMETRY__?: SpatialTelemetrySample[] }).__NEURUH_TELEMETRY__!.push(sample)
}
