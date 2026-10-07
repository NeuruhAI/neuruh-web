import { utm } from '../lib/attribution'
import s from './ProofReceipts.module.css'

/**
 * /proof receipts ledger (2026-09-26). Copy, links and claim set are carried verbatim from the
 * founder-supplied source vendored at receipts/proof-receipts-20260926/proof-source.html.
 * Only the wrapper is the site's: shared nav/footer, next/font families, spine tokens.
 * Do not add, soften or reword a claim here; a claim leaves when its link dies.
 */

const ext = { target: '_blank', rel: 'noopener' } as const
// Same destination as the source; only the site's attribution spine is added.
const CAL = 'https://cal.com/neuruh'

const CALLS: ReadonlyArray<readonly [string, string, string, string]> = [
  ['Chain-of-agent protocols are coming fast, and the prompt engineering era is over.', 'April 2025', 'https://www.facebook.com/groups/aipromptsforentrepreneurs/posts/1181379693270253', 'original post, April 16 2025'],
  ['Agent workflows beat prompt tricks. The edge moved from what you type to what you orchestrate.', 'May 2025', 'https://www.facebook.com/groups/aipromptsforentrepreneurs/posts/1200849627989926', 'original post, May 15 2025'],
  ['Stop automating broken systems. Automation multiplies whatever process you feed it, waste included.', 'May 2025', 'https://www.facebook.com/groups/aipromptsforentrepreneurs/posts/1199688671439355', 'original post, May 13 2025'],
  ['Replace the waste, not the worker. The first automation target is the work nobody should be doing by hand.', 'April 2025', 'https://www.facebook.com/groups/aipromptsforentrepreneurs/posts/1175659467175609', 'original post, April 8 2025'],
]

const VIDEOS = ['7689598249614740749', '7689598381341166861']

export function ProofReceipts() {
  return (
    <div className={s.receipts} data-testid="proof-receipts">
      <section className="sec">
        <div className={`sec-inner ${s.col}`}>
          <p className="sec-eyebrow">Proof / Receipts</p>
          <h1 className="sec-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>Receipts, <span className={s.accent}>or it did not happen.</span></h1>
          <p className={s.lede}>Every claim I make in public traces to something dated and clickable below. If a link dies, the claim goes with it. That is the whole rule.</p>
        </div>
      </section>

      <section className={s.part} id="the-deletion" data-testid="receipts-deletion">
        <h2 className={s.h2}>The deletion</h2>
        <p className="sec-sub">September 25, 2026. The standard I hold myself to, demonstrated on myself first.</p>
        <div className={s.receipt}>
          <span className={s.label}>Receipt</span>
          <span className={s.val}>2026-09-25</span> — I posted a claim about AI on Facebook that I could not verify.<br />
          <span className={s.val}>Same day</span> — I deleted the post. No edit, no quiet rewrite. Deleted.<br />
          <span className={s.val}>Same day</span> — I posted a correction saying the claim was unverified and should not have gone up.<br />
          <span className={s.val}>Rule going forward</span> — a claim goes public only with a receipt attached. This page is where the receipts live.
        </div>
      </section>

      <section className={s.part} id="the-2025-calls" data-testid="receipts-calls">
        <h2 className={s.h2}>The 2025 calls</h2>
        <p className="sec-sub">Dated Facebook posts from spring 2025, in a public AI entrepreneurs group. Each one called a shift before it became the consensus. The originals are linked.</p>
        {CALLS.map(([text, called, href, label]) => (
          <div className={s.call} key={href}>
            <p className={s.callText}>{text}</p>
            <p className={s.meta}>Called {called} — <a className="v2-link" href={href} {...ext}>{label}</a></p>
          </div>
        ))}
      </section>

      <section className={s.part} id="the-camper-op" data-testid="receipts-camper">
        <h2 className={s.h2}>The camper op</h2>
        <p className="sec-sub">September 26, 2026. One morning, one machine, one asset listed and pushed.</p>
        <div className={s.receipt}>
          <span className={s.label}>Receipt</span>
          <span className={s.val}>Asset</span> — 2021 Dutchmen Kodiak 332BHSL, Benton Harbor MI, listed at <span className={s.val}>$25,000</span><br />
          <span className={s.val}>Morning output</span> — photo sales page built, price comps run against dealer listings, 13-number dealer call sheet with a call script, posts pushed to RV buy/sell groups across four states (MI, IN, IL, OH)<br />
          <span className={s.val}>Live listing</span> — <a className="v2-link" href="https://www.facebook.com/marketplace/item/27944663891896736/" {...ext}>Facebook Marketplace, 2021 Dutchmen Kodiak 332BHSL</a>
        </div>
      </section>

      <section className={s.part} id="published-video" data-testid="receipts-video">
        <h2 className={s.h2}>Published video</h2>
        <p className="sec-sub">Short-form runs on the @neuruhai TikTok account. Watch them, then check the claims against this page.</p>
        <ul className={s.list}>
          {VIDEOS.map((id) => (
            <li key={id}>
              <a className="v2-link" href={`https://www.tiktok.com/@neuruhai/video/${id}`} {...ext}>tiktok.com/@neuruhai/video/{id}</a>
              <span className={s.tag}>Published — @neuruhai</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.part} id="the-2025-calls-threaded" data-testid="receipts-threaded">
        <h2 className={s.h2}>The 2025 calls, threaded</h2>
        <p className="sec-sub">September 26, 2026. The prediction receipts above, posted as one dated thread.</p>
        <div className={s.receipt}>
          <span className={s.label}>Receipt</span>
          <span className={s.val}>2026-09-26</span> — 6-post thread on <span className={s.val}>@JeramieHicks</span> (X), each call with its original link, signed - NeurOt<br />
          <a className="v2-link" href="https://x.com/JeramieHicks/status/2103830947267314140" {...ext}>x.com/JeramieHicks/status/2103830947267314140</a>
        </div>
        <div className={s.receipt}>
          <span className={s.label}>Receipt</span>
          <span className={s.val}>2026-09-26</span> — the day&apos;s work posted to the personal Facebook profile: the thread, the camper op, the build index<br />
          <a className="v2-link" href="https://www.facebook.com/jeramie.hicks/posts/pfbid02k8Rf4wzJAxodfpdE8pK1vKBY4Y4oqDBeDcsSELLsrxR19bTB8R4vD3VCRU5nWhaNl" {...ext}>facebook.com/jeramie.hicks — Receipt day post</a>
        </div>
      </section>

      <section className={s.cta} data-testid="receipts-cta">
        <h2 className={s.h2}>Want the same treatment on your problem?</h2>
        <p>A Property Opportunity Scan pulls county records, tax and ownership signals, then ranks the targets with owner names attached. One hour of my time, receipts included.</p>
        <a className="v2-btn v2-btn-primary" href={utm(CAL, 'proof-cta-call')} {...ext}>Book a free 10-minute call</a>
        <span className={s.note}>Scan: $100. Dossier: $499. jeramie@neuruh.com</span>
      </section>

      <div className={s.colophon} data-testid="receipts-colophon">
        NEURUH LLC — AI That Executes<br />
        <a href={utm(CAL, 'proof-colophon')} {...ext}>cal.com/neuruh</a> · <a href="mailto:jeramie@neuruh.com">jeramie@neuruh.com</a><br />
        Page last updated 2026-09-26. Every claim above traces to a link on this page.
      </div>
    </div>
  )
}
