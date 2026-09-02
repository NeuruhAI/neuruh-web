export const PUBLIC_OFFERS = [
  {
    id: 'O01',
    scope: 'One data problem',
    name: 'Data Rescue',
    promise: 'Turn a broken, buried, or unusable set of files or records into something you can actually work with.',
    provide: 'The files, export, or records — plus what is wrong with them.',
    receive: 'A usable recovered or normalized output, plus a concise note on what changed and anything still missing.',
    turnaround: 'Typically 2–5 business days after we have your inputs.',
    proof: 'Live public offer on neuruh.com with a fixed checkout. Founder-operated delivery — we do not claim a customer-result library.',
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
    turnaround: 'Typically 5–10 business days after we have the target and the question.',
    proof: 'Same public evidence discipline as DeedSonar: sources kept, recommendation explicit, no invented confidence.',
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
    turnaround: 'Typically 2–3 weeks after we have the current process and the desired result.',
    proof: 'Same public pipeline as How it works: scoped action, documented handoff, a record of what ran.',
    price: '$1250',
    href: 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06',
    cta: 'Start the Sprint',
  },
] as const

export type PublicOfferId = (typeof PUBLIC_OFFERS)[number]['id']

export const OFFER_NEXT_STEPS = [
  {
    title: 'Checkout',
    body: 'Choose the offer that fits and complete the secure checkout.',
  },
  {
    title: 'Inputs',
    body: 'We email the checkout address within one business day to collect the inputs listed above.',
  },
  {
    title: 'Delivery',
    body: 'We complete the scoped work and deliver the result back to that address.',
  },
] as const

export const OFFER_BY_ID = Object.fromEntries(PUBLIC_OFFERS.map((offer) => [offer.id, offer])) as {
  [K in PublicOfferId]: (typeof PUBLIC_OFFERS)[number]
}
