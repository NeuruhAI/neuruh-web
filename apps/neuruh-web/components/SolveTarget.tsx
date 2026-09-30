'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { SOLVE_CLASSES, type SolveClass } from '../lib/publicSolve'
import styles from './Commercial.module.css'

export type SolveCard = {
  targetClass: SolveClass
  mission: string
  receive: string
  offerName: string
  offerPrice: string
  ctaHref: string
  ctaLabel: string
  frontDoorHref: string | null
  problemHref: string
  problemTitle: string
  proofLine: string
  proofMode: string
}

/**
 * The target text stays in this browser: it shapes nothing but the visitor's own view and is never
 * sent anywhere by the site. The email action hands it to the visitor's own mail client. Routing is a labeled path per target class — not a score and not a hidden ranking.
 */
export function SolveTarget({ cards }: { cards: SolveCard[] }) {
  const [target, setTarget] = useState('')
  const [targetClass, setTargetClass] = useState<SolveClass | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const inputId = useId()
  const trimmed = target.trim()
  // The fragment never reaches the server: /contact reads it in the browser and prefills the intake.
  const intakeHref = `/contact#${new URLSearchParams({ target: trimmed.slice(0, 1500), ...(targetClass ? { kind: targetClass } : {}) }).toString()}`
  // Opens the visitor's own mail client; the site itself still sends nothing.
  const mailto = `mailto:jeramie@neuruh.com?subject=${encodeURIComponent(`Solve intake: ${trimmed.replace(/\s+/g, ' ').slice(0, 60) || 'new target'}`)}&body=${encodeURIComponent(`${trimmed}${targetClass ? `\n\nTarget kind: ${targetClass}` : ''}`)}`
  const card = cards.find((candidate) => candidate.targetClass === (targetClass ?? 'Other'))!

  return (
    <div data-testid="solve-target">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}
      >
        <label className="method-h" htmlFor={inputId}>What should Neuruh investigate?</label>
        <p className={styles.note}>
          Describe the target in your own words. Routing happens in this browser: nothing you type is sent, stored, or read
          by Neuruh unless you choose to send it to the founder.
        </p>
        <textarea
          id={inputId}
          name="target"
          rows={3}
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          placeholder="A parcel on the county line, a supplier we might buy, three years of exports nobody trusts…"
          style={{ width: '100%', minHeight: 96, font: 'inherit', padding: 12, borderRadius: 8, border: '1px solid var(--v2-line-2)', background: 'var(--v2-surf-1)', color: 'var(--v2-text)' }}
          data-testid="solve-input"
        />
        <fieldset style={{ border: 0, padding: 0, margin: '18px 0 0' }}>
          <legend className="method-h">What kind of target is it? (optional)</legend>
          <div className={styles.chooser}>
            {SOLVE_CLASSES.map((name) => (
              <button
                key={name}
                type="button"
                className={styles.choice}
                aria-pressed={targetClass === name}
                data-testid={`solve-class-${name.toLowerCase()}`}
                onClick={() => setTargetClass(name)}
              >
                <strong>{name}</strong>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="row" style={{ marginTop: 18 }}>
          <button type="submit" className="v2-btn v2-btn-primary" data-testid="solve-submit">Route this target</button>
          <a className="v2-btn v2-btn-secondary" href={intakeHref} data-testid="solve-intake">Send this target to the founder</a>
        </div>
        <p className={styles.note} style={{ marginTop: 10 }}>
          Or <a className="v2-link" href={mailto} data-testid="solve-email">email it directly</a> from your own mail app.
        </p>
      </form>

      <section aria-live="polite" style={{ marginTop: 28 }}>
        {submitted && (
          <article className={styles.card} data-testid="solve-result" data-target-class={card.targetClass}>
            <div className={styles.head}>
              <p className={styles.kicker}>Bounded mission · {card.targetClass}</p>
              <p className={styles.price}>{card.offerPrice}</p>
            </div>
            <h2 className={styles.title}>{card.offerName}</h2>
            <p className={styles.lede}>{card.mission}</p>
            <dl className={styles.facts}>
              <div>
                <dt>You receive:</dt>
                <dd>{card.receive}</dd>
              </div>
              <div>
                <dt>Proof ({card.proofMode}):</dt>
                <dd data-testid="solve-proof">{card.proofLine}</dd>
              </div>
              <div>
                <dt>Why this path:</dt>
                <dd><Link className="v2-link" href={card.problemHref}>{card.problemTitle}</Link></dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <a className="v2-btn v2-btn-primary" href={card.ctaHref} rel="noopener noreferrer" data-testid="solve-cta">{card.ctaLabel}</a>
              {card.frontDoorHref && <a className="v2-link" href={card.frontDoorHref} rel="noopener noreferrer">Or start on re.neuruh.com →</a>}
              <a className="v2-link" href={intakeHref} data-testid="solve-result-intake">Not a fit? Send this target to the founder →</a>
            </div>
          </article>
        )}
      </section>
    </div>
  )
}
