import { WorkWithHub } from '../../components/WorkWithHub'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/work-with-us',
  title: 'Work with us',
  description:
    'Three ways to work with Neuruh: pick a fixed-scope offer, ask which path fits, or talk to the founder about custom work.',
  canonical: '/work-with-neuruh',
})

export default function WorkWithUsPage() {
  return <WorkWithHub />
}
