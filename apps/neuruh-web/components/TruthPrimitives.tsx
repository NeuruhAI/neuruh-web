import type { ClassifiedMetric, PublicContradiction, PublicObject, PublicRelationship, TruthMode } from '../../../packages/public-truth/types'

export function TruthModeBadge({ mode }: { mode: TruthMode }) {
  return <span className="truth-badge" data-truth-mode={mode}>{mode.replaceAll('_', ' ')}</span>
}

export function LastVerified({ at }: { at: string }) {
  return <p className="last-verified">Last verified <time dateTime={at}>{at}</time></p>
}

export function EvidenceDisclosure({ object }: { object: PublicObject }) {
  return (
    <details className="evidence-disclosure">
      <summary>Evidence and limitations</summary>
      <p data-evidence-status={object.evidence_summary.status}><strong>{object.evidence_summary.status}</strong> — {object.evidence_summary.statement}</p>
      <p className="source-line">Source: {object.source.title} · <code>{object.source.ref}</code></p>
      <ul>{object.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
    </details>
  )
}

export function MetricStrip({ metrics }: { metrics: ClassifiedMetric[] }) {
  return (
    <ul className="metric-strip">
      {metrics.map((metric) => (
        <li key={metric.name}>
          <span className="metric-strip__value">{metric.value.toLocaleString('en-US')}</span>
          <span className="metric-strip__name">{metric.name.replaceAll('_', ' ')}</span>
          <span className="metric-strip__meta">
            {metric.classification} · <time dateTime={metric.as_of}>{metric.as_of.slice(0, 10)}</time>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function ContradictionObject({ contradiction }: { contradiction: PublicContradiction }) {
  return (
    <aside className="contradiction-object" data-contradiction-id={contradiction.id}>
      <p className="n-label">Contradiction · {contradiction.status}</p>
      <p>{contradiction.summary}</p>
      <dl>
        <dt>Supporting sources</dt><dd>{contradiction.supporting_sources.join(', ')}</dd>
        <dt>Opposing sources</dt><dd>{contradiction.opposing_sources.join(', ')}</dd>
      </dl>
    </aside>
  )
}

export function RelationshipList({ relationships, names }: { relationships: PublicRelationship[]; names: Map<string, string> }) {
  return (
    <ul className="relationship-list">
      {relationships.map((relationship) => (
        <li key={relationship.id}>
          <span>{names.get(relationship.source_id) ?? relationship.source_id}</span>
          <strong>{relationship.type} · {relationship.direction}</strong>
          <span>{names.get(relationship.target_id) ?? relationship.target_id}</span>
          <TruthModeBadge mode={relationship.truth_mode} />
          <small>Source {relationship.source_ref} · <time dateTime={relationship.observed_at}>{relationship.observed_at}</time></small>
        </li>
      ))}
    </ul>
  )
}

