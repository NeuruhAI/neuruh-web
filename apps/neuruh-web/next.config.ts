import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Every route is prerendered static; deployment ships the exported tree.
  // Local courts run the Next server (headers() below), so export is opt-in:
  // production hosting serves the same headers from vercel.json instead.
  output: process.env.NEXT_OUTPUT_EXPORT ? 'export' : undefined,
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(process.cwd(), '../..'),
  turbopack: { root: path.join(process.cwd(), '../..') },
  // CSP note only: do not invent a Content-Security-Policy here. Cashiers
  // are hosted Stripe Payment Links (book.stripe.com). A guessed CSP would
  // break checkout without proving a security property this static export owns.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ],
      },
    ]
  },
}

export default nextConfig
