export const TRANSITIONS = Object.freeze({
  DORMANT: ['SENSING', 'DEGRADED'],
  SENSING: ['INTEGRATING', 'CONTRADICTING', 'DEGRADED'],
  INTEGRATING: ['STABLE', 'CONTRADICTING', 'GOVERNING'],
  CONTRADICTING: ['GOVERNING', 'QUARANTINED', 'STABLE'],
  GOVERNING: ['EXECUTING', 'BLOCKED', 'QUARANTINED'],
  EXECUTING: ['RECEIVING', 'BLOCKED'],
  RECEIVING: ['LEARNING', 'STABLE', 'CONTRADICTING'],
  LEARNING: ['STABLE'],
  STABLE: ['SENSING', 'CONTRADICTING', 'DEGRADED'],
  BLOCKED: ['SENSING', 'GOVERNING'],
  QUARANTINED: ['SENSING', 'GOVERNING'],
  DEGRADED: ['SENSING', 'STABLE'],
})

export const SEMANTIC_TO_RENDERER = Object.freeze({
  DORMANT: 'dormant',
  SENSING: 'awakening',
  INTEGRATING: 'metabolism',
  CONTRADICTING: 'metabolism',
  GOVERNING: 'gating',
  EXECUTING: 'gating',
  RECEIVING: 'receipt',
  LEARNING: 'receipt',
  STABLE: 'entry',
  BLOCKED: 'fragmented',
  QUARANTINED: 'fragmented',
  DEGRADED: 'dormant',
})

export function transition(from, to, context = {}) {
  if (!TRANSITIONS[from]?.includes(to)) throw new Error(`illegal living-state transition ${from} -> ${to}`)
  if (to === 'EXECUTING') {
    for (const key of ['truth_mode', 'authority', 'reversibility', 'source']) {
      if (!context[key]) throw new Error(`EXECUTING requires ${key}`)
    }
  }
  if (from === 'EXECUTING' && to === 'RECEIVING' && !context.receipt_ref) throw new Error('RECEIVING requires receipt_ref')
  return { from, to }
}

export function deriveLivingState(snapshot) {
  if (snapshot.objects.some((object) => object.contradictions?.length)) return 'CONTRADICTING'
  if (snapshot.dataset.stale) return 'DEGRADED'
  if (snapshot.objects.some((object) => object.truth_mode === 'BLOCKED')) return 'BLOCKED'
  return 'STABLE'
}

