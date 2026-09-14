/**
 * The four founder-delivered offers (commercial canon, 2026-09-14) and the Cal.com ladder.
 *
 * Boundaries, in substance, from canon:
 *   O01  Data Rescue                    messy data → recovered package
 *   O02  Opportunity Intelligence       question → source-backed dossier
 *   O05  Workflow Replacement           manual workflow → AI-assisted replaced flow
 *   FSA  Forensic System Audit          existing system → evidence-backed truth / state / gap / recovery report
 *
 * The three cashiers are the existing live Stripe payment links — never new ones.
 * The Forensic audit has no cashier: it is scoped in a 90-minute session booked on
 * Cal.com, whose booking terms are shown by Cal.com itself (see DECISIONS_NEEDED D-003).
 * No delivery time is promised anywhere: scope and timing are agreed at intake.
 * Every offer has exactly one primary action.
 */
export const PUBLIC_OFFERS = [
  {
    id: 'O01',
    kind: 'cashier',
    scope: 'Messy data → recovered package',
    name: 'Data Rescue',
    promise: 'Turn a broken, buried, or unusable set of files or records into something you can actually work with.',
    provide: 'The files, export, or records — plus what is wrong with them.',
    receive: 'A usable recovered or normalized package, plus a concise note on what changed and anything still missing.',
    proof: 'Live cashier on neuruh.com. Founder-operated delivery after intake — a live cashier is not automated fulfillment.',
    price: '$299',
    href: 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04',
    cta: 'Start Data Rescue',
  },
  {
    id: 'O02',
    kind: 'cashier',
    scope: 'Question → source-backed dossier',
    name: 'Opportunity Intelligence Dossier',
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
    kind: 'cashier',
    scope: 'Manual workflow → AI-assisted replaced flow',
    name: 'Workflow Replacement Sprint',
    promise: 'Replace one repetitive or chaotic manual process with a working, documented, AI-assisted flow.',
    provide: 'The current process, the tools involved, and the result you want.',
    receive: 'A scoped working workflow and the handoff needed to run it.',
    proof: 'Same public pipeline as How it works: scoped action, documented handoff. A live cashier is not automated fulfillment.',
    price: '$1250',
    href: 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06',
    cta: 'Start the Sprint',
  },
  {
    id: 'FSA',
    kind: 'booking',
    scope: 'Existing system → evidence-backed truth, state, gap, and recovery report',
    name: 'Forensic System Audit',
    promise: 'Bring a system you already run. Get an evidence-backed report of what is actually true about it, what state it is in, where the gaps are, and how to recover.',
    provide: 'Read access to the system as it runs today — code, data, receipts, or whatever it leaves behind — and the question you need settled.',
    receive: 'A forensic report: truth, state, gaps, and a recovery path, with every finding tied to the evidence that supports it.',
    proof: 'Scoped in a 90-minute session with the founder before the audit is agreed. Booking terms are shown by Cal.com at booking. No cashier on this site.',
    price: 'Scoped in a 90-minute session',
    href: 'https://cal.com/neuruh/forensic-scope-session-90',
    cta: 'Book the scoping session',
  },
] as const

export type PublicOffer = (typeof PUBLIC_OFFERS)[number]
export type PublicOfferId = PublicOffer['id']
export type CashierOfferId = 'O01' | 'O02' | 'O05'

export const CASHIER_OFFERS = PUBLIC_OFFERS.filter((offer) => offer.kind === 'cashier') as ReadonlyArray<Extract<PublicOffer, { kind: 'cashier' }>>

/**
 * Cal.com ladder (canon 2026-09-14): a free 10-minute qualifying call, plus paid
 * 15-, 30- and 60-minute tiers. The paid rates are not in canon and are therefore
 * not printed here — Cal.com shows the rate before any booking is confirmed
 * (see DECISIONS_NEEDED D-004).
 */
export const PUBLIC_CALLS = [
  { id: 'call-10', name: 'Qualifying call', length: '10 minutes', rate: 'Free', slug: 'quick-chat-10-mins', note: 'Decide together whether the work fits an offer, a custom engagement, or nothing at all.' },
  { id: 'call-15', name: 'Consulting call', length: '15 minutes', rate: 'Paid · book to see rate', slug: '15min', note: 'One narrow question, answered.' },
  { id: 'call-30', name: 'Strategy call', length: '30 minutes', rate: 'Paid · book to see rate', slug: '30-min-paid-consulting', note: 'A decision worked through with the evidence you bring.' },
  { id: 'call-60', name: 'Build strategy', length: '60 minutes', rate: 'Paid · book to see rate', slug: '1-hr-paid-consulting', note: 'The shape of a system or workflow before anyone builds it.' },
] as const

export const OFFER_NEXT_STEPS = [
  {
    title: 'Checkout or booking',
    body: 'Choose the offer that fits. The three cashiers check out on Stripe; the Forensic audit books a scoping session on Cal.com.',
  },
  {
    title: 'Inputs',
    body: 'A founder replies from jeramie@neuruh.com to the address you used at checkout or booking to collect the inputs listed above. Scope and timing are agreed in that reply — nothing is automated.',
  },
  {
    title: 'Delivery',
    body: 'A founder completes the scoped work and delivers the result back to that address. A live cashier is not automated fulfillment.',
  },
] as const

export const OFFER_BY_ID = Object.fromEntries(PUBLIC_OFFERS.map((offer) => [offer.id, offer])) as {
  [K in PublicOfferId]: Extract<PublicOffer, { id: K }>
}
