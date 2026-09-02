import { PUBLIC_JSON_LD } from '../lib/publicJsonLd'

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(PUBLIC_JSON_LD) }}
    />
  )
}
