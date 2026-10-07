import Link from 'next/link'
import { SolveTarget, type SolveCard } from '../../components/SolveTarget'
import { estateHref, offerHref } from '../../lib/attribution'
import { OFFER_BY_ID } from '../../lib/publicOffers'
import { getProblem } from '../../lib/publicProblems'
import { proofFact } from '../../lib/publicProofFacts'
import { SOLVE_CLASSES, SOLVE_ROUTES } from '../../lib/publicSolve'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/solve',
  title: 'Give Neuruh a target',
  description: 'Describe one property, business, dataset, opportunity, or system. Neuruh routes it to one bounded mission with a dated proof, a stated boundary, and an existing scoped offer.',
})

export default function SolvePage() {
  // Built at compile time from the offer catalog and the truth snapshot; the client only chooses among them.
  const cards: SolveCard[] = SOLVE_CLASSES.map((targetClass) => {
    const route = SOLVE_ROUTES[targetClass]
    const offer = OFFER_BY_ID[route.offerId]
    const problem = getProblem(route.problemSlug)!
    const fact = proofFact(route.proof)
    return {
      targetClass,
      mission: route.mission,
      receive: route.receive,
      offerName: offer.name,
      offerPrice: offer.price,
      ctaHref: offerHref(offer),
      ctaLabel: offer.cta,
      frontDoorHref: route.frontDoor ? estateHref(route.frontDoor, `solve-${targetClass.toLowerCase()}`) : null,
      problemHref: `/problems/${problem.slug}`,
      problemTitle: problem.title,
      proofLine: `${fact.value} ${route.proofClaim} · ${fact.objectName} · as of ${fact.asOf} · not a live feed`,
      proofMode: fact.mode,
    }
  })
  return (
    <main id="main">
      <section className="sec">
        <div className="sec-inner">
          <p className="sec-eyebrow">Solve</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Give Neuruh a target.</h1>
          <p className="sec-sub">
            One property, company, dataset, opportunity, or system. Neuruh routes it to one bounded mission — what it
            investigates, what you receive, the dated proof behind it, and the scoped offer that starts it.
          </p>
          <SolveTarget cards={cards} />
        </div>
      </section>
      <section className="sec sec-alt" aria-labelledby="solve-how-h">
        <div className="sec-inner">
          <h2 className="sec-h" id="solve-how-h">Target → evidence → decision → authority → receipt</h2>
          <p className="sec-sub">
            Every mission follows the same order: the target is investigated, evidence is kept, a decision is made
            explicit, nothing acts without checked authority, and the work leaves a receipt. The boundaries are on{' '}
            <Link className="v2-link" href="/refusals">/refusals</Link>; the dated figures are on{' '}
            <Link className="v2-link" href="/proof">/proof</Link>; the failure modes are on{' '}
            <Link className="v2-link" href="/problems">/problems</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}
