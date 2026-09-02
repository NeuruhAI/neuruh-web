import { WorkWithHub } from '../../components/WorkWithHub'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/work-with-neuruh',
  title: 'Work with Neuruh',
  description:
    'Three ways to work with Neuruh: pick a fixed-scope offer, ask which path fits, or talk to the founder about custom work.',
})

export default function WorkWithNeuruhPage() {
  return <WorkWithHub />
}
