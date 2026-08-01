export const MOTION_VERBS = ['recognition', 'organization', 'contradiction', 'gating', 'execution', 'receipt', 'adaptation'] as const
export const MOTION_ROUTE = {
  full: { cinematicMs: 1400, traceCadenceMs: 760, travel: true },
  reduced: { cinematicMs: 100, traceCadenceMs: 220, travel: false },
} as const
