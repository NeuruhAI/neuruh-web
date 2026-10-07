import { HomeV2 } from '../components/HomeV2'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMeta } from '../lib/publicSeo'

export const metadata = pageMeta({
  path: '/',
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  absoluteTitle: true,
})

export default function HomePage() {
  return <HomeV2 />
}
