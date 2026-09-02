import { SITE_ORIGIN } from './publicSeo'
import { PUBLIC_OFFERS } from './publicOffers'

export const PUBLIC_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: 'Neuruh',
      url: SITE_ORIGIN,
      email: 'jeramie@neuruh.com',
      founder: {
        '@type': 'Person',
        name: 'Jeramie Hicks',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      name: 'Neuruh',
      url: SITE_ORIGIN,
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    },
    ...PUBLIC_OFFERS.map((offer) => ({
      '@type': 'Service',
      '@id': `${SITE_ORIGIN}/offers#${offer.id}`,
      name: offer.name,
      description: offer.promise,
      provider: { '@id': `${SITE_ORIGIN}/#organization` },
      url: `${SITE_ORIGIN}/offers`,
      offers: {
        '@type': 'Offer',
        price: offer.price.replace('$', ''),
        priceCurrency: 'USD',
        url: offer.href,
        availability: 'https://schema.org/InStock',
      },
    })),
  ],
} as const
