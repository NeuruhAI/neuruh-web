import type { PublicOfferId } from './publicOffers'
import type { ProofRef } from './publicProofFacts'

/**
 * Discovery cluster (issue #10, Workstream 8): real failure modes, not doorway pages.
 * Each page walks failure → why conventional tools fail → evidence needed → Neuruh capability →
 * proof → boundary → one action. Proof is a reference into the compiled snapshot, never a literal;
 * the action is an existing offer (or the real-estate front door), never a new price.
 */
export type PublicProblem = {
  slug: string
  title: string
  description: string
  failure: string
  whyToolsFail: string[]
  evidenceNeeded: string[]
  capability: string
  proof: ProofRef
  proofClaim: string
  boundary: string
  offerId: PublicOfferId
  frontDoor?: 're'
}

export const PUBLIC_PROBLEMS: readonly PublicProblem[] = [
  {
    slug: 'data-you-cannot-use',
    title: 'Data you cannot use',
    description: 'Exports, spreadsheets, and records that exist but cannot be trusted or worked with — and what it takes to recover them with the trail intact.',
    failure: 'The information exists — exports, spreadsheets, scans, old CRM dumps — but nobody can work with it. Columns disagree, duplicates hide each other, and every attempt to clean it quietly loses something.',
    whyToolsFail: [
      'Cleanup tools fix formats, not meaning: two spellings of one owner stay two owners.',
      'A one-off script leaves no record of what it changed, so nobody can trust the output.',
      'Chat assistants rewrite rows plausibly, which is worse than leaving them broken.',
    ],
    evidenceNeeded: ['The original files, untouched', 'A statement of what is wrong and what the data is for', 'A record of every change, and of what could not be recovered'],
    capability: 'Neuruh recovers the package and keeps the trail: what changed, why, and what is still missing, so the result can be checked instead of believed.',
    proof: { object: 'deedsonar', metric: 'current_estate_properties' },
    proofClaim: 'The same discipline holds a production property estate together from messy county publications.',
    boundary: 'No data is enriched from paid people-search sources, and nothing is published or contacted. Recovery is founder-delivered after intake, not automated.',
    offerId: 'O01',
  },
  {
    slug: 'ai-you-cannot-verify',
    title: 'AI you cannot verify',
    description: 'AI output that sounds right but cannot be checked — and the evidence an answer needs before anyone should act on it.',
    failure: 'An AI system produces answers, summaries, or actions that sound right. When one is wrong, nobody can say which input it came from or whether anything checked it before it was used.',
    whyToolsFail: [
      'Confidence scores are not evidence; they describe the model, not the world.',
      'Logs record that something ran, not whether its claim was true.',
      'Review by the same system that produced the output is not independent.',
    ],
    evidenceNeeded: ['The inputs the answer depended on', 'An independent check that can refuse', 'A receipt that binds the answer to what checked it'],
    capability: 'Neuruh systems separate producing a result from judging it: an independent court can refuse, and whatever passes leaves a receipt tied to its evidence.',
    proof: { object: 'governed-execution-loop', metric: 'missions_completed_end_to_end' },
    proofClaim: 'Missions completed end to end through their own approvals and an independent court, with review gates still open and stated.',
    boundary: 'General autonomous execution is not claimed. An audit of your system reports what is true about it; it does not certify it.',
    offerId: 'FSA',
  },
  {
    slug: 'workflows-that-break',
    title: 'Workflows that break',
    description: 'Manual processes held together by one person and a spreadsheet — and how to replace one without losing what it quietly did.',
    failure: 'A process works because one person remembers the steps. It breaks when they are out, when a file format changes, or when volume doubles — and nobody notices until a customer does.',
    whyToolsFail: [
      'Automation platforms copy the steps, including the broken ones.',
      'Nobody wrote down the exceptions, so the new flow silently drops them.',
      'Without a check at the end, a failed run looks the same as a successful one.',
    ],
    evidenceNeeded: ['The process as it actually runs, exceptions included', 'The result the process exists to produce', 'A check that fails loudly'],
    capability: 'Neuruh replaces one workflow with a documented, AI-assisted flow that gates itself: a run that cannot prove its result does not pass.',
    proof: { object: 'release-court', metric: 'broken_links' },
    proofClaim: 'This site ships only through its own release court, which measures its gates on every candidate.',
    boundary: 'One workflow per sprint, scoped at intake. Nothing is connected to your systems without your access and your say-so.',
    offerId: 'O05',
  },
  {
    slug: 'property-data-without-opportunity',
    title: 'Property data without opportunity',
    description: 'Lead lists and parcel data that never become a decision — and the evidence that separates an opportunity from a row.',
    failure: 'You have parcels, lead lists, and county data. None of it tells you which property deserves your next hour, what is risky about it, or what is still unknown.',
    whyToolsFail: [
      'Lists rank by one signal and hide the rest.',
      'Scores arrive without the records that produced them.',
      'Unknowns are dropped instead of named, so a gap reads as a clean bill.',
    ],
    evidenceNeeded: ['Parcel identity from county records', 'The signals that matter, with their sources', 'Named unknowns and the next research step'],
    capability: 'DeedSonar finds, evidences, ranks and qualifies property opportunities from public records, and says where the evidence stops.',
    proof: { object: 'deedsonar', metric: 'qualified_properties' },
    proofClaim: 'Qualified properties in the current production estate, re-read with the product’s own top opportunity walked end to end.',
    boundary: 'No owner contact, skip-trace, or dialing: production contact authority stays at zero rows. A courthouse research step is named, not skipped.',
    offerId: 'O02',
    frontDoor: 're',
  },
  {
    slug: 'automation-without-authority',
    title: 'Automation without authority',
    description: 'Agents and automations that can act without anyone having granted the action — and what a checked authority gate looks like.',
    failure: 'An automation or agent can send, buy, change, or delete. Nobody granted that specific action; it simply had the credentials. When it misfires, the question “who allowed this?” has no answer.',
    whyToolsFail: [
      'Credentials grant everything the account can do, not the one action intended.',
      'Approval flows approve a request, not the exact action that runs.',
      'A refusal usually leaves no record, so nobody learns what was blocked.',
    ],
    evidenceNeeded: ['The action, stated exactly', 'The authority that allowed it, and its limits', 'A record of what was refused, not only what ran'],
    capability: 'Neuruh systems pass every action through a checked authority gate: grants are narrow, refusals are recorded, and an ungranted action does not run.',
    proof: { object: 'deedsonar', metric: 'contact_authorized_rows' },
    proofClaim: 'In DeedSonar production, contact permission cannot be recorded at all until it is granted — the refusal is the measured state.',
    boundary: 'An audit maps where authority is missing in your system; it does not grant, bypass, or exercise any authority on your behalf.',
    offerId: 'FSA',
  },
  {
    slug: 'systems-nobody-can-explain',
    title: 'Systems nobody can explain',
    description: 'Estates of services, repositories and scripts nobody can fully account for — and how to establish what is actually running.',
    failure: 'Services, repositories, scripts, and agents accumulate. Nobody can say which ones are canonical, which are running, or which a decision actually depended on.',
    whyToolsFail: [
      'Inventories list what exists, not what is authoritative.',
      'Documentation describes intent and drifts from what runs.',
      'Counts made without published rules cannot be repeated or checked.',
    ],
    evidenceNeeded: ['What runs, observed rather than remembered', 'Counting rules that someone else can repeat', 'Contradictions kept, not smoothed over'],
    capability: 'Neuruh counts an estate under published rules and preserves contradictions, producing a truth, state, gap, and recovery report tied to evidence.',
    proof: { object: 'organism-census', metric: 'canonical_active_runtimes' },
    proofClaim: 'Neuruh’s own operating estate, counted on one host under published rules.',
    boundary: 'A point-in-time report, not live monitoring. Findings name evidence; they are not a certification or a security attestation.',
    offerId: 'FSA',
  },
] as const

export const PROBLEM_SLUGS = PUBLIC_PROBLEMS.map((problem) => problem.slug)

export function getProblem(slug: string) {
  return PUBLIC_PROBLEMS.find((problem) => problem.slug === slug)
}
