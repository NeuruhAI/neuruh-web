import { TRUTH_RULES } from './publicTruthRules'

/**
 * Case studies compiled only from public-safe receipts already on this site.
 * No customer stories (customers: 0). No private organ SHAs as marketing copy.
 */
export const PUBLIC_CASE_STUDIES = [
  {
    id: 'deedsonar-production',
    title: 'DeedSonar in production',
    status: 'IN PRODUCTION',
    asOf: '2026-09-14',
    problem: 'County records, parcel geometry, and distress signals need to become ranked opportunities with evidence attached — without the trail being lost.',
    whatRan: 'DeedSonar operates as the public flagship: find, evidence, rank, and qualify. A read-only production tape on 2026-09-14 walked the product’s own top opportunity through ten of fifteen steps and stopped at the contact ladder — a human courthouse research step.',
    receipt: 'Production attests its own release (06cbb841, repository main identical to production, observed 2026-09-14). The earlier dated court — tests green at release e2b71fa — is compiled on the public-truth object, not hand-typed here.',
    limitation: 'Sample screens on this site are labeled sample data. Outreach, deal execution, and receipts at every step are not claimed: the tape did not reach them. Production identity is not a customer-count claim.',
    href: '/worlds/deedsonar',
    hrefLabel: 'DeedSonar record',
  },
  {
    id: 'neuruh-com-launch',
    title: 'neuruh.com commercial launch',
    status: 'SHIPPED_LIVE',
    asOf: '2026-09-01',
    problem: 'The organism site was visually complete and still commercially mute — a visitor could not buy a scoped piece of work.',
    whatRan: 'SHIP-001 put three fixed-scope offers on the existing art-direction surface, using the live Stripe payment links already in the catalog.',
    receipt: 'Public merge 30947182 on NeuruhAI/neuruh-web · SHIPPED_LIVE cashiers O01 $299, O02 $499, O05 $1250 · neuruh.com.',
    limitation: `${TRUTH_RULES.ship001} ${TRUTH_RULES.liveCashierIsNotFulfillment} ${TRUTH_RULES.cashiersLiveOrderDraft}`,
    href: '/offers',
    hrefLabel: 'See the live cashiers',
  },
  {
    id: 'liquidity-engine-synthetic',
    title: 'Liquidity Engine — synthetic close path',
    status: 'SYNTHETIC DEMO',
    asOf: '2026-08-24',
    problem: 'Field signals need a least-destructive next option, with authorization and a close — without pretending real money moved.',
    whatRan: 'The sealed candidate walks field signal → underwritten options → authorization → synthetic close, with every close labeled synthetic.',
    receipt: '112 tests · 18/18 operating court · 100/100 browser checks · public custody receipt already on this site (no private-repo link).',
    limitation: `${TRUTH_RULES.mergedIsNotLive} AUTH=OFF. No real money. Owner contact and payouts remain manual.`,
    href: '/worlds/liquidity-engine',
    hrefLabel: 'Liquidity record',
  },
  {
    id: 'sealed-product-courts',
    title: 'Sealed product courts',
    status: 'SEALED CANDIDATES',
    asOf: '2026-08-22',
    problem: 'Release candidates need dated courts before anyone is invited to treat them as live products.',
    whatRan: 'FindSellProfit, Bookeit, CurbClaim, and ProofOS carry vendored court receipts and truthful status labels on /products.',
    receipt: 'FindSellProfit tests on the public object · Bookeit 161 unit + 133 E2E · CurbClaim 202 · ProofOS 14 courts · receipts vendored in-repo.',
    limitation: `${TRUTH_RULES.mergedIsNotLive} Sealed is not production. Fixture-backed surfaces stay labeled.`,
    href: '/products',
    hrefLabel: 'All products',
  },
  {
    id: 'public-commons-audit',
    title: 'Public commons audit',
    status: 'AUDITED',
    asOf: '2026-09-03',
    problem: 'Open work has to be countable and secret-scanned, or “open source” is a vibe.',
    whatRan: 'The public-commons object publishes a dated census of public repositories and a zero-hit secret scan (2026-08-20), and the test totals were re-derived on 2026-09-03 by re-running every Python suite at its advertised tag.',
    receipt: 'Compiled public-truth snapshot · public_code_repositories, passing_tests, secret_scan_hits=0 · /open-source.',
    limitation: 'A commons census is not a claim about private estate inventory. The public org page is not a private-repo index.',
    href: '/open-source',
    hrefLabel: 'Open source',
  },
] as const
