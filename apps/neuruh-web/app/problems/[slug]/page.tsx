import Link from 'next/link'
import { notFound } from 'next/navigation'
import { estateHref, offerHref } from '../../../lib/attribution'
import { OFFER_BY_ID } from '../../../lib/publicOffers'
import { PUBLIC_PROBLEMS, getProblem } from '../../../lib/publicProblems'
import { proofFact } from '../../../lib/publicProofFacts'
import { pageMeta } from '../../../lib/publicSeo'

export const dynamicParams = false

export function generateStaticParams() {
  return PUBLIC_PROBLEMS.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const problem = getProblem(slug)
  return pageMeta({
    path: `/problems/${slug}`,
    title: problem?.title ?? 'Problem',
    description: problem?.description ?? 'A failure mode Neuruh works on, with the evidence it needs and its boundary.',
  })
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const problem = getProblem(slug)
  if (!problem) notFound()
  const offer = OFFER_BY_ID[problem.offerId]
  const fact = proofFact(problem.proof)
  return (
    <main id="main" data-problem={problem.slug}>
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow"><Link className="v2-link" href="/problems">Problems</Link> · failure mode</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{problem.title}</h1>
          <p className="sec-sub" data-testid="problem-failure">{problem.failure}</p>
        </div>
      </section>

      <section className="sec sec-alt" aria-labelledby="why-h">
        <div className="sec-inner">
          <h2 className="sec-h" id="why-h">Why conventional tools fail</h2>
          <ul className="not-claimed">
            {problem.whyToolsFail.map((line) => <li key={line}>{line}</li>)}
          </ul>
          <h2 className="sec-h">The evidence it takes</h2>
          <ol className="law-list" data-testid="problem-evidence">
            {problem.evidenceNeeded.map((line, index) => (
              <li className="law" key={line}><span className="ln">{String(index + 1).padStart(2, '0')}</span><p>{line}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec" aria-labelledby="cap-h">
        <div className="sec-inner">
          <h2 className="sec-h" id="cap-h">What Neuruh does</h2>
          <p className="sec-sub">{problem.capability}</p>
          <div className="ev-grid">
            <article className="ev-card" data-testid="problem-proof">
              <p className="ev-k">Proof · {fact.mode}</p>
              <p className="claim">{problem.proofClaim}</p>
              <p className="ev-line">
                <b>{fact.value}</b> {fact.unit} · {fact.objectName} · as of <time dateTime={fact.asOf}>{fact.asOf}</time> · not a live feed
              </p>
              <Link className="v2-link" href="/proof">Read it on the proof ledger →</Link>
            </article>
            <article className="ev-card" data-testid="problem-boundary">
              <p className="ev-k">Boundary</p>
              <p className="claim">What this does not do</p>
              <p className="ev-line ev-prose">{problem.boundary}</p>
              <Link className="v2-link" href="/refusals">Every boundary →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="sec sec-alt" aria-labelledby="cta-h">
        <div className="sec-inner">
          <h2 className="sec-h" id="cta-h">Start with one scoped piece of work</h2>
          <p className="sec-sub">{offer.name} · {offer.price}. {offer.promise}</p>
          <div className="row" style={{ marginTop: 18 }}>
            <a className="v2-btn v2-btn-primary" href={offerHref(offer)} rel="noopener noreferrer" data-testid="problem-cta">{offer.cta}</a>
            {problem.frontDoor && (
              <a className="v2-btn v2-btn-secondary" href={estateHref(problem.frontDoor, `problem-${problem.slug}`)} rel="noopener noreferrer">Start on re.neuruh.com</a>
            )}
            <Link className="v2-btn v2-btn-secondary" href="/solve">Give Neuruh a target</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
