#!/usr/bin/env node
/**
 * Dead-link court.
 * Every in-site href/src on prerendered pages must resolve to a real route or public file.
 * Stripe cashiers are owned by the checkout-link court and are not followed here.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const HTML_ROOT = 'apps/neuruh-web/.next/server/app'
const PUBLIC_ROOTS = ['apps/neuruh-web/public', 'apps/neuruh-web/app']
const APP_STATIC = new Set(['/icon.svg', '/apple-icon.png', '/opengraph-image.png'])
const SKIP_HOSTS = /book\.stripe\.com|buy\.stripe\.com|checkout\.stripe\.com/
const failures = []

async function walk(dir, files = [], match = () => true) {
  let entries
  try {
    entries = await readdir(dir)
  } catch (error) {
    if (error.code === 'ENOENT') return files
    throw error
  }
  for (const name of entries) {
    const file = path.join(dir, name)
    if ((await stat(file)).isDirectory()) await walk(file, files, match)
    else if (match(file)) files.push(file)
  }
  return files
}

function routeFromHtml(file) {
  const rel = file.slice(HTML_ROOT.length).replace(/\\/g, '/')
  if (rel === '/index.html') return '/'
  return rel.replace(/\.html$/, '').replace(/\/index$/, '') || '/'
}

function normalizeInternal(raw) {
  if (!raw || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) return null
  if (raw.startsWith('#')) return null
  if (raw.startsWith('/_next/')) return null
  if (/^https?:\/\//i.test(raw)) {
    if (SKIP_HOSTS.test(raw)) return null
    try {
      const url = new URL(raw)
      if (url.hostname === 'neuruh.com' || url.hostname === 'www.neuruh.com') {
        return url.pathname.replace(/\/$/, '') || '/'
      }
    } catch {
      return raw
    }
    return { external: raw }
  }
  const [pathOnly] = raw.split(/[?#]/)
  if (!pathOnly || pathOnly === '/') return pathOnly || '/'
  return pathOnly.replace(/\/$/, '') || '/'
}

const htmlFiles = (await walk(HTML_ROOT, [], (file) => file.endsWith('.html')))
  .filter((file) => !file.includes(`${path.sep}_global-error`))
if (!htmlFiles.length) throw new Error('dead-link court FAILED: no prerendered HTML (run build first)')

const routes = new Set(htmlFiles.map(routeFromHtml))
routes.add('/')
for (const extra of APP_STATIC) routes.add(extra)

const publicFiles = new Set()
for (const root of PUBLIC_ROOTS) {
  for (const file of await walk(root, [], () => true)) {
    const rel = file.slice(root.length).replace(/\\/g, '/')
    if ((rel.startsWith('/.') && !rel.startsWith('/.well-known/')) || rel.endsWith('.tsx') || rel.endsWith('.ts')) continue
    publicFiles.add(rel)
  }
}

function exists(internal) {
  if (routes.has(internal)) return true
  if (publicFiles.has(internal)) return true
  if (internal.endsWith('/') && routes.has(internal.slice(0, -1))) return true
  return false
}

let pages = 0
let checked = 0
for (const file of htmlFiles) {
  const route = routeFromHtml(file)
  const html = await readFile(file, 'utf8')
  pages += 1
  const refs = [
    ...html.matchAll(/\b(?:href|src)="([^"]+)"/g),
    ...html.matchAll(/\b(?:href|src)='([^']+)'/g),
  ]
  for (const match of refs) {
    const resolved = normalizeInternal(match[1])
    if (!resolved) continue
    if (resolved.external) continue
    checked += 1
    if (!exists(resolved)) failures.push(`${route} → ${match[1]} (resolved ${resolved})`)
  }
}

if (failures.length) {
  throw new Error(`dead-link court FAILED — ${failures.length} broken\n${failures.join('\n')}`)
}
console.log(`dead-link: PASS — ${pages} pages, ${checked} internal refs, zero broken links`)
