// Accessibility court — axe-core over every public route at desktop and mobile widths.
// Usage: node scripts/a11y-court.mjs [baseUrl]
import { chromium } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

const base = process.argv[2] ?? 'http://127.0.0.1:4311'
const routes = [
  '/', '/accessible', '/no-webgl', '/reduced-motion', '/how-it-works', '/worlds/liquidity-engine', '/proof', '/proof/distribution', '/refusals', '/products',
  '/offers', '/ask', '/work-with-neuruh', '/work-with-us', '/thank-you', '/cases', '/security',
  '/open-source', '/worlds', '/worlds/deedsonar', '/worlds/bookeit', '/organism', '/galaxy',
  '/research/adaptive-intelligence', '/research/case-zero', '/founder', '/contact', '/legal',
  '/products/top10', '/harnesses',
  '/products/top10/agent-integrity', '/products/top10/ai-estate-forensic', '/products/top10/property-opportunity-scan',
  '/products/top10/opportunity-intelligence-dossier', '/products/top10/business-acquisition-intelligence', '/products/top10/data-rescue',
  '/products/top10/workflow-replacement', '/products/top10/proofos', '/products/top10/managed-opportunity-desk', '/products/top10/findsellprofit',
  '/definitely-missing-route-404',
]
const viewports = [
  ['desktop-1440', { width: 1440, height: 900 }],
  ['mobile-390', { width: 390, height: 844 }],
]

let seriousOrCritical = 0
const browser = await chromium.launch()
for (const [vpName, viewport] of viewports) {
  const ctx = await browser.newContext({ viewport })
  const page = await ctx.newPage()
  for (const route of routes) {
    await page.goto(`${base}${route}?seed=11&frame=120`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(1200)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    const minor = results.violations.filter((v) => v.impact !== 'serious' && v.impact !== 'critical')
    if (bad.length) {
      seriousOrCritical += bad.length
      for (const v of bad) console.log(`FAIL ${route} [${vpName}] ${v.impact} ${v.id}: ${v.help} (${v.nodes.length} nodes) e.g. ${v.nodes[0]?.target?.[0]}`)
    } else {
      console.log(`ok ${route} [${vpName}]${minor.length ? ` (${minor.length} minor: ${minor.map((v) => v.id).join(',')})` : ''}`)
    }
  }
  await ctx.close()
}
await browser.close()
console.log(seriousOrCritical ? `A11Y COURT: FAIL — ${seriousOrCritical} serious/critical` : 'A11Y COURT: PASS — zero serious/critical violations')
process.exit(seriousOrCritical ? 1 : 0)
