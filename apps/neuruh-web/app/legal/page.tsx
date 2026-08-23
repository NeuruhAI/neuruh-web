import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Privacy and terms for Neuruh.com: a static, read-only site with no accounts, no cookies, and no analytics.',
}

export default function LegalPage() {
  return (
    <main className="semantic-page" id="main">
      <header className="semantic-hero">
        <p className="n-label">Legal</p>
        <h1>Privacy and terms.</h1>
        <p className="t-lede">Short, because the site is simple by design.</p>
      </header>

      <section className="semantic-section" aria-labelledby="privacy">
        <h2 id="privacy">Privacy</h2>
        <ul>
          <li>Neuruh.com is a static, read-only site. It has no accounts, no login, and no forms.</li>
          <li>We set no cookies and run no analytics or third-party trackers.</li>
          <li>Our hosting provider processes standard server logs (IP address, user agent, request path) to serve and secure the site.</li>
          <li>If you email us, we receive what you send and use it only to reply and work with you. Ask and we will delete the thread.</li>
        </ul>
      </section>

      <section className="semantic-section" aria-labelledby="terms">
        <h2 id="terms">Terms</h2>
        <ul>
          <li>Content on this site is informational. It is not legal, financial, or investment advice, and not an offer to sell securities.</li>
          <li>Numbers are published with a classification, an as-of date, and a source reference; they describe the dated snapshot they came from, not a standing guarantee.</li>
          <li>The site is provided as-is, without warranties. Product names and marks belong to their owners.</li>
          <li>Open-source components referenced here are governed by their own licenses in their repositories.</li>
        </ul>
        <p className="source-line">Questions: jeramie@neuruh.com · Effective 2026-08-23.</p>
      </section>
    </main>
  )
}
