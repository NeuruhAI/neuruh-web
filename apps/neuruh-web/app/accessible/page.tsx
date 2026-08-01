import { NeuruhExperience } from '../../components/NeuruhExperience'
import { getTruthSummary } from '../../../../packages/public-truth/client'

export default function AccessiblePage() {
  return <NeuruhExperience forceTier={0} truth={getTruthSummary()} />
}
