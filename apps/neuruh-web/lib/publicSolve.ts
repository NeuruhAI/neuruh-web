import type { PublicOfferId } from './publicOffers'
import type { ProofRef } from './publicProofFacts'

/**
 * /solve — "Give Neuruh a Target" (issue #10, Workstream 3).
 * A front-door composition over what already exists: a target class routes to one bounded mission,
 * an existing offer (or the real-estate front door), a dated proof read from the snapshot, and the
 * failure-mode page that explains it. No backend, no account, no CRM: the target text never leaves
 * the visitor's browser.
 */
export const SOLVE_CLASSES = ['Property', 'Business', 'Data', 'Opportunity', 'Research', 'Other'] as const
export type SolveClass = (typeof SOLVE_CLASSES)[number]

export type SolveRoute = {
  mission: string
  receive: string
  offerId: PublicOfferId
  frontDoor?: 're'
  problemSlug: string
  proof: ProofRef
  proofClaim: string
}

export const SOLVE_ROUTES: Record<SolveClass, SolveRoute> = {
  Property: {
    mission: 'Investigate one property, parcel, or market and say whether it deserves your next hour.',
    receive: 'Evidence, risks, named unknowns, and a recommendation — as a scan on re.neuruh.com or a full dossier here.',
    offerId: 'O02',
    frontDoor: 're',
    problemSlug: 'property-data-without-opportunity',
    proof: { object: 'deedsonar', metric: 'customer_tape_steps_reachable' },
    proofClaim: 'of fifteen steps reached by the product’s own top opportunity on a read-only production tape, stopping at a human research step',
  },
  Business: {
    mission: 'Resolve one company or acquisition target: who owns it, what is linked to it, and what is risky.',
    receive: 'A source-backed dossier with the evidence, the upside and risks, and one recommended next move.',
    offerId: 'O02',
    problemSlug: 'ai-you-cannot-verify',
    proof: { object: 'deedsonar', metric: 'qualified_properties' },
    proofClaim: 'properties qualified in production by the same evidence discipline, applied to parcels',
  },
  Data: {
    mission: 'Recover one set of files, exports, or records into something you can actually use.',
    receive: 'A recovered package plus a note on what changed and what is still missing.',
    offerId: 'O01',
    problemSlug: 'data-you-cannot-use',
    proof: { object: 'deedsonar', metric: 'current_estate_properties' },
    proofClaim: 'properties held in one current production estate built from messy county publications',
  },
  Opportunity: {
    mission: 'Answer one opportunity question with sources kept and the recommendation explicit.',
    receive: 'A concise dossier: evidence, upside, risks, and the next move.',
    offerId: 'O02',
    problemSlug: 'property-data-without-opportunity',
    proof: { object: 'deedsonar', metric: 'qualified_properties' },
    proofClaim: 'qualified properties in the current production estate',
  },
  Research: {
    mission: 'Establish what is actually true about a system you already run — its state, gaps, and recovery path.',
    receive: 'A forensic report with every finding tied to the evidence that supports it, scoped in a session first.',
    offerId: 'FSA',
    problemSlug: 'systems-nobody-can-explain',
    proof: { object: 'organism-census', metric: 'canonical_active_runtimes' },
    proofClaim: 'services in Neuruh’s own operating estate, counted on one host under published rules',
  },
  Other: {
    mission: 'Replace one repeating manual process — or, if it fits nothing here, talk it through first.',
    receive: 'A scoped working workflow and its handoff, or a straight answer on whether Neuruh is the right fit.',
    offerId: 'O05',
    problemSlug: 'workflows-that-break',
    proof: { object: 'release-court', metric: 'broken_links' },
    proofClaim: 'broken links on this site’s own release court — the gate a candidate must clear to ship',
  },
}
