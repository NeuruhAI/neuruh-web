import { TRUTH_RULES } from './publicTruthRules'

/**
 * Public-safe proof cards only.
 * Projection ≠ factory tour. No private organ SHAs, no topology, no customer data.
 */
export const PUBLIC_PROOF_CARDS = [
  {
    id: 'jgi-dispatch-bridge',
    subject: 'JGI dispatch bridge',
    status: 'MERGED / COURTED',
    claim: 'Incoming work can get a named destination so a job does not vanish between intake and the person who will do it.',
    evidence: 'Merged and courted as a public-safe projection. No worker map, no private routing table, no internal SHA.',
    limitation: `${TRUTH_RULES.mergedIsNotLive} ${TRUTH_RULES.organsCourted} Not a live product.`,
    href: '/work-with-neuruh',
    hrefLabel: 'See how public work enters',
  },
  {
    id: 'switchboard',
    subject: 'Switchboard',
    status: 'MERGED / COURTED',
    claim: 'Requests can land in one place and move to the next honest step — a scoped offer, a question, or the founder.',
    evidence: 'Merged and courted as a public-safe projection. This site’s commercial routes are the public face.',
    limitation: `${TRUTH_RULES.mergedIsNotLive} ${TRUTH_RULES.organsCourted} This public site is not a live Switchboard product.`,
    href: '/ask',
    hrefLabel: 'Ask Neuruh',
  },
  {
    id: 'honey-pot-git-custody',
    subject: 'Honey Pot git custody',
    status: 'MERGED / COURTED',
    claim: 'Important repositories can have an identity, a backup posture, and a known home — not a pile of unmarked copies.',
    evidence: 'Merged and courted as a public-safe projection. The public organism record already states the Archive Refinery custody claim without publishing a private inventory.',
    limitation: `${TRUTH_RULES.mergedIsNotLive} ${TRUTH_RULES.organsCourted} No private archive listing and no private repo link.`,
    href: '/organism',
    hrefLabel: 'Read the public custody claim',
  },
  {
    id: 'cockpit-laric',
    subject: 'Cockpit / Laric',
    status: 'MERGED / COURTED',
    claim: 'Cockpit / Galaxy is a curated public map of what exists and what state it is in. Laric is named only as a sibling surface.',
    evidence: 'Merged and courted. The public Galaxy page is a dated, curated self-model — not a live operator console and not a live feed.',
    limitation: `${TRUTH_RULES.mergedIsNotLive} ${TRUTH_RULES.organsCourted} Observed interface evidence does not prove production connectivity.`,
    href: '/galaxy',
    hrefLabel: 'Open the public Galaxy map',
  },
  {
    id: 'data-rescue',
    subject: 'Data Rescue',
    status: 'LIVE CASHIER',
    claim: 'A fixed-scope public offer: one data problem, $299, live checkout on neuruh.com.',
    evidence: 'O01 is one of the three SHIP-001 cashiers. Delivery is founder-operated after intake. No customer-result library is claimed.',
    limitation: `${TRUTH_RULES.liveCashierIsNotFulfillment} ${TRUTH_RULES.cashiersLiveOrderDraft}`,
    href: '/offers',
    hrefLabel: 'Open the Data Rescue offer',
  },
  {
    id: 'xai-marketplace',
    subject: 'xAI marketplace',
    status: 'IN_REVIEW',
    claim: 'A marketplace listing is in review. It is not listed, not live, not a storefront, and not a purchase path.',
    evidence: TRUTH_RULES.xaiInReview,
    limitation: `${TRUTH_RULES.inReviewIsNotListed} Not approved, not buyable here.`,
    href: '/refusals',
    hrefLabel: 'Read the claim boundaries',
  },
  {
    id: 'neuruh-com-launch',
    subject: 'neuruh.com site launch',
    status: 'SHIPPED_LIVE',
    claim: 'SHIP-001 on neuruh.com is SHIPPED_LIVE: the art-direction commercial site and three public cashiers.',
    evidence: 'Public site neuruh.com · public repo NeuruhAI/neuruh-web · SHIP-001 merge 30947182. Cashiers are the existing payment links, not new ones.',
    limitation: `${TRUTH_RULES.ship001} ${TRUTH_RULES.liveCashierIsNotFulfillment} ${TRUTH_RULES.cashiersLiveOrderDraft}`,
    href: '/cases',
    hrefLabel: 'Read the public launch case',
  },
] as const
