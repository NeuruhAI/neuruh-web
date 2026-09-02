#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const base = process.argv[2] ?? 'http://127.0.0.1:4311'
const routes = ['/', '/offers', '/proof', '/thank-you', '/work-with-neuruh', '/work-with-us', '/security']
const dir = 'receipts/mobile-390-20260902'
await mkdir(dir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const notes = []
for (const route of routes) {
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 })
  const cta = page.locator('header.hdr a.work-cta')
  const box = await cta.boundingBox()
  const clip = box ? box.x + box.width > 390 + 1 || box.y < 0 : true
  const wrap = box ? box.height > 48 : false
  const shot = `${dir}${route === '/' ? '/home' : route.replaceAll('/', '-')}.png`
  await page.screenshot({ path: shot, fullPage: false })
  notes.push({
    route,
    workCtaBox: box,
    overflowsViewport: clip,
    stackedTallerThanOneLine: wrap,
    heading: await page.locator('h1').first().innerText(),
    shot,
  })
}
await browser.close()
const md = [
  '# 390px mobile visual notes — 2026-09-02',
  '',
  `Candidate served at \`${base}\`. Viewport 390×844. Work-with-us CTA measured; screenshots in \`${dir}/\`.`,
  '',
  '| Route | Heading | CTA box | Overflows 390 | Shot |',
  '| --- | --- | --- | --- | --- |',
  ...notes.map((n) => {
    const box = n.workCtaBox ? `${Math.round(n.workCtaBox.x)},${Math.round(n.workCtaBox.y)} ${Math.round(n.workCtaBox.width)}×${Math.round(n.workCtaBox.height)}` : 'missing'
    return `| ${n.route} | ${n.heading.replaceAll('|', '/')} | ${box} | ${n.overflowsViewport ? 'YES' : 'no'} | ${n.shot} |`
  }),
  '',
  'Cashiers were not clicked. This is a visual wrap/clip court only.',
].join('\n')
await writeFile(`${dir}/NOTES.md`, md)
console.log(md)
