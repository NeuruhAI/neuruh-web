import type { PublicOffer } from './publicOffers'

/**
 * Attribution spine (2026-09-14). No commercial link leaves the estate unattributed.
 *
 *   Cal.com and cross-surface estate links carry
 *     ?utm_source=neuruh&utm_medium=site&utm_campaign=<surface>&utm_content=<slug>
 *   Stripe payment links carry
 *     ?client_reference_id=<surface>-<offer-slug>
 *   which Stripe carries into the Checkout Session and surfaces on the webhook.
 *
 * URL parameters only. Nothing inside Stripe or Cal.com is modified. Whether Cal.com
 * stores the UTM values in booking metadata is unconfirmed (see HANDBACK.md).
 */
export type Surface = 'root' | 're' | 'guide'
export const THIS_SURFACE: Surface = 'root'

export const ESTATE = {
  root: 'https://neuruh.com',
  re: 'https://re.neuruh.com',
  guide: 'https://guide.neuruh.com',
} as const

function withParams(href: string, params: Record<string, string>) {
  const url = new URL(href)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  return url.toString()
}

export function utm(href: string, content: string, surface: Surface = THIS_SURFACE) {
  return withParams(href, { utm_source: 'neuruh', utm_medium: 'site', utm_campaign: surface, utm_content: content })
}

export function stripeReference(href: string, slug: string, surface: Surface = THIS_SURFACE) {
  return withParams(href, { client_reference_id: `${surface}-${slug}` })
}

export function offerHref(offer: PublicOffer) {
  return offer.kind === 'cashier'
    ? stripeReference(offer.href, offer.id.toLowerCase())
    : utm(offer.href, 'forensic-scope-90')
}

export function calHref(slug: string, content: string) {
  return utm(`https://cal.com/neuruh/${slug}`, content)
}

export function estateHref(target: Exclude<Surface, 'root'>, content: string) {
  return utm(ESTATE[target], content)
}
