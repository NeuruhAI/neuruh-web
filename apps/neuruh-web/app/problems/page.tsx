import Link from 'next/link'
import { PUBLIC_PROBLEMS } from '../../lib/publicProblems'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/problems',
  title: 'Problems Neuruh works on',
  description: 'Six failure modes — unusable data, unverifiable AI, breaking workflows, property data without opportunity, automation without authority, and systems nobody can explain — with the evidence each needs and its boundary.',
})

export default function ProblemsIndex() {
  return (
    <main id="main">
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow">Problems</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Start from what is failing.</h1>
          <p className="sec-sub">
            Each page names the failure, why the usual tools do not fix it, the evidence it takes, what Neuruh does,
            a dated proof, the boundary, and one way to start.
          </p>
          <div className="ev-grid" data-testid="problem-index">
            {PUBLIC_PROBLEMS.map((problem) => (
              <article className="ev-card" key={problem.slug}>
                <p className="ev-k">Failure mode</p>
                <p className="claim">{problem.title}</p>
                <p className="ev-line ev-prose">{problem.description}</p>
                <Link className="v2-link" href={`/problems/${problem.slug}`}>Read the failure mode →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
