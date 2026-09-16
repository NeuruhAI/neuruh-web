import Link from 'next/link'
import { getPublicObject } from '../../../packages/public-truth/client'
import { PUBLIC_CASE_STUDIES } from '../lib/publicCaseStudies'
import styles from './Commercial.module.css'

function deedsonarCourtLine() {
  const metrics = getPublicObject('deedsonar')?.metrics ?? []
  const estate = metrics.find((metric) => metric.name === 'current_estate_properties')
  const tests = metrics.find((metric) => metric.name === 'tests_green_at_production_sha')
  const current = estate ? `Current estate ${estate.value.toLocaleString('en-US')} properties · re-read ${estate.as_of.slice(0, 10)}` : null
  // The 2026-08-23 court is superseded: kept with its date and labeled, never presented as the production release.
  const historical = tests ? `${tests.classification} · ${tests.value.toLocaleString('en-US')} tests green at an earlier release · court ${tests.as_of.slice(0, 10)}` : null
  return [current, historical].filter(Boolean).join(' · ') || null
}

export function CaseStudyGrid() {
  const dsCourt = deedsonarCourtLine()
  return (
    <div className={styles.grid2} data-testid="case-studies">
      {PUBLIC_CASE_STUDIES.map((study) => (
        <article key={study.id} className={styles.card} id={study.id} data-testid={`case-${study.id}`}>
          <div className={styles.head}>
            <p className={styles.kicker}>{study.status}</p>
            <p className={styles.kicker}>as of {study.asOf}</p>
          </div>
          <h2 className={styles.title}>{study.title}</h2>
          <dl className={styles.facts}>
            <div>
              <dt>The job</dt>
              <dd>{study.problem}</dd>
            </div>
            <div>
              <dt>What ran</dt>
              <dd>{study.whatRan}</dd>
            </div>
            <div>
              <dt>Public receipt</dt>
              <dd>
                {study.receipt}
                {study.id === 'deedsonar-production' && dsCourt ? ` ${dsCourt}.` : null}
              </dd>
            </div>
            <div>
              <dt>Limitation</dt>
              <dd>{study.limitation}</dd>
            </div>
          </dl>
          <div className={styles.actions}>
            <Link className="v2-link" href={study.href}>{study.hrefLabel} →</Link>
          </div>
        </article>
      ))}
    </div>
  )
}
