/**
 * Top 10 commercial product catalog.
 *
 * Truth rules (enforced by tests/top10-surfaces.test.mjs and the existing courts):
 * - The only checkout paths are the three existing cashiers in publicOffers.ts. A product
 *   with `offerId` links to that cashier and inherits its price; nothing else has a cashier.
 * - Every other price is FOUNDER_SET (a stated price with no cashier) or TEST pricing.
 * - `real` lists only capability with a dated receipt in this repository. `demo` states what
 *   the browser demonstration is and is not.
 * - Refusals apply (see /refusals): no published customer results, no usage counts, no automation claims.
 */
import type { PublicOfferId } from './publicOffers'

export type ProductMode = 'harness' | 'scan' | 'dossier' | 'acquisition' | 'rescue' | 'workflow' | 'proof' | 'managed' | 'resale'

export type PriceStatus = 'LIVE_CASHIER' | 'FOUNDER_SET_NO_CASHIER' | 'TEST_PRICING'

export type RungStatus = 'PROVEN_LIVE' | 'IMPLEMENTED_NOT_LIVE' | 'IMPLEMENTED_INCOMPLETE' | 'BLOCKED' | 'HISTORICAL' | 'UNKNOWN'

export type Category =
  | 'AI / System Integrity'
  | 'Real Estate Intelligence'
  | 'Business Acquisition'
  | 'Data / Workflow'
  | 'Executive / Transformation'
  | 'Operator / Ongoing Intelligence'

/** Plain-language descriptor per category, for buyers who do not know Neuruh. */
export const CATEGORY_BLURB: Record<Category, string> = {
  'AI / System Integrity': 'For teams that run AI agents or inherited automation and need proof of what it does.',
  'Real Estate Intelligence': 'For land and property buyers who need evidence on one parcel or one deal.',
  'Business Acquisition': 'For searchers and investors looking for businesses worth buying.',
  'Data / Workflow': 'For operations teams with messy files or one process that eats the week.',
  'Executive / Transformation': 'For leaders deciding where AI actually changes the business.',
  'Operator / Ongoing Intelligence': 'For operators who need opportunities found and priced continuously.',
}

export const CATEGORIES: Category[] = [
  'AI / System Integrity',
  'Real Estate Intelligence',
  'Business Acquisition',
  'Data / Workflow',
  'Executive / Transformation',
  'Operator / Ongoing Intelligence',
]

export const LADDER = ['Product', 'Offer', 'Checkout / quote', 'Intake', 'Fulfillment', 'Delivery', 'Receipt', 'Outcome'] as const
export type LadderRung = (typeof LADDER)[number]

export type Top10Product = {
  rank: number
  slug: string
  name: string
  category: Category
  status: string
  /** One-sentence outcome in buyer language. */
  outcome: string
  price: string
  priceStatus: PriceStatus
  offerId?: PublicOfferId
  audience: string
  problem: string
  promise: string
  whatItDoes: string[]
  inputs: string[]
  workflow: string[]
  deliverables: string[]
  delivery: string
  turnaround: string
  useCases: string[]
  real: string[]
  demo: string
  proof: string[]
  ladder: Record<LadderRung, RungStatus>
  /** Illustrative scenario. Never a customer result; labeled as such on the page. */
  example: string
  related: { slug: string; why: string }
  nextStep: string
  ctaLabel: string
  mode: ProductMode
}

const FOUNDER_DELIVERY = 'Email to the address you check out or write in from. Human-readable report (PDF or Markdown) plus a machine-readable receipt (JSON) naming inputs, sources, and unknowns. Founder-operated: a live cashier is not automated fulfillment.'
const QUOTE_DELIVERY = 'Scoped by written quote first. Delivered by email as a human-readable report plus a machine-readable receipt naming inputs, sources, and unknowns. Founder-operated.'

const QUOTE_LADDER: Record<LadderRung, RungStatus> = {
  Product: 'IMPLEMENTED_NOT_LIVE',
  Offer: 'IMPLEMENTED_NOT_LIVE',
  'Checkout / quote': 'IMPLEMENTED_NOT_LIVE',
  Intake: 'IMPLEMENTED_NOT_LIVE',
  Fulfillment: 'IMPLEMENTED_INCOMPLETE',
  Delivery: 'IMPLEMENTED_INCOMPLETE',
  Receipt: 'IMPLEMENTED_INCOMPLETE',
  Outcome: 'UNKNOWN',
}

const CASHIER_LADDER: Record<LadderRung, RungStatus> = {
  Product: 'PROVEN_LIVE',
  Offer: 'PROVEN_LIVE',
  'Checkout / quote': 'PROVEN_LIVE',
  Intake: 'IMPLEMENTED_NOT_LIVE',
  Fulfillment: 'IMPLEMENTED_INCOMPLETE',
  Delivery: 'IMPLEMENTED_INCOMPLETE',
  Receipt: 'IMPLEMENTED_INCOMPLETE',
  Outcome: 'UNKNOWN',
}

export const TOP10: Top10Product[] = [
  {
    rank: 1,
    slug: 'agent-integrity',
    name: 'Agent Integrity Suite',
    category: 'AI / System Integrity',
    status: 'SERVICE-FIRST · QUOTE',
    outcome: 'Know, with evidence, whether the agent you are about to ship still does only what you authorized.',
    price: '$2,500 pilot · $1,500–$5,000/mo after proof',
    priceStatus: 'TEST_PRICING',
    audience: 'AI startups, agencies, internal AI teams, and operating partners shipping agents into real workflows.',
    problem: 'An agent can look like it works while nobody can prove what it did, what it was allowed to do, whether it regressed since the last release, or whether the evidence it cites is real.',
    promise: 'Prove an agent did what it was allowed to do, produced the evidence it claimed, and stayed inside its boundary — with a receipt you can hand to a customer.',
    whatItDoes: ['Baseline-first release regression harness', 'Golden, held-out, and adversarial case runs', 'Authority and permission-boundary checks', 'Evidence and citation checks', 'Decision plus signed receipt'],
    inputs: ['One workflow the agent runs today, with its allowed actions written down', 'Access to a release candidate and the previous baseline (or we capture one)', 'Five to twenty real cases you consider correct, and any known failures', 'The person who can say “promote” or “reject”'],
    workflow: ['Intake and scope one workflow', 'Capture the baseline', 'Write golden, held-out, and adversarial cases', 'Run candidate against baseline', 'Report delta, regressions, authority and evidence checks', 'Issue PASS / SHADOW / MORE_EVIDENCE / REJECT with a receipt'],
    deliverables: ['Workflow map and authority boundary', 'Baseline snapshot', 'Test corpus (golden, held-out, adversarial)', 'Failure and regression report', 'Acceptance or release receipt', 'Remediation queue'],
    delivery: QUOTE_DELIVERY,
    turnaround: 'Pilot target: 7 business days from intake to receipt for one workflow. Stated as a target, not a measured average.',
    useCases: ['Pre-deploy agent release gate', 'Customer acceptance testing for an AI vendor', 'Due diligence on an agent you are about to buy', 'Regulated workflow evidence packet', 'White-label assurance for an agency’s clients'],
    real: ['Neuruh gates its own releases with these harnesses: this site’s release court records 0 broken links and 0 serious or critical accessibility violations at the shipped SHA.', 'DeedSonar production truth was re-read on 2026-09-16 and every production alias served the same commit as repository main; the 2026-08-23 court of 1,510 green tests is kept as HISTORICAL on /proof.', 'The harness repositories are private and internal. They are not externally callable today; a pilot is run by a founder against your workflow.'],
    demo: 'The browser demonstration on this page runs a small set of structural checks on text you paste. It illustrates the stages and the shape of a receipt. It is not a production assurance result and it does not touch your systems.',
    proof: ['Release court for neuruh.com — see /proof (broken links, accessibility, dated).', 'DeedSonar production truth re-read 2026-09-16 (on /proof); the 2026-08-23 court at e2b71fa is HISTORICAL, receipt vendored in-repo.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: QUOTE_LADDER,
    example: 'A team ships a support agent allowed to issue refunds up to $50. The pilot baselines twelve real tickets, adds six held-out and five adversarial cases (a $500 request, an “ignore your limits” injection), runs the new build, and reports one regression: it issued a $75 refund. Decision: REJECT, with the failing case and the diff in the receipt.',
    related: { slug: 'ai-estate-forensic', why: 'If you do not yet know which of your agents is canonical, start with the estate audit.' },
    nextStep: 'Request a 7-day assurance pilot against one real workflow. Scope and quote come back by email.',
    ctaLabel: 'Request a harness pilot',
    mode: 'harness',
  },
  {
    rank: 2,
    slug: 'ai-estate-forensic',
    name: 'AI Estate Forensic',
    category: 'AI / System Integrity',
    status: 'PRODUCTIZED SERVICE · QUOTE',
    outcome: 'Know what you already own, what actually works, and what to ship next before spending another dollar on AI.',
    price: '$2,500–$7,500 per estate audit',
    priceStatus: 'TEST_PRICING',
    audience: 'Founders with agent sprawl, teams with inherited automation, operating partners doing technical diligence.',
    problem: 'Expensive AI estates accumulate stale branches, duplicated capability, silent authority assumptions, abandoned work, and “it works” claims with no proof.',
    promise: 'Turn a messy AI estate into an evidence-backed inventory of what exists, what works, what is stranded, and what should ship next.',
    whatItDoes: ['Repository, branch, and lineage census', 'Harness and test inventory', 'Runtime and authority mapping', 'Canonical-versus-historical separation', 'Ship / kill / hold decisions with evidence'],
    inputs: ['Read access to the repositories and hosting accounts in scope', 'A list of what you believe is live, and what you are paying for', 'The decisions you need to make in the next 90 days'],
    workflow: ['Collect the estate graph', 'Separate canonical from historical', 'Run the proof harnesses that exist', 'Trace execution and authority paths', 'Score commercial readiness', 'Issue the recovery plan'],
    deliverables: ['Estate map', 'Stranded-asset register', 'Harness and test register', 'Runtime and authority map', 'Ship / kill / hold queue', '90-day commercialization queue'],
    delivery: QUOTE_DELIVERY,
    turnaround: 'Target: 2–3 weeks for an estate of up to ~20 repositories. Stated as a target, not a measured average.',
    useCases: ['Startup rescue after an agency handoff', 'Technical diligence before an acquisition', 'Consolidating three “AI systems” into one canonical one', 'Founder handoff or team turnover', 'Cost blowout on an AI stack'],
    real: ['This method is how Neuruh runs its own estate: the Top 10 layer on this site was itself recovered from a remote branch, classified, and re-verified with a dated recovery court (docs/commercial in the public repository history).', 'The public truth system on this site compiles every number from dated receipts and fails closed on contradiction.'],
    demo: 'The browser demonstration runs structural checks on a pasted artifact to show what an evidence check looks like. It does not inspect any repository.',
    proof: ['Neuruh public-truth compiler and courts — see /proof and /proof/distribution.', 'Organism convergence attestation (2026-09-16): one bounded mission chain completed end to end, and what stays unclaimed.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: QUOTE_LADDER,
    example: 'A founder has three agencies’ worth of automation across fourteen repositories. The audit finds five canonical systems, six stale forks of the same idea, two with passing tests, and one quietly writing to production. The recovery map ships two, freezes three, and kills nine, with the evidence for each call.',
    related: { slug: 'agent-integrity', why: 'Once the canonical systems are named, put a harness on the one that matters most.' },
    nextStep: 'Request a fixed-scope estate audit. Neuruh’s own estate is the reference case.',
    ctaLabel: 'Request an estate audit',
    mode: 'harness',
  },
  {
    rank: 3,
    slug: 'property-opportunity-scan',
    name: 'Property Opportunity Scan',
    category: 'Real Estate Intelligence',
    status: 'PRICED · INTAKE BY EMAIL · NO CHECKOUT YET',
    outcome: 'Know whether one parcel deserves your next hour and your next dollar.',
    price: '$100 per property',
    priceStatus: 'FOUNDER_SET_NO_CASHIER',
    audience: 'Land investors, wholesalers, small developers, brokers, and lenders with one parcel in front of them.',
    problem: 'A lead list does not tell you whether this parcel deserves underwriting. You need the signals, the risks, and the unknowns before you spend more time or money.',
    promise: 'Take one property or parcel and expose the signals that decide whether it deserves deeper underwriting — with the evidence and the unknowns listed.',
    whatItDoes: ['Property identity and ownership review from public records', 'Multi-signal opportunity check', 'Physical and access risk flags (flood, access, parcel shape)', 'Fit against the opportunity patterns DeedSonar runs in production', 'Evidence-backed next step'],
    inputs: ['One parcel: address or parcel number, county and state', 'What you buy and why (hold, flip, develop, lend)', 'Anything you already know that we should not repeat'],
    workflow: ['Intake the property', 'Resolve identity in county records', 'Pull evidence', 'Run opportunity checks', 'Rank unknowns', 'Return the scan'],
    deliverables: ['Opportunity scorecard', 'Evidence links', 'Risk flags', 'Missing-evidence list', 'Recommendation: advance, hold, or kill — with the reason'],
    delivery: 'Email to the address you write in from. One-page scorecard (PDF or Markdown) plus a JSON receipt naming sources and unknowns. Founder-operated. No owner contact data, no skip-trace, no dialing.',
    turnaround: 'Target: 2 business days from receiving the parcel. Stated as a target, not a measured average.',
    useCases: ['Deal screening before an offer', 'Absentee or estate-owned parcels', 'Rural land with access or flood questions', 'Portfolio triage', 'Pre-offer diligence for a lender'],
    real: ['DeedSonar runs in production: on 2026-09-16 its current estate, qualification and contact authority were re-read read-only and published with their dates on /proof.', 'A read-only production tape on 2026-09-16 ran the product’s own top opportunity through 10 of 15 steps (property, identity, signals, score, evidence, qualification) and stopped at a human research step. That tape is the capability this scan sells.', 'neuruh.com has no checkout for this product: ordering here is by email and the $100 price is founder-set. The real-estate front door, re.neuruh.com, sells a $100 Opportunity Scan with its own checkout.'],
    demo: 'The browser calculator on this page is a bounded scoring illustration. The real scan runs against county evidence in the DeedSonar production system, not in your browser.',
    proof: ['DeedSonar production truth re-read 2026-09-16 (on /proof); the 2026-08-23 court at e2b71fa is HISTORICAL.', 'DeedSonar production truth attestation (2026-09-16): 10 of 15 steps reachable, blocked at a human step, contact authority zero, no outreach performed.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: {
      Product: 'PROVEN_LIVE',
      Offer: 'IMPLEMENTED_NOT_LIVE',
      'Checkout / quote': 'BLOCKED',
      Intake: 'IMPLEMENTED_NOT_LIVE',
      Fulfillment: 'IMPLEMENTED_INCOMPLETE',
      Delivery: 'IMPLEMENTED_INCOMPLETE',
      Receipt: 'IMPLEMENTED_INCOMPLETE',
      Outcome: 'UNKNOWN',
    },
    example: 'A twelve-acre rural parcel with an out-of-state owner. The scan confirms parcel identity in county records, flags a floodway crossing the road frontage, finds no probate or tax-sale signal, and recommends HOLD: cheap to watch, expensive to develop, with the two missing documents named.',
    related: { slug: 'opportunity-intelligence-dossier', why: 'When a scan says ADVANCE, the dossier is the decision package for the offer.' },
    nextStep: 'Send one parcel by email. You get a scope confirmation and a payment request back before any work starts.',
    ctaLabel: 'Order a $100 scan by email',
    mode: 'scan',
  },
  {
    rank: 4,
    slug: 'opportunity-intelligence-dossier',
    name: 'Opportunity Intelligence Dossier',
    category: 'Real Estate Intelligence',
    status: 'LIVE CASHIER · FOUNDER-FULFILLED',
    outcome: 'One decision-grade brief on the property, company, or market you are about to commit to.',
    price: '$499',
    priceStatus: 'LIVE_CASHIER',
    offerId: 'O02',
    audience: 'Serious buyers who need a decision package on one property, company, market, or opportunity — not another lead list.',
    problem: 'Decision makers need a defensible package: what the evidence says, what the risks are, what is unknown, and what to do next.',
    promise: 'Convert one opportunity into a decision-grade dossier with sources, risks, unknowns, and an action path.',
    whatItDoes: ['Deep property or target research', 'Ownership, entity, and relationship analysis', 'Signal fusion across public sources', 'Missing-evidence analysis', 'Underwriting memo and recommendation'],
    inputs: ['The target (property, company, market, or opportunity)', 'The decision or question you need answered', 'Your buy box or constraints'],
    workflow: ['Define the buy box', 'Resolve entities', 'Fuse signals', 'Underwrite', 'Attach evidence', 'Render the decision package'],
    deliverables: ['Executive decision page', 'Underwriting', 'Evidence list with sources', 'Risk register', 'Next-action plan'],
    delivery: FOUNDER_DELIVERY,
    turnaround: 'Typically 5–10 business days after we have the target and the question.',
    useCases: ['Acquisition target under contract', 'Farm or rural land', 'Estate property with unclear ownership', 'High-friction parcel', 'Investor diligence'],
    real: ['This is the existing Opportunity Dossier offer (O02) on /offers with a live Stripe checkout.', 'Fulfillment is founder-operated: this site has no payment webhook. After checkout, a founder collects the inputs by email.', 'The research method is the same evidence discipline DeedSonar runs in production.'],
    demo: 'The browser calculator illustrates evidence-readiness triage. The real dossier is researched and written by a founder against sources.',
    proof: ['Live cashier verified by the checkout-link court on every build.', 'DeedSonar production truth re-read 2026-09-16 (on /proof); the 2026-08-23 court at e2b71fa is HISTORICAL.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: CASHIER_LADDER,
    example: 'A disused feed mill on six acres. The dossier resolves the owning entity and its two related companies, confirms the rail siding is inactive from the carrier’s public abandonment filing, prices the conversion risk, and recommends an offer range with the single biggest risk named.',
    related: { slug: 'property-opportunity-scan', why: 'Not sure the target is worth a dossier yet? A $100 scan answers that first.' },
    nextStep: 'Order the dossier. The receipt goes to your checkout address and a founder follows up for inputs.',
    ctaLabel: 'Order the Dossier — $499',
    mode: 'dossier',
  },
  {
    rank: 5,
    slug: 'business-acquisition-intelligence',
    name: 'Business Acquisition Intelligence',
    category: 'Business Acquisition',
    status: 'PRODUCTIZATION TARGET · QUOTE',
    outcome: 'A short list of businesses worth investigating, with the owner, property, and risk angles exposed before you commit capital.',
    price: '$750 screen · $2,500 dossier · custom buy-side mandate',
    priceStatus: 'TEST_PRICING',
    audience: 'Searchers, independent sponsors, family offices, and private buyers of small businesses.',
    problem: 'Finding businesses worth investigating, and understanding the owner, succession, and real-estate angles before capital is committed.',
    promise: 'Find businesses worth investigating, explain why, and expose the operational and real-estate angles before you commit capital.',
    whatItDoes: ['Buyability screening', 'Business-to-property linkage', 'Owner and succession signals', 'Operational red flags from public sources', 'Acquisition thesis and diligence queue'],
    inputs: ['Your acquisition box: vertical, geography, size', 'Any target list you already have', 'What would make you walk away'],
    workflow: ['Define the acquisition box', 'Find candidates', 'Resolve principals and property', 'Fuse public signals', 'Score buyability', 'Produce the diligence queue'],
    deliverables: ['Target shortlist', 'Buyability score with reasons', 'Real-estate exposure per target', 'Signal list with sources', 'Diligence plan'],
    delivery: QUOTE_DELIVERY,
    turnaround: 'Target: 5 business days for a screen of up to ten targets. Stated as a target, not a measured average.',
    useCases: ['Small business acquisition search', 'Owner retirement and succession', 'Operating business tied to commercial real estate', 'Distressed operator search', 'Buy-and-build sourcing'],
    real: ['The entity, ownership, and property-linkage method exists in the DeedSonar lineage and is applied here to businesses instead of parcels.', 'Client engagements are not published here. Of the ten, this is the least proven on public evidence.'],
    demo: 'The browser calculator is a screening toy, not a valuation. Paid work uses public evidence, entity and property linkage, and explicit unknowns.',
    proof: ['Method lineage: DeedSonar, production truth re-read 2026-09-16 (on /proof).', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: QUOTE_LADDER,
    example: 'Ten HVAC contractors across two counties. The screen links six to owner-occupied commercial property, flags two owners past retirement age with no visible successor, and ranks a shortlist of three with the diligence questions for each.',
    related: { slug: 'opportunity-intelligence-dossier', why: 'Take the top target from the screen into a full dossier.' },
    nextStep: 'Request a ten-target screen in one vertical and one geography.',
    ctaLabel: 'Request a buyability screen',
    mode: 'acquisition',
  },
  {
    rank: 6,
    slug: 'data-rescue',
    name: 'Data Rescue',
    category: 'Data / Workflow',
    status: 'LIVE CASHIER · FOUNDER-FULFILLED',
    outcome: 'A clean, usable dataset from the files your team keeps fighting, with exceptions and provenance made explicit.',
    price: '$299 starter · custom for volume',
    priceStatus: 'LIVE_CASHIER',
    offerId: 'O01',
    audience: 'Operations teams fighting CSVs, spreadsheets, exports, and inconsistent public data.',
    problem: 'The files your team keeps fighting: duplicates, broken exports, inconsistent fields, records nobody trusts.',
    promise: 'Send the files. Get back a clean operating dataset with exceptions and provenance made explicit.',
    whatItDoes: ['Preflight and intake', 'Normalization', 'Exception detection', 'Provenance tracking', 'Structured delivery with a receipt'],
    inputs: ['The files, export, or records', 'What is wrong with them, in your words', 'What “usable” means for you'],
    workflow: ['Upload', 'Preflight', 'Classify', 'Normalize', 'Validate', 'Deliver'],
    deliverables: ['Clean dataset', 'Exception report', 'Field map', 'Provenance notes', 'Machine-readable receipt'],
    delivery: FOUNDER_DELIVERY,
    turnaround: 'Typically 2–5 business days after we have your inputs.',
    useCases: ['CRM cleanup', 'Acquisition data room', 'County or public data', 'Legacy migration', 'Spreadsheet consolidation'],
    real: ['This is the existing Data Rescue offer (O01) on /offers with a live Stripe checkout.', 'Fulfillment is founder-operated: this site has no payment webhook. A founder collects the inputs by email after checkout.'],
    demo: 'The browser calculator shows the arithmetic of cleanable rows. The delivered product is the normalized dataset, exception report, provenance, and receipt.',
    proof: ['Live cashier verified by the checkout-link court on every build; listed as LIVE CASHIER on /proof.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: CASHIER_LADDER,
    example: 'Three CRM exports and a spreadsheet: nine thousand rows, four phone formats. The rescue returns the normalized records, the duplicate groups, the exceptions with reasons, a field dictionary, and a receipt naming every source file by digest.',
    related: { slug: 'workflow-replacement', why: 'If the same mess comes back every month, replace the workflow that produces it.' },
    nextStep: 'Start Data Rescue. Inputs are collected by email after checkout.',
    ctaLabel: 'Start Data Rescue — $299',
    mode: 'rescue',
  },
  {
    rank: 7,
    slug: 'workflow-replacement',
    name: 'Workflow Replacement Sprint',
    category: 'Data / Workflow',
    status: 'LIVE CASHIER · FOUNDER-FULFILLED',
    outcome: 'One painful manual workflow replaced with a bounded, measured, documented process.',
    price: '$1,250 starter · $3,500+ complex',
    priceStatus: 'LIVE_CASHIER',
    offerId: 'O05',
    audience: 'Local businesses and teams with one manual, brittle, repetitive process.',
    problem: 'One painful workflow eats hours every week and adding a chatbot did not fix it.',
    promise: 'Replace one painful workflow with a bounded, measurable, documented operating process — not another chatbot.',
    whatItDoes: ['Map the current workflow', 'Find the high-cost manual steps', 'Design bounded automation', 'Install verification', 'Measure the before and after'],
    inputs: ['The current process, the tools involved, and who runs it', 'The result you want', 'A before-number you will accept as the baseline'],
    workflow: ['Current-state map', 'Economic baseline', 'Replacement design', 'Implementation', 'Verification', 'Outcome capture'],
    deliverables: ['Workflow map', 'Replacement spec', 'Implemented slice', 'Verification checks', 'Operating handoff'],
    delivery: FOUNDER_DELIVERY,
    turnaround: 'Typically 2–3 weeks after we have the current process and the desired result.',
    useCases: ['Lead intake', 'Scheduling', 'CRM updates', 'Estimating', 'Document processing', 'Dispatch coordination'],
    real: ['This is the existing Workflow Sprint offer (O05) on /offers with a live Stripe checkout at the $1,250 starter price. Complex scopes are quoted.', 'Fulfillment is founder-operated: this site has no payment webhook.'],
    demo: 'The browser calculator establishes a labor-exposure baseline from your own numbers. The sprint is sold against one measurable replacement outcome.',
    proof: ['Live cashier verified by the checkout-link court on every build.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: CASHIER_LADDER,
    example: 'Lead intake by phone and sticky notes. The sprint maps the eleven steps, baselines the weekly hours, installs a structured intake with validation and a daily digest, and hands over the checks that show whether the new process is holding.',
    related: { slug: 'data-rescue', why: 'Start smaller: rescue the data the workflow produces before replacing the workflow.' },
    nextStep: 'Start the sprint at the $1,250 starter scope, or request a quote for a complex workflow.',
    ctaLabel: 'Start the Sprint — $1,250',
    mode: 'workflow',
  },
  {
    rank: 8,
    slug: 'proofos',
    name: 'ProofOS / Future-State Twin',
    category: 'Executive / Transformation',
    status: 'SEALED CANDIDATE · QUOTE',
    outcome: 'A current-state model and a future-state twin of your company, with every claim labeled by how well it is known.',
    price: '$2,500 diagnostic · $7,500+ transformation plan',
    priceStatus: 'TEST_PRICING',
    audience: 'Executives, operating partners, consultancies, and buyers of AI transformation work.',
    problem: 'Transformation decisions get made on slideware. Nobody separates what is fact, what is derived, what is a hypothesis, and what is unknown.',
    promise: 'Convert evidence about a company into a current-state model, a future-state twin, a value case, and a proof experience — with every claim labeled by its evidence class.',
    whatItDoes: ['Evidence intake', 'Current-state account twin', 'Capability match', 'Future-state model', 'Value model', 'Reverse demo (proof experience)'],
    inputs: ['Documents and data about the company or unit in scope', 'The transformation question', 'Who has to be convinced, and of what'],
    workflow: ['Evidence', 'State model', 'Gap map', 'Future-state twin', 'Value model', 'Proof experience'],
    deliverables: ['Current-state twin', 'Transformation map', 'Assumption studio', 'Value model', 'Buyer proof pack'],
    delivery: QUOTE_DELIVERY,
    turnaround: 'Target: 2 weeks for a diagnostic. Stated as a target, not a measured average.',
    useCases: ['AI transformation planning', 'Diligence on an operating company', 'Enterprise modernization', 'Operating model redesign'],
    real: ['ProofOS is a sealed, court-tested candidate: 14 court receipts are vendored in this repository and listed on /proof.', 'It distinguishes FACT, DERIVED, HYPOTHESIS, UNKNOWN, and CONFLICTED claims by contract.', 'It is not a self-serve platform. A diagnostic is run by a founder using it.'],
    demo: 'The browser calculator shows the arithmetic of decision-ready evidence units. The real twin classifies each claim by evidence class.',
    proof: ['ProofOS court receipts, 14 courts — vendored in-repo (docs/receipts-external/proofos-courts).', 'Listed as SEALED CANDIDATE on /products.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: QUOTE_LADDER,
    example: 'A regional distributor weighing AI in order entry. The diagnostic separates fourteen facts from their own data, nine derived estimates, four hypotheses, and three unknowns, builds the future-state twin, and shows which two unknowns decide whether the value case holds.',
    related: { slug: 'ai-estate-forensic', why: 'If the question is about an AI estate you already run, the forensic audit comes first.' },
    nextStep: 'Request a diagnostic. ProofOS is used to close an estate audit or workflow sprint before it is sold standalone.',
    ctaLabel: 'Request a ProofOS diagnostic',
    mode: 'proof',
  },
  {
    rank: 9,
    slug: 'managed-opportunity-desk',
    name: 'Managed Opportunity Desk',
    category: 'Operator / Ongoing Intelligence',
    status: 'MANUAL-FIRST RECURRING · QUOTE',
    outcome: 'A standing desk that keeps finding, scoring, and explaining opportunities against your buy box every week.',
    price: '$1,500–$5,000 per month',
    priceStatus: 'TEST_PRICING',
    audience: 'Investors and operators who need opportunities found, scored, explained, and routed against a real buy box every week.',
    problem: 'One-off research does not compound. You need a standing desk that keeps finding and triaging opportunities against your box.',
    promise: 'A standing intelligence desk that continuously finds, scores, explains, and routes opportunities against a real buy box — with a decision record for each.',
    whatItDoes: ['Recurring discovery', 'Signal fusion', 'Prioritization', 'Research queue', 'Decision receipts and outcome tracking'],
    inputs: ['Your buy box, in writing', 'Markets and asset types in scope', 'Who decides, and how fast'],
    workflow: ['Buy box', 'Continuous discovery', 'Rank', 'Underwrite', 'Escalate', 'Track outcome'],
    deliverables: ['Weekly opportunity book', 'Top targets with reasons', 'Research notes', 'Decision record', 'Outcome tracker'],
    delivery: 'Weekly email delivery of the opportunity book (PDF or Markdown) plus a machine-readable decision record. Founder-operated desk; recurring billing is set up by quote, not on this site.',
    turnaround: 'Weekly cadence after onboarding. Onboarding target: 1 week.',
    useCases: ['Land acquisition program', 'Small business acquisition search', 'Distress and transition watch', 'Portfolio intelligence'],
    real: ['The discovery, ranking, and evidence method is what DeedSonar runs in production for land opportunities.', 'The desk is offered only after a scan or dossier has produced a real buyer outcome. None has yet, so this is not for sale today.'],
    demo: 'The browser calculator shows recurring-revenue arithmetic for the desk itself. It is not a forecast of your outcomes.',
    proof: ['DeedSonar production truth re-read 2026-09-16 (on /proof); the 2026-08-23 court at e2b71fa is HISTORICAL.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: { ...QUOTE_LADDER, Offer: 'BLOCKED', 'Checkout / quote': 'BLOCKED' },
    example: 'A land buyer with a two-county box. Each week: forty candidates reviewed, five escalated with evidence, one recommended for an offer, and a decision record for all forty so nothing is re-reviewed.',
    related: { slug: 'property-opportunity-scan', why: 'The desk follows a real outcome. Begin with one scan or one dossier.' },
    nextStep: 'Start with a $499 dossier or a $100 scan. The desk follows a real outcome.',
    ctaLabel: 'Start with a dossier or scan',
    mode: 'managed',
  },
  {
    rank: 10,
    slug: 'findsellprofit',
    name: 'FindSellProfit',
    category: 'Operator / Ongoing Intelligence',
    status: 'SEALED CANDIDATE · QUOTE',
    outcome: 'Know what an item or lot is worth, what to pay, and how to exit before cash is trapped.',
    price: '$299–$1,000+ operator stack',
    priceStatus: 'TEST_PRICING',
    audience: 'Resellers, flippers, liquidation buyers, and marketplace operators.',
    problem: 'Cash gets trapped in inventory bought on a guess. You need to know what it is, what it is worth, what to pay, and how you exit before you buy.',
    promise: 'Know what an item or lot is, what it is worth, what you should pay, and how you should exit — before cash is trapped.',
    whatItDoes: ['Item identification', 'Evidence-backed valuation', 'Maximum-buy calculation', 'Disposition selection', 'Lot economics'],
    inputs: ['Photos, a URL, or a UPC per item — or a lot manifest', 'Your fees, shipping, and margin target', 'Where you sell today'],
    workflow: ['Photo / URL / UPC', 'Identify', 'Value', 'Buy ceiling', 'Disposition', 'Outcome'],
    deliverables: ['Buy decision', 'Economics sheet', 'Comparable evidence', 'Disposition plan', 'Operator receipt'],
    delivery: QUOTE_DELIVERY,
    turnaround: 'Target: 2 business days for a lot of up to 50 items. Stated as a target, not a measured average.',
    useCases: ['Thrift sourcing', 'Estate cleanouts', 'Liquidation lots', 'Cards and collectibles', 'Local resale'],
    real: ['FindSellProfit is a sealed candidate with custody and court receipts vendored in this repository: 229 of 229 tests at the receipted commit.', 'It is not a public app today. An operator engagement is run by a founder using it.'],
    demo: 'The browser calculator computes a buy ceiling from your own numbers. The real product binds valuation evidence, buy ceiling, disposition, and receipt.',
    proof: ['FindSellProfit custody and court receipts, 229/229 tests — vendored in-repo (docs/receipts-external/findsellprofit).', 'Listed as SEALED CANDIDATE on /products.', 'Client engagements are not published here; what Neuruh does not claim is listed on /refusals.'],
    ladder: QUOTE_LADDER,
    example: 'A forty-item estate lot. The engagement identifies thirty-four items with comparables, sets a buy ceiling per item and for the lot, flags six with no reliable comparables, and recommends the exit channel per item.',
    related: { slug: 'opportunity-intelligence-dossier', why: 'Same evidence discipline, applied to property instead of inventory.' },
    nextStep: 'Request an operator engagement for one narrow category.',
    ctaLabel: 'Request an operator engagement',
    mode: 'resale',
  },
]

export const TOP10_SLUGS = TOP10.map((p) => p.slug)

export function getTop10(slug: string) {
  return TOP10.find((item) => item.slug === slug)
}

export function productsIn(category: Category) {
  return TOP10.filter((p) => p.category === category)
}

/** Products without a cashier route to the contact intake, which carries the product selection into the email. */
export function contactHref(p: Top10Product) {
  return `/contact?product=${p.slug}`
}

export const PRICE_STATUS_LABEL: Record<PriceStatus, string> = {
  LIVE_CASHIER: 'Live checkout · founder-fulfilled',
  FOUNDER_SET_NO_CASHIER: 'Founder-set price · no checkout yet · order by email',
  TEST_PRICING: 'Test commercial pricing · quoted · not market-verified',
}
