/**
 * Public boundaries, stated as refusals rather than as counts.
 *
 * A count needs a receipt like any other number. Revenue and customer
 * figures exist but are not published: client engagements are the
 * clients' facts to disclose, not Neuruh's. Publishing "$0" asserted
 * something false about the business; publishing nothing asserts only
 * what is true, which is that these figures are deliberately withheld.
 *
 * Outreach and security-review values remain real, dated zeros.
 */
export const PUBLIC_HARD_ZEROS = {
  asOf: '2026-09-14',
  source: 'Public refusals ledger and the dated public-truth snapshot',
  revenue: 'not published',
  customers: 'not published',
  outreach: '0',
  securityReviews: '0',
} as const
