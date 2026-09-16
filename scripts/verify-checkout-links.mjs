#!/usr/bin/env node
/**
 * Checkout-link court.
 * The only legal cashiers are the three SHIP-001 Stripe payment links.
 * Do not invent new book.stripe.com URLs. Do not create Stripe objects.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const CANONICAL_CASHIERS = [
  { id: 'O01', price: '$299', href: 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04' },
  { id: 'O02', price: '$499', href: 'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05' },
  { id: 'O05', price: '$1250', href: 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06' },
]

const ALLOWED = new Set(CANONICAL_CASHIERS.map((item) => item.href))
const STRIPE_RE = /https:\/\/(?:book|buy|checkout)\.stripe\.com\/[A-Za-z0-9]+/g
const SOURCE_ROOTS = ['apps/neuruh-web/app', 'apps/neuruh-web/components', 'apps/neuruh-web/lib']
const SOURCE_EXTENSIONS = /\.(tsx|ts|css)$/
const HTML_ROOT = 'apps/neuruh-web/.next/server/app'
const COMMERCIAL_HTML = ['index', 'offers', 'ask', 'work-with-neuruh']
const failures = []

async function walk(dir, files = []) {
  for (const name of await readdir(dir)) {
    const file = path.join(dir, name)
    if ((await stat(file)).isDirectory()) await walk(file, files)
    else if (SOURCE_EXTENSIONS.test(file)) files.push(file)
  }
  return files
}

function collect(label, text, bag) {
  const found = text.match(STRIPE_RE) ?? []
  for (const href of found) {
    bag.push({ label, href })
    if (!ALLOWED.has(href)) failures.push(`${label}: illegal cashier ${href}`)
  }
}

const catalog = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
const ask = await readFile('apps/neuruh-web/lib/askRecommendations.ts', 'utf8')
for (const offer of CANONICAL_CASHIERS) {
  if (!catalog.includes(`id: '${offer.id}'`)) failures.push(`catalog missing ${offer.id}`)
  if (!catalog.includes(`price: '${offer.price}'`)) failures.push(`catalog price drift ${offer.id}`)
  if ([...catalog.matchAll(new RegExp(offer.href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))].length !== 1) {
    failures.push(`catalog must carry ${offer.id} href exactly once`)
  }
}

// The Forensic System Audit is the fourth canon offer. It has NO cashier: it books a
// 90-minute scoping session on Cal.com. If it ever acquires a Stripe link or a dollar
// figure that must come through a founder pricing decision, so the court fails closed.
const forensicBlock = catalog.slice(catalog.indexOf("id: 'FSA'"), catalog.indexOf('export type PublicOffer'))
if (!forensicBlock.includes("kind: 'booking'")) failures.push('Forensic System Audit must be a booking, not a cashier')
if (!forensicBlock.includes('https://cal.com/neuruh/forensic-scope-session-90')) failures.push('Forensic System Audit must book cal.com/neuruh/forensic-scope-session-90')
if (STRIPE_RE.test(forensicBlock)) failures.push('Forensic System Audit carries a Stripe cashier')
STRIPE_RE.lastIndex = 0
if (/\$\s?\d/.test(forensicBlock)) failures.push('Forensic System Audit carries a dollar amount')
if ((catalog.match(/id: 'O0/g) ?? []).length !== 3) failures.push('cashier catalog must stay exactly 3 cashiers')
if ((catalog.match(/^\s*kind: 'cashier',$/gm) ?? []).length !== 3) failures.push('exactly three offers may carry a cashier')
// The Cal.com ladder prints no paid rate: rates are not in canon and Cal.com shows them at booking.
const ladder = catalog.slice(catalog.indexOf('PUBLIC_CALLS'), catalog.indexOf('OFFER_NEXT_STEPS'))
if (/\$\s?\d/.test(ladder)) failures.push('Cal.com ladder prints a rate that is not in canon')
if (!ladder.includes("rate: 'Free'")) failures.push('Cal.com ladder must carry the free qualifying call')
if (!/quick-chat-10-mins|15min|30-min-paid-consulting|1-hr-paid-consulting/.test(ladder)) failures.push('Cal.com ladder slugs missing')

if ((ask.match(/lane: '/g) ?? []).length !== 3) failures.push('Ask Neuruh must emit exactly 3 lanes')
if (!ask.includes("ASK_LANES = ['FASTEST', 'BEST VALUE', 'CUSTOM']")) {
  failures.push('Ask Neuruh lanes must remain FASTEST / BEST VALUE / CUSTOM')
}

const sourceHits = []
for (const root of SOURCE_ROOTS) {
  for (const file of await walk(root)) collect(file, await readFile(file, 'utf8'), sourceHits)
}

const htmlHits = []
for (const route of COMMERCIAL_HTML) {
  const file = path.join(HTML_ROOT, `${route}.html`)
  try {
    collect(`html:${route}`, await readFile(file, 'utf8'), htmlHits)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

for (const offer of CANONICAL_CASHIERS) {
  if (!sourceHits.some((hit) => hit.href === offer.href)) failures.push(`source missing cashier ${offer.id}`)
  if (htmlHits.length && !htmlHits.some((hit) => hit.href === offer.href)) {
    failures.push(`built commercial HTML missing cashier ${offer.id}`)
  }
}

const skipLive = process.env.CHECKOUT_LINK_SKIP_LIVE === '1'
if (!skipLive) {
  for (const offer of CANONICAL_CASHIERS) {
    let status = 0
    try {
      const response = await fetch(offer.href, { method: 'HEAD', redirect: 'manual' })
      status = response.status
      if (status === 405 || status === 403) {
        const fallback = await fetch(offer.href, { method: 'GET', redirect: 'manual' })
        status = fallback.status
      }
    } catch (error) {
      failures.push(`${offer.id} live cashier unreachable: ${error.message}`)
      continue
    }
    if (status < 200 || status >= 400) failures.push(`${offer.id} live cashier HTTP ${status}`)
    else console.log(`checkout-link: ${offer.id} live HTTP ${status}`)
  }
}

if (failures.length) {
  throw new Error(`checkout-link court FAILED\n${failures.join('\n')}`)
}
const htmlMode = htmlHits.length ? `built HTML (${htmlHits.length} refs)` : 'source + live only (no build output present)'
console.log(`checkout-link: PASS — ${CANONICAL_CASHIERS.length} existing cashiers only, Forensic System Audit books on Cal.com with no cashier, Ask output max 3 [${htmlMode}]`)
