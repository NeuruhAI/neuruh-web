import { HomeV2 } from '../../components/HomeV2'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/no-webgl',
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: '/',
  absoluteTitle: true,
})

export default function NoWebglPage() {
  return <HomeV2 />
}
