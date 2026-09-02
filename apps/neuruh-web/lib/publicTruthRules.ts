/**
 * Public-safe truth rules for proof and case surfaces.
 * Merged is not live. In review is not listed. A live cashier is not automated fulfillment.
 */
export const TRUTH_RULES = {
  mergedIsNotLive: 'Merged is not live.',
  inReviewIsNotListed: 'IN_REVIEW is not listed and is not live.',
  liveCashierIsNotFulfillment: 'A live cashier is not automated fulfillment.',
  noPrivateRepos: 'Do not link private GitHub repositories on the public site.',
  ship001: 'SHIP-001 on neuruh.com is SHIPPED_LIVE.',
  cashiersLiveOrderDraft: 'O01, O02, and O05 cashiers are live. ORDER→FR remains a draft, not merged.',
  xaiInReview: 'xAI marketplace is IN_REVIEW — not listed, not live.',
  organsCourted: 'JGI, Switchboard, Honey Pot, and Cockpit are merged/courted, not live-proven.',
} as const

export const PRIVATE_GITHUB_REPOS = [
  'neuruh-workers',
  'cockpit',
  'data-rescue',
] as const
