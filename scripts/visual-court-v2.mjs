// Visual Court V2 — hero animation frame-integrity captures.
// Captures the first-load timeline at founder-specified viewports and timestamps.
// Usage: node scripts/visual-court-v2.mjs <outDir> [baseUrl] [viewportFilter]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const outDir = process.argv[2] ?? 'visual-court-v2'
const base = process.argv[3] ?? 'http://127.0.0.1:4311'
const only = process.argv[4] // e.g. "1440x900" to run one viewport
mkdirSync(outDir, { recursive: true })

const viewports = [
  [2048, 1200], [1728, 1117], [1440, 900], [1280, 800], [1024, 768], [430, 932], [390, 844],
].filter(([w, h]) => !only || `${w}x${h}` === only)

const marks = [0, 250, 500, 1000, 2000, 5000]

const browser = await chromium.launch()
for (const [w, h] of viewports) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  // Real first-load: no seed/frame pinning — we are judging what a visitor sees.
  const t0 = Date.now()
  await page.goto(`${base}/`, { waitUntil: 'commit' })
  for (const mark of marks) {
    const wait = t0 + mark - Date.now()
    if (wait > 0) await page.waitForTimeout(wait)
    const path = join(outDir, `hero-${w}x${h}-t${String(mark).padStart(4, '0')}.png`)
    try {
      await page.screenshot({ path, timeout: 20000, animations: 'allow' })
    } catch {
      await page.waitForTimeout(60)
      await page.screenshot({ path, timeout: 20000, animations: 'allow' }).catch(() => console.log(`  (t${mark} frame uncapturable)`))
    }
  }
  await page.waitForTimeout(3000)
  await page.screenshot({ path: join(outDir, `hero-${w}x${h}-settled.png`), timeout: 20000, animations: 'allow' })
  console.log(`${w}x${h}: captured ${marks.length + 1} frames`)
  await ctx.close()
}
await browser.close()
