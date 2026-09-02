import { HomeV2 } from '../../components/HomeV2'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/accessible',
  title: 'Accessible route',
  description: 'The complete Neuruh homepage as a fully static, WebGL-free route. The primary homepage is equally accessible; this route guarantees it.',
  canonical: '/',
})

// The homepage is WebGL-free by design; this route exists as the standing
// contract that every word remains available with no scene runtime at all.
export default function AccessiblePage() {
  return <HomeV2 />
}
