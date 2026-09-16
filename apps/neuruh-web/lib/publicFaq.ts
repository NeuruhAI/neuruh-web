import { SITE_ORIGIN } from './publicSeo'

/**
 * FAQ / answerability surface (issue #10, Workstream 8). Every answer restates canon already on
 * this site — offers, boundaries, the proof method — and carries no figure of its own: numbers live
 * on /proof with their dates. The same list feeds the page and its FAQPage structured data.
 */
export const PUBLIC_FAQ = [
  {
    q: 'What does Neuruh do?',
    a: 'Neuruh builds AI systems that investigate, decide, act, and prove: information becomes evidence, evidence becomes an explicit decision, nothing acts without checked authority, and the work leaves a receipt.',
  },
  {
    q: 'What can I buy today?',
    a: 'Three fixed-scope offers with live checkout — Data Rescue, the Opportunity Intelligence Dossier, and the Workflow Replacement Sprint — and a Forensic System Audit that is scoped in a booked session first. Prices and terms are on the offers page.',
  },
  {
    q: 'Where do real-estate buyers start?',
    a: 'At re.neuruh.com, the real-estate front door: a free call, an Opportunity Scan, a Dossier, then custom scope.',
  },
  {
    q: 'Is anything on this site live?',
    a: 'No. Every figure is a dated re-read of a receipt, labeled VERIFIED SNAPSHOT, ATTESTED, or HISTORICAL on the proof ledger. No production system feeds this site.',
  },
  {
    q: 'Is delivery automated?',
    a: 'No. A live cashier is not automated fulfillment: a founder collects the inputs after checkout and delivers the scoped work by email.',
  },
  {
    q: 'Does Neuruh contact property owners or anyone else?',
    a: 'No. Outreach performed by anything Neuruh built is not claimed, and DeedSonar production cannot record contact permission until it is granted.',
  },
  {
    q: 'Does Neuruh claim autonomous AI?',
    a: 'Not in general. One bounded mission chain completed end to end under its own approvals and an independent court; review gates on that evidence are still open, and the site says so.',
  },
  {
    q: 'Does Neuruh publish customer results?',
    a: 'No. Client names, engagement figures, and case results are the clients’ facts to disclose, so they are not published here.',
  },
  {
    q: 'How can I check a figure?',
    a: 'Every figure on the proof ledger names its date, its evidence mode, and the receipt it came from. The compiled snapshot and its checksum are published alongside it.',
  },
] as const

export const PUBLIC_FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_ORIGIN}/faq#faq`,
  mainEntity: PUBLIC_FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
} as const
