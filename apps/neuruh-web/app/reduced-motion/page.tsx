import { HomeV2 } from '../../components/HomeV2'
import { MotionRoute } from '../../components/MotionRoute'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/reduced-motion',
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: '/',
  absoluteTitle: true,
})

export default function ReducedMotionPage() {
  return (
    <>
      <MotionRoute mode="reduced" />
      <HomeV2 />
    </>
  )
}
