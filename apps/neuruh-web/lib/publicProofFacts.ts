import { evidenceMode, getPublicObject, type EvidenceMode } from '../../../packages/public-truth/client'

/**
 * One dated figure, read from the compiled public-truth snapshot — never typed into a page.
 * Discovery, /solve and FAQ surfaces cite proof through this reader so that every number they
 * show carries its value, unit, as-of date, evidence mode and the object it came from.
 */
export type ProofRef = { object: string; metric: string }
export type ProofFact = {
  value: string
  unit: string
  asOf: string
  mode: EvidenceMode
  objectName: string
  route: string
}

export function proofFact({ object, metric }: ProofRef): ProofFact {
  const source = getPublicObject(object)
  const figure = source?.metrics?.find((candidate) => candidate.name === metric)
  // Fail the build, not the visitor: a discovery page that cites a missing figure must not render a guess.
  if (!source || !figure) throw new Error(`proof reference ${object}.${metric} is not in the compiled snapshot`)
  return {
    value: figure.value.toLocaleString('en-US'),
    unit: figure.unit,
    asOf: figure.as_of.slice(0, 10),
    mode: evidenceMode(figure),
    objectName: source.name,
    route: source.public_route,
  }
}
