import type { Metadata } from 'next'
import { HomeV2 } from '../../components/HomeV2'
import { MotionRoute } from '../../components/MotionRoute'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default function ReducedMotionPage() {
  return (
    <>
      <MotionRoute mode="reduced" />
      <HomeV2 />
    </>
  )
}
