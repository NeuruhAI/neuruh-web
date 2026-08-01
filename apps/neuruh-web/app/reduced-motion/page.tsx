import { NeuruhExperience } from '../../components/NeuruhExperience'
import { getTruthSummary } from '../../../../packages/public-truth/client'

export default function ReducedMotionPage() {
  return <NeuruhExperience forceMotion="reduced" truth={getTruthSummary()} />
}
