// Cashier price court — the price a buyer is shown on neuruh.com must be the price the
// live cashier actually charges. verify-checkout-links.mjs proves the link resolves; it
// does not read the amount, so a price edit on the site or in Stripe could drift silently.
//
// Stripe payment links render client-side and never reach networkidle, so this loads with
// domcontentloaded and waits for an amount to appear in the DOM. It only reads the page —
// nothing is submitted.
//
// Usage: node scripts/verify-cashier-prices.mjs
import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const source = await readFile('apps/neuruh-web/lib/publicOffers.ts', 'utf8')
const offers = [...source.matchAll(/id:\s*'([^']+)'[\s\S]*?price:\s*'([^']+)'[\s\S]*?href:\s*'(https:\/\/book\.stripe\.com[^']+)'/g)]
  .map(([, id, price, href]) => ({ id, price, href }))

if (offers.length === 0) throw new Error('cashier-price: no priced offers found in publicOffers.ts')

const normalise = (value) => value.replace(/[$,]/g, '').replace(/\.00$/, '')
const browser = await chromium.launch()
const failures = []
try {
  for (const offer of offers) {
    const page = await browser.newPage()
    try {
      await page.goto(offer.href, { waitUntil: 'domcontentloaded', timeout: 40000 })
      await page.waitForFunction(() => /\$[0-9]/.test(document.body.innerText), { timeout: 30000 })
      const text = await page.evaluate(() => document.body.innerText)
      const shown = [...new Set(text.match(/\$[0-9][0-9,]*(?:\.[0-9]{2})?/g) ?? [])]
      if (shown.some((amount) => normalise(amount) === normalise(offer.price))) {
        console.log(`cashier-price: ${offer.id} ${offer.price} matches the live cashier`)
      } else {
        failures.push(`${offer.id}: site advertises ${offer.price}, cashier shows ${shown.join(' ') || '<no amount rendered>'}`)
      }
    } catch (error) {
      failures.push(`${offer.id}: ${String(error).split('\n')[0]}`)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}

if (failures.length) throw new Error(`Cashier price court failed:\n${failures.map((f) => `  - ${f}`).join('\n')}`)
console.log(`cashier-price: PASS — ${offers.length} cashiers charge what the site advertises`)
