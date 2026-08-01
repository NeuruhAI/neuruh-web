import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(process.cwd(), '../..'),
  turbopack: { root: path.join(process.cwd(), '../..') },
}

export default nextConfig
