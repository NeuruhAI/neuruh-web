export const PUBLIC_OFFERS = [
  {
    id: 'O01',
    scope: 'One data problem',
    name: 'Data Rescue',
    promise: 'Turn a broken, buried, or unusable set of files or records into something you can actually work with.',
    provide: 'The files, export, or records — plus what is wrong with them.',
    receive: 'A usable recovered or normalized output, plus a concise note on what changed and anything still missing.',
    proof: 'Live cashier on neuruh.com. Founder-operated delivery after intake — a live cashier is not automated fulfillment.',
    price: '$299',
    href: 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04',
    cta: 'Start Data Rescue',
  },
  {
    id: 'O02',
    scope: 'One decision',
    name: 'Opportunity Dossier',
    promise: 'A source-backed brief on one property, company, market, or opportunity — focused on what matters next.',
    provide: 'The target and the decision or question you need answered.',
    receive: 'The evidence, key upside and risks, and a clear recommended next move in one concise dossier.',
    proof: 'Same public evidence discipline as DeedSonar: sources kept, recommendation explicit. A live cashier is not automated fulfillment.',
    price: '$499',
    href: 'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05',
    cta: 'Order the Dossier',
  },
  {
    id: 'O05',
    scope: 'One workflow',
    name: 'Workflow Sprint',
    promise: 'Turn one repetitive or chaotic process into a working, documented workflow.',
    provide: 'The current process, the tools involved, and the result you want.',
    receive: 'A scoped working workflow and the handoff needed to run it.',
    proof: 'Same public pipeline as How it works: scoped action, documented handoff. A live cashier is not automated fulfillment.',
    price: '$1250',
    href: 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06',
    cta: 'Start the Sprint',
  },
] as const

/**
 * Quoted engagements — canonical products with NO cashier.
 *
 * These are real, courted products (their packs are canonical on main in their own
 * private repos) that fulfil today through a manual quote. They deliberately carry
 * no price and no Stripe href: pricing is a founder decision that has not been made,
 * and this site does not invent one. The checkout-link court asserts these never
 * acquire a cashier, and the SEO court asserts no internal price recommendation
 * reaches a public page.
 */
export const QUOTED_ENGAGEMENTS = [
  {
    id: 'Q-PROPERTY-SCAN',
    scope: 'One market',
    name: 'Property Scan',
    promise:
      'A ranked property list for exactly one county or equivalent market, with evidence and provenance — not contacts.',
    provide: 'The market you want ranked, and the kind of asset you buy.',
    receive:
      'Ranked opportunities with parcel identity, the evidence and signal families behind each one, the risks and unknowns, and a next action for an operator.',
    excludes: 'No owner contact data, no skip-trace, and no attorney phones. You receive the ranked result and its evidence, never the internals behind it.',
    pricing: 'Quoted per market.',
    href: '/contact',
    cta: 'Request a quote',
  },
  {
    id: 'Q-LEAD-RESCUE',
    scope: 'One list',
    name: 'Lead Rescue',
    promise:
      'Send the list you already have. Get back a cleaned, classified, DNC-aware, prioritized report and a receipt.',
    provide: 'The list you already own, as a CSV or JSON export.',
    receive:
      'Normalized and deduplicated rows, a rescue classification per row, phone provenance, explicit DNC state, and priority bands — plus a receipt for the run.',
    excludes: 'We do not call anyone. A phone present is never treated as callable, and an unknown DNC state is never recorded as clear.',
    pricing: 'Quoted by list size.',
    href: '/contact',
    cta: 'Request a quote',
  },
] as const

export type QuotedEngagementId = (typeof QUOTED_ENGAGEMENTS)[number]['id']

export type PublicOfferId = (typeof PUBLIC_OFFERS)[number]['id']

export const OFFER_NEXT_STEPS = [
  {
    title: 'Checkout',
    body: 'Choose the offer that fits and complete the secure checkout.',
  },
  {
    title: 'Inputs',
    body: 'A founder replies from jeramie@neuruh.com to the address you used at checkout to collect the inputs listed above. Scope and timing are agreed in that reply — nothing is automated.',
  },
  {
    title: 'Delivery',
    body: 'A founder completes the scoped work and delivers the result back to that address. A live cashier is not automated fulfillment.',
  },
] as const

export const OFFER_BY_ID = Object.fromEntries(PUBLIC_OFFERS.map((offer) => [offer.id, offer])) as {
  [K in PublicOfferId]: (typeof PUBLIC_OFFERS)[number]
}
