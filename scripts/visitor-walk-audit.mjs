#!/usr/bin/env node
/**
 * Stranger visitor-walk audit harness for the Neuruh Living Digital Twin.
 * Protocol 2026-08-25: cold arrival, autoplay, visible controls only,
 * all stages, physicality, scale, camera, annotations, Story/Reality,
 * Action, Receipt, abuse, WebGL recovery, three loops, viewports,
 * reduced motion / a11y, final comprehension.
 *
 * Usage: node scripts/visitor-walk-audit.mjs [outDir] [baseUrl]
 */
import { chromium, devices } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const outDir = process.argv[2] ?? 'docs/audits/evidence/20260825'
const base = process.argv[3] ?? 'http://127.0.0.1:4311'
mkdirSync(outDir, { recursive: true })

const observations = {
  protocol: 'NEURUH_VISITOR_WALK_AUDIT_20260825',
  base,
  startedAt: new Date().toISOString(),
  sections: {},
}

function shot(name) {
  return join(outDir, `${name}.png`)
}

function record(section, data) {
  observations.sections[section] = { ...(observations.sections[section] ?? {}), ...data }
}

async function waitScene(page, ms = 1800) {
  await page.waitForTimeout(ms)
  await page.locator('main#main').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
}

async function inventoryControls(page) {
  return page.evaluate(() => {
    const visible = (el) => {
      const s = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && r.width > 0 && r.height > 0
    }
    const buttons = [...document.querySelectorAll('button, a.n-btn, [role="button"]')]
      .filter(visible)
      .map((el) => ({
        tag: el.tagName,
        text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 80),
        testid: el.getAttribute('data-testid'),
      }))
    const links = [...document.querySelectorAll('a')]
      .filter(visible)
      .map((el) => ({ text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 80), href: el.getAttribute('href') }))
    const inputs = [...document.querySelectorAll('input, select, textarea, [contenteditable]')]
      .filter(visible)
      .map((el) => ({ tag: el.tagName, type: el.getAttribute('type'), name: el.getAttribute('name') || el.getAttribute('aria-label') }))
    const hiddenKeys = /press t |press r |arrow up|arrow down|keyboard/i.test(document.body.innerText)
    return {
      buttons,
      links: links.slice(0, 40),
      inputs,
      canvasCount: document.querySelectorAll('canvas').length,
      chapterCount: document.querySelectorAll('section[data-chapter]').length,
      chapterIds: [...document.querySelectorAll('section[data-chapter]')].map((n) => n.getAttribute('data-chapter-id')),
      hasPlayPause: buttons.some((b) => /play|pause|stop/i.test(b.text)),
      hasStoryReality: [...buttons, ...links].some((b) => /story|reality/i.test(b.text || b.href || '')),
      hasChapterNav: buttons.some((b) => /next|previous|chapter|stage/i.test(b.text)),
      hiddenKeyHint: hiddenKeys,
      skipLink: !!document.querySelector('a.skip-link'),
      headings: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()),
    }
  })
}

async function chapterSnapshots(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('section[data-chapter]')].map((n) => ({
      n: n.getAttribute('data-chapter'),
      id: n.getAttribute('data-chapter-id'),
      state: n.getAttribute('data-state'),
      renderer: n.getAttribute('data-renderer-state'),
      cam: n.getAttribute('data-cam'),
      truth: n.getAttribute('data-truth-mode'),
      heading: n.querySelector('h1')?.innerText?.trim() ?? '',
      visibleNow: n.getBoundingClientRect().top < innerHeight * 0.75 && n.getBoundingClientRect().bottom > innerHeight * 0.25,
    })),
  )
}

async function sceneMeta(page) {
  return page.evaluate(() => ({
    tier: document.documentElement.getAttribute('data-scene-tier'),
    motion: document.documentElement.getAttribute('data-motion-route'),
    canvas: document.querySelectorAll('canvas').length,
    canvasBox: (() => {
      const c = document.querySelector('canvas')
      if (!c) return null
      const r = c.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    })(),
    harness: window.__neuruhHarness ?? null,
  }))
}

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=metal'] })
const findings = []

function fail(severity, id, title, evidence) {
  findings.push({ severity, id, title, evidence })
}

/* ── 1. COLD ARRIVAL ─────────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'no-preference',
    storageState: undefined,
  })
  const page = await ctx.newPage()
  const consoleErrors = []
  page.on('pageerror', (err) => consoleErrors.push(String(err)))
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })

  const t0 = Date.now()
  await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.screenshot({ path: shot('01-cold-arrival-0ms'), animations: 'disabled' })
  await page.waitForTimeout(250)
  await page.screenshot({ path: shot('01-cold-arrival-250ms') })
  await page.waitForTimeout(250)
  await page.screenshot({ path: shot('01-cold-arrival-500ms') })
  await page.waitForTimeout(500)
  await page.screenshot({ path: shot('01-cold-arrival-1000ms') })
  await page.waitForTimeout(1000)
  await page.screenshot({ path: shot('01-cold-arrival-2000ms') })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: shot('01-cold-arrival-5000ms-settled') })
  const loadMs = Date.now() - t0

  const hero = await page.evaluate(() => {
    const h1 = document.querySelector('[data-chapter="1"] h1')
    const support = document.querySelector('.hero-support')
    const ctas = [...document.querySelectorAll('.hero-ctas a')].map((a) => a.innerText.trim())
    const signal = document.querySelector('.hero-signal')?.innerText?.trim() ?? ''
    const domains = document.querySelector('.hero-domains')?.innerText?.trim() ?? ''
    const nav = [...document.querySelectorAll('header.site-header a')].map((a) => a.innerText.trim())
    const wordmark = document.querySelector('header.site-header .wordmark')?.innerText?.trim() ?? ''
    const overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth
    const h1Box = h1?.getBoundingClientRect()
    const aboveFold = {
      h1: h1Box ? h1Box.bottom < innerHeight : false,
      ctas: [...document.querySelectorAll('.hero-ctas a')].every((a) => a.getBoundingClientRect().bottom < innerHeight),
      signal: (document.querySelector('.hero-signal')?.getBoundingClientRect().bottom ?? 9999) < innerHeight,
    }
    return {
      title: document.title,
      h1: h1?.innerText?.trim() ?? '',
      support: support?.innerText?.trim() ?? '',
      ctas,
      signal,
      domains,
      nav,
      wordmark,
      overflowX,
      aboveFold,
      claimBoundary: document.querySelector('[data-chapter="1"] .claim-boundary')?.innerText?.trim() ?? '',
    }
  })
  const controls = await inventoryControls(page)
  const meta = await sceneMeta(page)

  record('coldArrival', { loadMs, hero, controls, meta, consoleErrors: consoleErrors.slice(0, 20) })
  if (!hero.h1) fail('P0', 'COLD-01', 'Hero has no readable H1 on cold arrival', hero)
  if (!hero.ctas.length) fail('P0', 'COLD-02', 'No visible primary CTA on cold arrival', hero)
  if (hero.overflowX > 8) fail('P1', 'COLD-03', `Horizontal overflow ${hero.overflowX}px on desktop hero`, hero)
  if (!meta.canvas && meta.tier !== '0') fail('P1', 'COLD-04', 'No canvas on capable desktop after settle', meta)
  await ctx.close()
}

/* ── 2. AUTOPLAY ─────────────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page, 1200)
  const before = await page.screenshot({ path: shot('02-autoplay-t0'), type: 'png' })
  await page.waitForTimeout(2200)
  const after = await page.screenshot({ path: shot('02-autoplay-t2200'), type: 'png' })
  const pixelsDiffer = before.compare(after) !== 0
  const hasPause = await page.getByRole('button', { name: /pause|stop|play/i }).count()
  const autoTraceDefault = await page.evaluate(() => new URLSearchParams(location.search).get('trace') === '1')
  record('autoplay', { pixelsDiffer, hasPause, autoTraceDefault, note: 'Scene frameloop is always-on; beads/rotation imply activity without a visitor control.' })
  if (pixelsDiffer && hasPause === 0) {
    fail('P1', 'AUTO-01', 'Scene autoplays with no visible play/pause control', { pixelsDiffer, hasPause })
  }
  await ctx.close()
}

/* ── 3. VISIBLE CONTROLS ONLY ────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page)
  const controls = await inventoryControls(page)
  await page.screenshot({ path: shot('03-visible-controls-hero') })
  // Stranger uses only visible buttons: Explore the systems, See the proof.
  // Do not use T/R/arrows. Scroll is a visible/native affordance.
  const visibleActionNames = controls.buttons.map((b) => b.text).filter(Boolean)
  record('visibleControls', {
    buttons: controls.buttons,
    hasPlayPause: controls.hasPlayPause,
    hasStoryReality: controls.hasStoryReality,
    hasChapterNav: controls.hasChapterNav,
    hiddenKeyHint: controls.hiddenKeyHint,
    visibleActionNames,
    keyboardMapUndiscoverable: !controls.hiddenKeyHint,
  })
  if (!controls.hasChapterNav) {
    fail('P1', 'CTRL-01', 'No visible next/previous/stage control; chapter advance is scroll or hidden keys only', controls)
  }
  if (!controls.hasStoryReality) {
    fail('P1', 'CTRL-02', 'No visible Story/Reality control', { hasStoryReality: false })
  }
  await ctx.close()
}

/* ── 4. ALL STAGES (chapters + pinned renderer/camera) ──────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page)
  const chapters = await chapterSnapshots(page)
  const stageShots = []
  for (const ch of chapters) {
    await page.locator(`#ch${ch.n}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    const name = `04-stage-${String(ch.n).padStart(2, '0')}-${ch.id}`
    await page.screenshot({ path: shot(name) })
    stageShots.push({ ...ch, file: name })
  }
  const rendererStates = ['dormant', 'fragmented', 'awakening', 'metabolism', 'vertical', 'gating', 'receipt', 'entry']
  const cameras = ['wide', 'mid', 'close', 'vertical', 'core']
  const pinned = []
  for (const state of rendererStates) {
    await page.goto(`${base}/?state=${state}&cam=wide&seed=11&frame=90`, { waitUntil: 'networkidle' })
    await waitScene(page, 1400)
    await page.screenshot({ path: shot(`04-renderer-${state}`) })
    pinned.push({ kind: 'renderer', state, file: `04-renderer-${state}` })
  }
  for (const cam of cameras) {
    await page.goto(`${base}/?state=metabolism&cam=${cam}&seed=11&frame=90`, { waitUntil: 'networkidle' })
    await waitScene(page, 1400)
    await page.screenshot({ path: shot(`04-camera-${cam}`) })
    pinned.push({ kind: 'camera', cam, file: `04-camera-${cam}` })
  }
  record('stages', { chapterCount: chapters.length, chapters: stageShots, pinnedCount: pinned.length, expectedVisitorStages: 13 })
  if (chapters.length !== 13) {
    fail('P1', 'STAGE-01', `Visitor can reach ${chapters.length} narrative stages, not 13`, { count: chapters.length, ids: chapters.map((c) => c.id) })
  }
  await ctx.close()
}

/* ── 5–8. PHYSICALITY, SCALE, CAMERA, ANNOTATIONS ───────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(`${base}/?seed=11`, { waitUntil: 'networkidle' })
  await waitScene(page, 2000)
  await page.screenshot({ path: shot('05-physicality-hero-scene') })
  // Crop-ish: full viewport already shows scene on the right.
  const annotationProbe = await page.evaluate(() => {
    const canvases = [...document.querySelectorAll('canvas')]
    const labelsInDom = [...document.querySelectorAll('[data-chapter]')]
      .flatMap((n) => [...n.querySelectorAll('h1, .chapter__n, .claim-boundary, .verb')])
      .map((el) => el.innerText.trim())
    return {
      canvasCount: canvases.length,
      canvasAriaHidden: canvases.every((c) => c.closest('[aria-hidden="true"]')),
      strataWordsInDom: /signal|evidence|decision|authority|receipt/i.test(document.body.innerText),
      sceneTextNodes: [...document.querySelectorAll('[data-testid="scene-canvas-layer"] *')].filter((n) => n.textContent?.trim()).length,
    }
  })
  // Scale: walk cameras and note canvas occupancy vs copy.
  await page.locator('#ch4').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: shot('06-scale-close-organism') })
  await page.locator('#ch8').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: shot('07-camera-core-gating') })
  await page.screenshot({ path: shot('08-annotations-governed-execution') })
  record('physicalityScaleCameraAnnotations', annotationProbe)
  if (!annotationProbe.strataWordsInDom) {
    fail('P1', 'ANNO-01', 'Scene strata labels (signal/evidence/decision/authority/receipt) are not in the semantic DOM; they live only as WebGL sprites', annotationProbe)
  }
  await ctx.close()
}

/* ── 9. STORY / REALITY ──────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page)
  const storyReality = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      hasToggle: !!document.querySelector('[data-mode="story"], [data-mode="reality"], [aria-label*="Story"], [aria-label*="Reality"]'),
      mentionsStory: /\bStory\b/.test(text),
      mentionsReality: /\bReality\b/.test(text),
      truthBadges: [...document.querySelectorAll('[data-truth-mode]')].map((n) => n.getAttribute('data-truth-mode')),
      livingStates: [...document.querySelectorAll('[data-state]')].map((n) => n.getAttribute('data-state')),
    }
  })
  await page.screenshot({ path: shot('09-story-reality-absent-or-present') })
  record('storyReality', storyReality)
  if (!storyReality.hasToggle) {
    fail('P1', 'SR-01', 'No Story/Reality mode control exists for a first-time visitor', storyReality)
  }
  await ctx.close()
}

/* ── 10–11. ACTION + RECEIPT ─────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page)
  const trace = page.getByTestId('trace-start')
  await trace.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  await page.screenshot({ path: shot('10-action-before-trace') })
  await trace.click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: shot('10-action-trace-started') })
  await page.getByTestId('trace-step-S6').waitFor({ state: 'visible' })
  await page.waitForFunction(() => document.querySelector('[data-testid="trace-step-S6"]')?.getAttribute('data-on') === 'true', null, { timeout: 12000 })
  await page.screenshot({ path: shot('11-receipt-trace-complete') })
  const receiptState = await page.evaluate(() => ({
    s6On: document.querySelector('[data-testid="trace-step-S6"]')?.getAttribute('data-on'),
    receiptClass: document.querySelector('[data-testid="trace-step-S6"]')?.className,
    claim: document.querySelector('[data-testid="trace-step-S6"] .trace__claim')?.innerText,
    provenance: document.querySelector('[data-testid="trace-step-S6"] .trace__prov')?.innerText,
    canvasStillPresent: document.querySelectorAll('canvas').length,
  }))
  record('actionReceipt', receiptState)
  if (receiptState.s6On !== 'true') fail('P0', 'ACT-01', 'Sandbox trace did not complete to receipt', receiptState)
  if (!/receipt|NOT_EXECUTED|sandbox/i.test(`${receiptState.claim} ${receiptState.provenance}`)) {
    fail('P1', 'ACT-02', 'Completed hop does not clearly read as a receipt / refusal to a stranger', receiptState)
  }
  await ctx.close()
}

/* ── 12. ABUSE TESTING ───────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const pageErrors = []
  page.on('pageerror', (err) => pageErrors.push(String(err)))
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page)
  await page.getByTestId('trace-start').scrollIntoViewIfNeeded()
  for (let i = 0; i < 12; i++) {
    await page.getByTestId('trace-start').click({ timeout: 2000 }).catch(() => {})
    if (i % 3 === 0) await page.getByTestId('trace-reset').click().catch(() => {})
  }
  await page.keyboard.press('T')
  await page.keyboard.press('T')
  await page.keyboard.press('R')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowUp')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(400)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByTestId('trace-start').click().catch(() => {})
  await page.waitForTimeout(800)
  const stillAlive = await page.locator('main#main').isVisible()
  const chapterCount = await page.locator('section[data-chapter]').count()
  await page.screenshot({ path: shot('12-abuse-after-spam') })
  record('abuse', { stillAlive, chapterCount, pageErrors: pageErrors.slice(0, 10) })
  if (!stillAlive || chapterCount < 11) fail('P0', 'ABUSE-01', 'Abuse clicks/keys/resizes broke the living page', { stillAlive, chapterCount, pageErrors })
  if (pageErrors.length) fail('P1', 'ABUSE-02', 'Page errors during abuse testing', pageErrors)
  await ctx.close()
}

/* ── 13. WEBGL RECOVERY ──────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page, 2000)
  await page.screenshot({ path: shot('13-webgl-before-loss') })
  const before = await sceneMeta(page)
  const lost = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return { ok: false, reason: 'no canvas' }
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return { ok: false, reason: 'no gl' }
    const ext = gl.getExtension('WEBGL_lose_context')
    if (!ext) return { ok: false, reason: 'no WEBGL_lose_context' }
    ext.loseContext()
    return { ok: true }
  })
  await page.waitForTimeout(1200)
  const after = await sceneMeta(page)
  const copyIntact = await page.locator('[data-chapter="1"] h1').isVisible()
  const tier0 = await page.getByTestId('tier0-composition').count()
  await page.screenshot({ path: shot('13-webgl-after-loss') })
  record('webglRecovery', { before, lost, after, copyIntact, tier0 })
  if (!copyIntact) fail('P0', 'WEBGL-01', 'Copy disappeared after WebGL context loss', { after, copyIntact })
  if (lost.ok && after.tier !== '0' && tier0 === 0) {
    fail('P1', 'WEBGL-02', 'Context loss did not drop the scene to authored tier 0', { after, tier0, lost })
  }
  await ctx.close()
}

/* ── 14. THREE FULL LOOPS ────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const loops = []
  for (let loop = 1; loop <= 3; loop++) {
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    await waitScene(page, 800)
    const ids = await page.locator('section[data-chapter]').evaluateAll((nodes) => nodes.map((n) => n.id))
    for (const id of ids) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(180)
    }
    await page.getByTestId('trace-start').scrollIntoViewIfNeeded()
    await page.getByTestId('trace-start').click()
    await page.waitForFunction(() => document.querySelector('[data-testid="trace-step-S6"]')?.getAttribute('data-on') === 'true', null, { timeout: 12000 })
    await page.getByTestId('trace-reset').click()
    await page.waitForFunction(() => document.querySelector('[data-testid="trace-step-S1"]')?.getAttribute('data-on') === 'false', null, { timeout: 4000 })
    const end = await page.locator('#ch11 h1').innerText()
    loops.push({ loop, endHeading: end, ok: true })
    await page.screenshot({ path: shot(`14-loop-${loop}-entry`) })
  }
  record('threeLoops', { loops })
  if (loops.length !== 3 || loops.some((l) => !l.ok)) fail('P0', 'LOOP-01', 'Failed to complete three full stranger loops', loops)
  await ctx.close()
}

/* ── 15. DESKTOP / TABLET / MOBILE ───────────────────────────────────── */
{
  const viewports = [
    ['desktop-1440', { width: 1440, height: 900 }],
    ['tablet-1024', { width: 1024, height: 768 }],
    ['mobile-390', { width: 390, height: 844 }],
  ]
  const routes = [
    ['/', 'home'],
    ['/products', 'products'],
    ['/proof', 'proof'],
    ['/galaxy', 'galaxy'],
    ['/accessible', 'accessible'],
  ]
  const vpResults = []
  for (const [vpName, viewport] of viewports) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: vpName.startsWith('mobile') ? 2 : 1 })
    const page = await ctx.newPage()
    for (const [path, name] of routes) {
      await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 })
      await waitScene(page, 1200)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      const h1 = await page.locator('h1').first().innerText().catch(() => '')
      await page.screenshot({ path: shot(`15-${name}-${vpName}`) })
      vpResults.push({ vpName, name, overflow, h1: h1.slice(0, 80) })
      if (overflow > 12) fail('P1', `VP-${vpName}-${name}`, `Horizontal overflow ${overflow}px`, { path, overflow })
    }
    await ctx.close()
  }
  // Mobile cold arrival specifically
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const mpage = await mobile.newPage()
  await mpage.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(mpage, 1500)
  await mpage.screenshot({ path: shot('15-mobile-cold-arrival') })
  const mobileHero = await mpage.evaluate(() => {
    const nav = document.querySelector('header.site-header')?.getBoundingClientRect()
    const h1 = document.querySelector('[data-chapter="1"] h1')?.getBoundingClientRect()
    const ctas = [...document.querySelectorAll('.hero-ctas a')].map((a) => {
      const r = a.getBoundingClientRect()
      return { text: a.innerText.trim(), top: r.top, bottom: r.bottom, inFold: r.bottom < innerHeight }
    })
    return {
      navHeight: nav?.height,
      h1Top: h1?.top,
      h1CoveredByNav: h1 && nav ? h1.top < nav.bottom : null,
      ctas,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })
  record('viewports', { vpResults, mobileHero })
  if (mobileHero.h1CoveredByNav) fail('P1', 'VP-MOBILE-01', 'Hero H1 is covered by the header on mobile', mobileHero)
  if (mobileHero.overflowX > 12) fail('P1', 'VP-MOBILE-02', `Mobile horizontal overflow ${mobileHero.overflowX}px`, mobileHero)
  await mobile.close()
}

/* ── 16. REDUCED MOTION / ACCESSIBILITY ──────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(base + '/reduced-motion', { waitUntil: 'networkidle' })
  await waitScene(page, 1200)
  await page.screenshot({ path: shot('16-reduced-motion-route') })
  const reduced = await page.evaluate(() => ({
    motion: document.documentElement.getAttribute('data-motion-route'),
    chapters: document.querySelectorAll('section[data-chapter]').length,
    h1: document.querySelector('[data-chapter="1"] h1')?.innerText,
  }))
  await page.goto(base + '/accessible', { waitUntil: 'networkidle' })
  await waitScene(page, 800)
  await page.screenshot({ path: shot('16-accessible-route') })
  const accessibleCanvas = await page.locator('canvas').count()
  await page.goto(base + '/no-webgl', { waitUntil: 'networkidle' })
  await page.screenshot({ path: shot('16-no-webgl-route') })
  const noWebglCanvas = await page.locator('canvas').count()

  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page, 1500)
  await page.keyboard.press('Tab')
  const skipFocused = await page.evaluate(() => document.activeElement?.classList.contains('skip-link') || document.activeElement?.classList.contains('global-skip'))
  await page.screenshot({ path: shot('16-skip-link-focus') })
  let axe
  try {
    axe = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze()
  } catch (err) {
    axe = { error: String(err) }
  }
  // Color contrast separately so we still record it.
  let axeContrast
  try {
    axeContrast = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
  } catch (err) {
    axeContrast = { error: String(err) }
  }
  record('a11y', {
    reduced,
    accessibleCanvas,
    noWebglCanvas,
    skipFocused,
    axeViolations: axe.violations?.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })) ?? axe,
    contrastViolations: axeContrast.violations?.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })) ?? axeContrast,
  })
  if (reduced.motion !== 'reduced') fail('P1', 'A11Y-01', 'Reduced-motion route did not set data-motion-route=reduced', reduced)
  if (accessibleCanvas !== 0) fail('P0', 'A11Y-02', 'Accessible route loaded a canvas', { accessibleCanvas })
  if (noWebglCanvas !== 0) fail('P0', 'A11Y-03', 'No-WebGL route loaded a canvas', { noWebglCanvas })
  const serious = (axe.violations ?? []).filter((v) => v.impact === 'critical' || v.impact === 'serious')
  if (serious.length) fail('P1', 'A11Y-04', `axe serious/critical violations: ${serious.map((v) => v.id).join(', ')}`, serious)
  await ctx.close()
}

/* ── 17. FINAL COMPREHENSION (stranger, visible copy only) ───────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitScene(page, 1500)
  const foldCopy = await page.evaluate(() => {
    const fold = innerHeight
    const nodes = [...document.querySelectorAll('h1, h2, p, a.n-btn, .hero-signal, .hero-domains, .claim-boundary')]
    return nodes
      .filter((n) => {
        const r = n.getBoundingClientRect()
        return r.top < fold && r.bottom > 0 && getComputedStyle(n).visibility !== 'hidden'
      })
      .map((n) => ({ tag: n.tagName, text: n.innerText.trim().slice(0, 240) }))
  })
  await page.goto(base + '/products', { waitUntil: 'networkidle' })
  const productsH1 = await page.locator('h1').innerText()
  await page.screenshot({ path: shot('17-products-comprehension') })
  await page.goto(base + '/proof', { waitUntil: 'networkidle' })
  const proofH1 = await page.locator('h1').innerText()
  await page.screenshot({ path: shot('17-proof-comprehension') })
  const answers = {
    whatIsNeuruh: foldCopy.find((n) => n.tag === 'H1')?.text ?? '',
    howItWorks: foldCopy.find((n) => n.tag === 'P' && /governed|receipt|authority/i.test(n.text))?.text ?? '',
    whatCanIDo: foldCopy.filter((n) => n.tag === 'A').map((n) => n.text),
    isItLive: foldCopy.some((n) => /LIVE connectivity|NONE|verified snapshot|claim boundary/i.test(n.text)),
    productsH1,
    proofH1,
    foldCopy,
  }
  record('comprehension', answers)
  if (!/governed|AI|receipt/i.test(answers.whatIsNeuruh + answers.howItWorks)) {
    fail('P0', 'COMP-01', 'A stranger cannot extract what Neuruh is from the first viewport', answers)
  }
  await ctx.close()
}

observations.finishedAt = new Date().toISOString()
observations.findings = findings
observations.p0 = findings.filter((f) => f.severity === 'P0')
observations.p1 = findings.filter((f) => f.severity === 'P1')
writeFileSync(join(outDir, 'observations.json'), JSON.stringify(observations, null, 2))
console.log(JSON.stringify({ p0: observations.p0.length, p1: observations.p1.length, findings: findings.map((f) => `${f.severity} ${f.id} ${f.title}`) }, null, 2))
await browser.close()
