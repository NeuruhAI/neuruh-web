import { NeuruhExperience } from '../components/NeuruhExperience'
import { getTruthSummary } from '../../../packages/public-truth/client'

export default function Page() {
  return <NeuruhExperience truth={getTruthSummary()} />
}
