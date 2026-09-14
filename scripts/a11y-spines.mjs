// Accessibility court over static output, BOTH spines, desktop + 390px.
// Usage: node a11y-spines.mjs <staticDir> <route,route,...> [label]
// Serves <staticDir> with clean-URL fallback, runs axe-core (wcag2a/aa, 2.1) under
// prefers-color-scheme dark (obsidian) and light (bone), reports serious/critical only
// plus contrast findings, and prints the computed spine attribute so the toggle boot is proven.
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

const [dir, routesArg, label = dir] = process.argv.slice(2)
const routes = routesArg.split(',')
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf', '.jpg': 'image/jpeg' }
async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const candidates = clean === '/' ? ['index.html'] : [clean.slice(1), `${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`]
  for (const c of candidates) {
    const f = path.join(dir, c)
    try { if ((await stat(f)).isFile()) return f } catch {}
  }
  return null
}
const server = http.createServer(async (req, res) => {
  const f = await resolve(req.url)
  if (!f) { res.writeHead(404, { 'content-type': 'text/html' }); res.end('<!doctype html><html><body><main id="main"><h1>404</h1></main></body></html>'); return }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' })
  res.end(await readFile(f))
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch()
let bad = 0
const summary = []
for (const scheme of ['dark', 'light']) {
  for (const [vp, viewport] of [['desktop-1440', { width: 1440, height: 900 }], ['mobile-390', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport, colorScheme: scheme })
    const page = await ctx.newPage()
    for (const route of routes) {
      await page.goto(`${base}${route}`, { waitUntil: 'load', timeout: 30000 })
      await page.waitForTimeout(500)
      const spine = await page.evaluate(() => document.documentElement.getAttribute('data-spine'))
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      const sc = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      const contrast = results.violations.filter((v) => v.id === 'color-contrast')
      bad += sc.length
      const line = `${label} ${route} [${scheme}/${vp}] spine=${spine} body-bg=${bg} → ${sc.length ? 'FAIL ' + sc.map((v) => `${v.impact} ${v.id} (${v.nodes.length}) e.g. ${v.nodes[0]?.target?.[0]} :: ${v.nodes[0]?.failureSummary?.split('\n')[1] ?? ''}`).join(' | ') : 'ok'}${contrast.length && !sc.length ? ` (contrast minor: ${contrast[0].nodes.length})` : ''}`
      console.log(line)
      summary.push(line)
    }
    await ctx.close()
  }
}
await browser.close(); server.close()
console.log(bad ? `A11Y SPINES: FAIL — ${bad} serious/critical across both spines` : 'A11Y SPINES: PASS — zero serious/critical on both spines, both widths')
process.exit(bad ? 1 : 0)
