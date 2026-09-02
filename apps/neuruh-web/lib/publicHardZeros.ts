/**
 * Hard zeros from the dated public refusals ledger / public-truth snapshot.
 * Do not refresh these without a new dated receipt. A live cashier is not a customer count.
 */
export const PUBLIC_HARD_ZEROS = {
  asOf: '2026-08-24',
  source: 'Public refusals ledger and snapshot neuruh-public-snapshot-2026-08-24',
  revenue: '$0',
  customers: '0',
  outreach: '0',
  securityReviews: '0',
} as const
