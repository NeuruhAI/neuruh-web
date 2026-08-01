/**
 * Shared measurement procedure.
 *
 * One place, so every number in every benchmark is produced the same way and a
 * difference between two rows is a difference in the scene rather than in how
 * it was measured.
 */

import { expect, type Browser, type Page, type Response } from '@playwright/test'
import type { FrameStats, PayloadStats, SceneCensus, TimingStats, Diagnostics } from '../spatial-runtime/harness/metrics'

export interface RunResult {
  label: string
  url: string
  params: Record<string, string | number | boolean>
  timing: TimingStats
  payload: PayloadStats
  census: SceneCensus | null
  meta: Record<string, unknown>
  frames: {
    /** Frame INTERVAL under vsync. Tells you about dropped frames, not headroom. */
    raf: FrameStats
    /** Uncapped, GPU-fenced frame COST. Conservative upper bound. */
    sync: FrameStats
    /** True GPU time — the MEDIAN pass (by p95) of `gpuTimerPasses`. */
    gpuTimer: FrameStats | null
    /**
     * All GPU-timer passes taken within this page load.
     *
     * Cross-load p95 variance of ~20% was observed on identical configs, so a
     * single 40-frame pass cannot decide a budget question. Three passes are
     * taken 600 ms apart within the load; the spread across them is reported
     * alongside the median rather than averaged away. (Three separate page
     * loads per config was tried first and crashed the browser: each DPR-2
     * transmission load allocates a ~209 MB render target, and hammering
     * fresh contexts with those on an 8 GB machine killed the GPU process.)
     */
    gpuTimerPasses: FrameStats[] | null
  }
  diagnostics: Diagnostics
  errors: string[]
  consoleErrors: string[]
  /** Bytes counted by Playwright's network layer, independent of the page. */
  network: { transferredBytes: number; requestCount: number; failures: string[] }
}

export function buildUrl(path: string, params: Record<string, string | number | boolean>): string {
  const u = new URL(path, 'http://127.0.0.1:4310')
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, String(v))
  return u.pathname + u.search
}

/** Attach network accounting before navigation. Returns a collector. */
export function watchNetwork(page: Page) {
  let transferredBytes = 0
  let requestCount = 0
  const failures: string[] = []
  const consoleErrors: string[] = []

  const onResponse = async (res: Response) => {
    requestCount++
    try {
      const sizes = await res.request().sizes()
      transferredBytes += sizes.responseBodySize + sizes.responseHeadersSize
    } catch {
      /* a redirected or cached response may not expose sizes */
    }
    if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`)
  }
  page.on('response', onResponse)
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text())
  })
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`))

  return {
    result: () => ({ transferredBytes, requestCount, failures }),
    consoleErrors,
  }
}

/** Waits for the harness to report a presented first frame. */
export async function waitForScene(page: Page, timeout = 30_000) {
  await page.waitForFunction(() => window.__NEURUH_SPIKE__?.ready === true, undefined, { timeout })
}

/**
 * The measurement run.
 *
 * settleMs lets the camera dolly and the state easing finish before anything is
 * recorded. Measuring during the transition would report the cost of an
 * animation rather than the cost of the state.
 */
export async function measureRun(
  browser: Browser,
  path: string,
  params: Record<string, string | number | boolean>,
  opts: { label: string; settleMs?: number; rafMs?: number; syncFrames?: number; gpuPasses?: number } = {
    label: 'run',
  },
): Promise<RunResult & { page: Page; close: () => Promise<void> }> {
  const settleMs = opts.settleMs ?? 2500
  const rafMs = opts.rafMs ?? 3000
  const syncFrames = opts.syncFrames ?? 160
  const gpuPassCount = opts.gpuPasses ?? 3

  // A FRESH CONTEXT PER RUN, deliberately.
  //
  // Reusing one page across the matrix gives every run after the first a warm
  // HTTP cache, so transferSize collapses to 0 and the payload numbers describe
  // a repeat visit rather than a first one. It also leaves the paint timeline
  // of the previous document in place, which produced first-contentful-paint
  // figures in the tens of seconds on the first version of this harness.
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  const close = async () => {
    await context.close()
  }

  const net = watchNetwork(page)
  const url = buildUrl(path, params)

  try {
    await page.goto(url, { waitUntil: 'load' })
    // Rendering is throttled while the window is occluded, which distorts paint
    // timing and frame intervals both.
    await page.bringToFront()
    await waitForScene(page)
    await page.waitForTimeout(settleMs)

    // 1) rAF intervals — dropped-frame evidence, vsync-capped. Re-front first:
    // a fresh context opens a new window and an occluded page throttles rAF to
    // zero, which is how two rows in an early pass recorded 0 samples.
    await page.bringToFront()
    await page.evaluate(() => window.__NEURUH_SPIKE__!.startRafRecording())
    await page.waitForTimeout(rafMs)
    const raf = await page.evaluate(() => window.__NEURUH_SPIKE__!.stopRafRecording())

    // 2) Uncapped GPU-fenced cost, in batches so the main thread never stalls
    //    long enough for the browser to intervene.
    await page.evaluate(() => window.__NEURUH_SPIKE__!.pauseLoop())
    await page.waitForTimeout(120)
    await page.evaluate(() => window.__NEURUH_SPIKE__!.measureSyncBatch(0, 30))
    const samples: number[] = []
    const batch = 20
    for (let done = 0; done < syncFrames; done += batch) {
      const s = await page.evaluate((n) => window.__NEURUH_SPIKE__!.measureSyncBatch(n, 0), batch)
      samples.push(...s)
      await page.waitForTimeout(16)
    }
    const sync = await page.evaluate((vals) => window.__NEURUH_SPIKE__!.summariseExternal(vals), samples)

    // 3) True GPU time via EXT_disjoint_timer_query_webgl2, in several passes —
    //    see the gpuTimerPasses doc comment for why one pass is not enough.
    const gpuTimerPasses: FrameStats[] = []
    for (let i = 0; i < gpuPassCount; i++) {
      const pass = await page.evaluate(() => window.__NEURUH_SPIKE__!.measureGpuTimer(40))
      if (pass) gpuTimerPasses.push(pass)
      await page.waitForTimeout(600)
    }
    const sortedPasses = [...gpuTimerPasses].sort((a, b) => a.p95 - b.p95)
    const gpuTimer = sortedPasses.length ? sortedPasses[Math.floor(sortedPasses.length / 2)] : null

    await page.evaluate(() => window.__NEURUH_SPIKE__!.resumeLoop())

    const snap = await page.evaluate((label) => {
      const h = window.__NEURUH_SPIKE__!
      const s = h.snapshot(label)
      return { ...s, meta: h.meta }
    }, opts.label)

    return {
      page,
      close,
      label: opts.label,
      url,
      params,
      timing: snap.timing,
      payload: snap.payload,
      census: snap.census,
      meta: snap.meta as Record<string, unknown>,
      frames: { raf, sync, gpuTimer, gpuTimerPasses: gpuTimerPasses.length ? gpuTimerPasses : null },
      diagnostics: snap.diagnostics,
      errors: snap.errors,
      consoleErrors: [...net.consoleErrors],
      network: net.result(),
    }
  } catch (err) {
    // The GPU process occasionally drops the page under transmission load and
    // Chrome reloads or kills it. The caller retries; this context must not
    // leak while it does.
    await context.close().catch(() => {})
    throw err
  }
}

/**
 * Collects every piece of editorial copy under `root`, skipping any subtree
 * marked `data-instrument` — the spike rails and state readouts, which are
 * measurement affordances and legitimately change between tiers.
 *
 * ENGINEERING_HANDOFF.md §10 requires "tier 0 carries 100% of copy" to be an
 * automated assertion rather than a manual check. Comparing raw innerText would
 * fail on the instrument readouts and tempt someone to weaken the assertion
 * until it passes, which is how this check quietly stops meaning anything.
 */
export async function collectCopy(page: Page, root: string): Promise<string[]> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return []
    const out: string[] = []
    const walk = (node: Element) => {
      if (node.hasAttribute('data-instrument')) return
      if (node.getAttribute('aria-hidden') === 'true') return
      const tag = node.tagName.toLowerCase()
      if (['p', 'h1', 'h2', 'h3', 'h4', 'li', 'dt', 'dd', 'blockquote'].includes(tag)) {
        const text = (node as HTMLElement).innerText.replace(/\s+/g, ' ').trim()
        if (text) out.push(text)
        return
      }
      for (const child of Array.from(node.children)) walk(child)
    }
    walk(el)
    return out
  }, root)
}

/**
 * Refuses to accept a measurement taken on a software rasteriser.
 *
 * This assertion is the difference between a spike result and a made-up number.
 */
export function assertRealGpu(r: RunResult) {
  expect(
    r.diagnostics.softwareRenderer,
    `Measurement was taken on a software rasteriser (${r.diagnostics.gpu}). ` +
      'Frame times from SwiftShader/llvmpipe are not evidence about GPU cost. ' +
      'Re-run headed with GPU enabled.',
  ).toBe(false)
  expect(r.diagnostics.gpu, 'No unmasked renderer string available').toBeTruthy()
}
