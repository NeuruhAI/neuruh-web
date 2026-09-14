/** Canonical harness execution sequence and the demonstration label. No runtime imports: courts load this directly. */
export const HARNESS_STAGES = [
  'INTAKE', 'SCOPE', 'BASELINE', 'GOLDEN CASES', 'HELD-OUT CASES', 'ADVERSARIAL CASES', 'RUN',
  'DELTA', 'REGRESSIONS', 'AUTHORITY CHECK', 'EVIDENCE CHECK', 'DECISION', 'SIGNED RECEIPT',
] as const

export type HarnessStage = (typeof HARNESS_STAGES)[number]

export const DEMO_BANNER = 'BROWSER DEMONSTRATION — NOT A PRODUCTION ASSURANCE RESULT'
