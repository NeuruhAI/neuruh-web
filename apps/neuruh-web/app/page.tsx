import type { Metadata } from 'next'
import { HomeV2 } from '../components/HomeV2'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default function HomePage() {
  return <HomeV2 />
}
