import type { ReactNode } from 'react'

export type EvidenceState = 'dormant' | 'loading' | 'partial' | 'verified' | 'review' | 'contradiction' | 'stale' | 'unavailable' | 'unsupported' | 'blocked' | 'failed'
export type Spine = 'obsidian' | 'bone'

function required(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message)
}

export function EvidenceChip({ claim, source, state }: { claim: string; source: { id: string; label: string }; state: EvidenceState }) {
  required(source?.id && source?.label, 'EvidenceChip requires provenance source')
  return <span className="n-evidence" data-state={state} data-source-id={source.id}>◇ {claim} · {source.label}</span>
}

export function ProvenanceTrail({ hops }: { hops: Array<{ kind: 'signal' | 'evidence' | 'claim'; value: string; meta: string; state: EvidenceState }> }) {
  if (hops.length < 2) throw new Error('ProvenanceTrail requires at least two hops')
  return <ol className="n-trail">{hops.map((hop, i) => <li key={`${hop.kind}-${i}`} data-state={hop.state}>{hop.value} — {hop.meta}</li>)}</ol>
}

export function ConfidenceMeter({ point, interval, state }: { point: number; interval: [number, number]; state: EvidenceState }) {
  required(interval && interval[0] < interval[1], 'ConfidenceMeter requires a non-zero interval')
  return <span className="n-confidence" data-state={state}>{point.toFixed(2)} [{interval[0].toFixed(2)}–{interval[1].toFixed(2)}]</span>
}

export function ContradictionPair({ a, b, field, gatedRecipes }: { a: ReactNode; b: ReactNode; field: string; gatedRecipes: string[] }) {
  required(gatedRecipes.length, 'ContradictionPair must list gated downstream work')
  return <section className="n-contradiction" data-field={field}><div>{a}</div><div>{b}</div><p>Gated: {gatedRecipes.join(', ')}</p></section>
}

export function ReceiptBlock({ action, authority, scope, result, receiptId, ts, completed }: { action: string; authority: string; scope: string; result: string; receiptId: string; ts: string; completed: boolean }) {
  if (!completed) throw new Error('ReceiptBlock refuses incomplete actions')
  return <dl className="n-receipt"><dt>action</dt><dd>{action}</dd><dt>authority</dt><dd>{authority}</dd><dt>scope</dt><dd>{scope}</dd><dt>result</dt><dd>{result}</dd><dt>receipt</dt><dd>{receiptId} · {ts}</dd></dl>
}

export function AuthorityGate({ authority, scope, reason }: { authority: 'granted' | 'scoped' | 'withheld' | 'revoked'; scope: string; reason?: string }) {
  if ((authority === 'withheld' || authority === 'revoked') && !reason) throw new Error(`${authority} authority requires a reason`)
  return <section className="n-gate" data-authority={authority}><strong>{authority}</strong><p>{scope}</p>{reason && <p>{reason}</p>}</section>
}

export function CapabilityBoundary({ kind, message, retry }: { kind: 'unavailable' | 'unsupported' | 'blocked'; message: string; retry?: ReactNode }) {
  if (kind === 'unsupported' && retry) throw new Error('Unsupported capabilities cannot offer retry')
  return <section className="n-boundary" data-state={kind}><p>{message}</p>{retry}</section>
}

export function FixtureBadge({ children }: { children: ReactNode }) {
  return <span className="bb-fixture">fixture · {children}</span>
}

export function ScopeStrip({ children }: { children: ReactNode }) {
  return <aside className="n-scope" aria-label="Current scope">{children}</aside>
}

export function Button({ variant, state, children }: { variant: 'primary' | 'secondary' | 'ghost'; state?: EvidenceState; children: ReactNode }) {
  return <button className={`n-btn n-btn--${variant}`} data-state={state}>{children}</button>
}

export function Badge({ glyph, state, children }: { glyph: string; state: EvidenceState; children: ReactNode }) {
  required(glyph, 'Badge requires data-glyph')
  return <span className="n-badge" data-glyph={glyph} data-state={state}>{glyph} {children}</span>
}

export function DataCell({ value, numeric = false }: { value: ReactNode | null | undefined; numeric?: boolean }) {
  return <td className={numeric ? 'is-numeric' : undefined}>{value === null || value === undefined || value === '' ? '—' : value}</td>
}
