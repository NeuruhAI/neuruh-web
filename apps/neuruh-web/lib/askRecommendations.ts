import { PUBLIC_OFFERS } from './publicOffers'

/**
 * Public Ask Neuruh output is a hard ceiling of three cards.
 * Routing is a labeled buyer path — not a hidden ranking and not a factory method.
 */
export const ASK_LANES = ['FASTEST', 'BEST VALUE', 'CUSTOM'] as const
export type AskLane = (typeof ASK_LANES)[number]

export const ASK_INTENTS = [
  {
    id: 'data',
    label: 'A data problem',
    hint: 'Files, exports, or records you cannot use as they are.',
    highlight: 'FASTEST' as const,
  },
  {
    id: 'decision',
    label: 'A decision on one target',
    hint: 'One property, company, market, or opportunity.',
    highlight: 'BEST VALUE' as const,
  },
  {
    id: 'workflow',
    label: 'A workflow — or something that does not fit',
    hint: 'A repetitive process, or work that needs a founder conversation.',
    highlight: 'CUSTOM' as const,
  },
] as const

export const ASK_CARDS = [
  {
    lane: 'FASTEST' as const,
    offer: PUBLIC_OFFERS[0],
    why: 'Smallest scope. Shortest typical turnaround. Live checkout today.',
    priceRange: PUBLIC_OFFERS[0].price,
    ctaHref: PUBLIC_OFFERS[0].href,
    ctaLabel: PUBLIC_OFFERS[0].cta,
    secondaryHref: '/thank-you?offer=O01',
    secondaryLabel: 'See the handoff',
  },
  {
    lane: 'BEST VALUE' as const,
    offer: PUBLIC_OFFERS[1],
    why: 'One decision, source-backed, priced for a brief rather than a build.',
    priceRange: PUBLIC_OFFERS[1].price,
    ctaHref: PUBLIC_OFFERS[1].href,
    ctaLabel: PUBLIC_OFFERS[1].cta,
    secondaryHref: '/thank-you?offer=O02',
    secondaryLabel: 'See the handoff',
  },
  {
    lane: 'CUSTOM' as const,
    offer: PUBLIC_OFFERS[2],
    why: 'A scoped sprint when the work is a process — or a founder conversation when it is not.',
    priceRange: `${PUBLIC_OFFERS[2].price} sprint · custom work quoted`,
    ctaHref: PUBLIC_OFFERS[2].href,
    ctaLabel: PUBLIC_OFFERS[2].cta,
    secondaryHref: '/contact',
    secondaryLabel: 'Talk to the founder',
  },
] as const

export const ASK_OUTPUT_MAX = ASK_CARDS.length
