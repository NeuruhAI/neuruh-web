import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(process.cwd(), '../..'),
  turbopack: { root: path.join(process.cwd(), '../..') },
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
