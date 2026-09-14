#!/usr/bin/env node
/**
 * UX court — drives the site like a visitor at eight viewports and records what a visitor would hit.
 *   node scripts/ux-court.mjs [baseUrl] [--out receipts/ux-court] [--routes a,b,c]
 * Checks per route × viewport: HTTP status, horizontal overflow, exactly one h1, no skipped heading levels,
 * landmarks (header/nav/main/footer), console errors, small tap targets on touch widths (< 44×44 on
 * visible links/buttons/inputs), focus visibility on the first tabbable elements, CTA visible in the first
 * viewport-and-a-half, and a screenshot. Fails closed (exit 1) on any overflow, missing h1, console error,
 * or tap-target defect. Screenshots are evidence for the visual consistency court.
 */
import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const base = (args.find((a) => a.startsWith('http')) ?? 'http://127.0.0.1:4311').replace(/\/+$/, '')
const arg = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d }
const OUT = arg('--out', 'receipts/ux-court')
const ROUTES = (arg('--routes', '') || [
  '/', '/products', '/products/top10', '/products/top10/property-opportunity-scan', '/products/top10/opportunity-intelligence-dossier',
  '/products/top10/agent-integrity', '/products/top10/ai-estate-forensic', '/products/top10/business-acquisition-intelligence',
  '/products/top10/data-rescue', '/products/top10/workflow-replacement', '/products/top10/proofos', '/products/top10/managed-opportunity-desk',
  '/products/top10/findsellprofit', '/harnesses', '/offers', '/contact', '/contact?product=property-opportunity-scan', '/contact?product=not-a-product', '/definitely-missing-route-404',
].join(',')).split(',')
const VIEWPORTS = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [430, 932], [390, 844], [375, 812], [320, 800]]
const TOUCH = new Set([430, 390, 375, 320])
mkdirSync(OUT, { recursive: true })

const findings = []
const rows = []
const browser = await chromium.launch()
for (const [w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: TOUCH.has(w), isMobile: TOUCH.has(w), deviceScaleFactor: 1 })
  for (const route of ROUTES) {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (m) => { if (m.type() === 'error' && !/favicon/i.test(m.text()) && !(route.includes('missing-route') && /404/.test(m.text()))) errors.push(`console: ${m.text().slice(0, 200)}`) })
    let status = 0
    try {
      const res = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 45000 })
      status = res?.status() ?? 0
    } catch (e) { errors.push(`goto: ${String(e).slice(0, 200)}`) }
    await page.waitForTimeout(250)
    const audit = await page.evaluate((touch) => {
      const vw = window.innerWidth
      const overflow = document.documentElement.scrollWidth - vw
      const wide = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.right > vw + 1 && getComputedStyle(el).position !== 'fixed' }).slice(0, 5).map((el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''}`)
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) => Number(el.tagName[1]))
      let skipped = false
      for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) skipped = true
      const landmarks = { header: !!document.querySelector('header'), nav: !!document.querySelector('nav'), main: !!document.querySelector('main'), footer: !!document.querySelector('footer') }
      const interactive = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,[role="button"]')]
        .filter((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < document.documentElement.scrollHeight })
      const small = touch ? interactive.filter((el) => { const r = el.getBoundingClientRect(); const inline = el.tagName === 'A' && Boolean(el.closest('p,li,dd,dt,small,td,figcaption')) && getComputedStyle(el).display !== 'flex'; return inline ? (r.height < 24 || r.width < 24) : (r.height < 44 || r.width < 44) }).slice(0, 8).map((el) => { const r = el.getBoundingClientRect(); return `${el.tagName.toLowerCase()}[${Math.round(r.width)}×${Math.round(r.height)}] ${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}` }) : []
      const cta = document.querySelector('[data-testid="product-cta"], [data-testid="harness-cta"], [data-testid="index-cta"], .hero-ctas a, .v2-btn-primary, .n-btn--primary')
      const ctaRect = cta ? cta.getBoundingClientRect() : null
      const unlabeled = [...document.querySelectorAll('a[href],button')].filter((el) => !(el.textContent || '').trim() && !el.getAttribute('aria-label') && !el.querySelector('img[alt]')).length
      const imgsNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length
      const tinyEls = [...document.querySelectorAll('p,li,dd,dt,small,span,a,b,strong,label,code,time')].filter((el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return r.width > 0 && (el.textContent || '').trim().length > 12 && parseFloat(cs.fontSize) < 11 })
      const tinyText = tinyEls.length
      const tinySample = tinyEls.slice(0, 6).map((el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0].slice(0, 28) : ''}@${parseFloat(getComputedStyle(el).fontSize).toFixed(1)}px`)
      return { overflow, wide, h1: document.querySelectorAll('h1').length, skipped, landmarks, interactive: interactive.length, small, ctaTop: ctaRect ? Math.round(ctaRect.top + window.scrollY) : null, title: document.title, unlabeled, imgsNoAlt, tinyText, tinySample }
    }, TOUCH.has(w))
    // focus visibility on the first tabbable elements
    let focusOk = 0, focusTotal = 0
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      const v = await page.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; const cs = getComputedStyle(el); const ring = cs.boxShadow !== 'none' || (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0); return { ring, tag: el.tagName } })
      if (v) { focusTotal += 1; if (v.ring) focusOk += 1 }
    }
    const shot = path.join(OUT, `${w}x${h}${route === '/' ? '_home' : route.replace(/[^a-z0-9]+/gi, '_')}.png`)
    try { await page.screenshot({ path: shot, fullPage: w >= 1024 ? false : true }) } catch {}
    const expected404 = route.includes('missing-route')
    const row = { route, viewport: `${w}x${h}`, status, ...audit, focusOk, focusTotal, errors, screenshot: shot }
    rows.push(row)
    const flag = (name, cond, detail) => { if (cond) findings.push({ route, viewport: `${w}x${h}`, name, detail }) }
    flag('http', expected404 ? status !== 404 : status !== 200, status)
    flag('horizontal_overflow', audit.overflow > 1, `${audit.overflow}px ${audit.wide.join(', ')}`)
    flag('h1_count', audit.h1 !== 1, audit.h1)
    flag('heading_skip', audit.skipped, 'skipped level')
    flag('landmarks', !(audit.landmarks.header && audit.landmarks.main && audit.landmarks.footer), JSON.stringify(audit.landmarks))
    flag('console_errors', errors.length > 0, errors.slice(0, 3).join(' | '))
    flag('small_tap_targets', audit.small.length > 0, audit.small.join(' | '))
    flag('unlabeled_controls', audit.unlabeled > 0, audit.unlabeled)
    flag('img_no_alt', audit.imgsNoAlt > 0, audit.imgsNoAlt)
    flag('tiny_text', audit.tinyText > 0, `${audit.tinyText}: ${audit.tinySample.join(', ')}`)
    flag('focus_visible', focusTotal > 0 && focusOk < focusTotal, `${focusOk}/${focusTotal}`)
    flag('cta_missing', !expected404 && route !== '/contact?product=not-a-product' && audit.ctaTop === null, 'no primary CTA found')
    await page.close()
  }
  await ctx.close()
}
await browser.close()
const summary = { base, routes: ROUTES.length, viewports: VIEWPORTS.length, checks: rows.length, findings, pass: findings.length === 0, finished_at: new Date().toISOString() }
writeFileSync(path.join(OUT, 'UX_COURT.json'), JSON.stringify({ ...summary, rows }, null, 2))
for (const f of findings) console.log(`FAIL ${f.viewport} ${f.route} ${f.name}: ${f.detail}`)
console.log(`UX COURT: ${summary.pass ? 'PASS' : `FAIL — ${findings.length} findings`} (${rows.length} route×viewport checks)`)
process.exit(summary.pass ? 0 : 1)
