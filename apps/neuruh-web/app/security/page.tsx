import Link from 'next/link'
import { pageMeta } from '../../lib/publicSeo'

export const metadata = pageMeta({
  path: '/security',
  title: 'Security disclosure',
  description:
    'Public-safe disclosure path for neuruh.com: this page, the contact page, and jeramie@neuruh.com. No autoresponder, no secrets by mail.',
})

export default function SecurityPage() {
  return (
    <main id="main">
      <section className="sec" aria-labelledby="security-h">
        <div className="sec-inner">
          <p className="sec-eyebrow">Security</p>
          <h1 className="sec-h" id="security-h" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>
            Public-safe disclosure.
          </h1>
          <p className="sec-sub">
            This website is a static export. Mail to <strong>jeramie@neuruh.com</strong> is forwarded to the founder&apos;s
            inbox; there is no autoresponder and no automated reply. Do not send secrets, tokens, credentials, or
            exploit details by email — state that a disclosure exists and a person will arrange a channel.
          </p>
          <p className="sec-sub">
            The public disclosure path is this page and{' '}
            <Link className="v2-link" href="/contact">/contact</Link>. State that the note is a security disclosure.
            Do not include secrets, payloads, or factory internals. This site does not link private GitHub repositories.
          </p>
          <p className="sec-sub">
            Machine-readable pointer:{' '}
            <a className="v2-link" href="/.well-known/security.txt">/.well-known/security.txt</a>.
          </p>
        </div>
      </section>
    </main>
  )
}
