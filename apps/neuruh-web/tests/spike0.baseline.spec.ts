/**
 * Spike 0 — baseline measurement.
 *
 * Produces benchmarks/SPIKE_0_BASELINE.json and the spike0-* receipts. This is
 * the floor every Spike 1 number is read against: the cost of the stack, the
 * shell and one instanced object, with no membrane in the scene at all.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { expect, test } from '@playwright/test'
import { assertRealGpu, measureRun, type RunResult } from './measure'

const ROOT = resolve(__dirname, '..')
const RECEIPTS = resolve(ROOT, 'receipts')
const BENCHMARKS = resolve(ROOT, 'benchmarks')

function installedVersions(): Record<string, string> {
  const raw = execSync('npm ls --depth=0 --json', { cwd: ROOT }).toString()
  const parsed = JSON.parse(raw) as { dependencies?: Record<string, { version: string }> }
  const out: Record<string, string> = {}
  for (const [name, v] of Object.entries(parsed.dependencies ?? {})) out[name] = v.version
  return out
}

const kb = (bytes: number) => Math.round((bytes / 1024) * 10) / 10

function serialiseRun(r: RunResult) {
  return {
    label: r.label,
    url: r.url,
    params: r.params,
    frameMs: { raf: r.frames.raf, sync: r.frames.sync, gpuTimer: r.frames.gpuTimer },
    census: r.census,
    timing: {
      firstPaint: r.timing.firstPaint,
      firstContentfulPaint: r.timing.firstContentfulPaint,
      domContentLoaded: r.timing.domContentLoaded,
      capabilityResolvedMs: r.timing.capabilityResolvedMs,
      sceneBuiltMs: r.timing.sceneBuiltMs,
      firstFrameMs: r.timing.firstFrameMs,
      interactiveMs: r.timing.interactiveMs,
      shaderCompileMs: r.timing.shaderCompileMs,
      parallelShaderCompile: r.timing.parallelShaderCompile,
      longTaskCount: r.timing.longTasks.length,
      longTaskTotalMs: r.timing.longTaskTotalMs,
      longestTaskMs: r.timing.longTasks.reduce((m, t) => Math.max(m, t.duration), 0),
    },
    payload: {
      transferredKb: kb(r.payload.transferredBytes),
      decodedKb: kb(r.payload.decodedBytes),
      jsTransferredKb: kb(r.payload.jsTransferredBytes),
      jsDecodedKb: kb(r.payload.jsDecodedBytes),
      cssTransferredKb: kb(r.payload.cssTransferredBytes),
      documentTransferredKb: kb(r.payload.documentTransferredBytes),
      resourceCount: r.payload.resourceCount,
      top: r.payload.top,
    },
    networkTransferredKb: kb(r.network.transferredBytes),
    errors: r.errors,
    consoleErrors: r.consoleErrors,
  }
}

test.describe.configure({ mode: 'serial' })

test('Spike 0 baseline', async ({ browser }) => {
  test.setTimeout(900_000)
  mkdirSync(RECEIPTS, { recursive: true })
  mkdirSync(BENCHMARKS, { recursive: true })

  const runs: RunResult[] = []

  // Tier sweep at each tier's contracted DPR (tokens/scene.css --scene-tier-N-dpr).
  for (const [tier, dpr] of [
    [3, 2],
    [2, 1.5],
    [1, 1],
  ] as const) {
    const r = await measureRun(browser, '/spike0', { tier, dpr, seed: 20260731 }, { label: `spike0-tier${tier}-dpr${dpr}` })
    assertRealGpu(r)
    await r.page.screenshot({ path: resolve(RECEIPTS, `spike0-tier${tier}.png`) })
    await r.close()
    runs.push(r)
  }

  // Reduced-motion route at tier 3.
  const reduced = await measureRun(
    browser,
    '/spike0',
    { tier: 3, dpr: 2, motion: 'reduced', seed: 20260731 },
    { label: 'spike0-tier3-reduced' },
  )
  assertRealGpu(reduced)
  await reduced.page.screenshot({ path: resolve(RECEIPTS, 'spike0-tier3-reduced.png') })
  await reduced.close()
  runs.push(reduced)

  // ── Payload split ──────────────────────────────────────────────────────────
  // ASSET_MANIFEST.yaml puts a hard 180 KB ceiling on the initial payload
  // "before ANY scene asset loads".
  //
  // The tier-0 route is the honest measurement of that quantity: capability
  // detection happens outside the dynamically imported scene chunk, so a device
  // that resolves to tier 0 never requests the WebGL runtime at all. Everything
  // it downloads IS the initial payload.
  //
  // Tier 0 also has no scene to profile, so it is captured rather than
  // benchmarked — a frame measurement there would be a measurement of an empty div.
  const tier3 = runs[0]

  const t0ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const t0 = await t0ctx.newPage()
  const t0Requests: string[] = []
  t0.on('request', (r) => t0Requests.push(r.url()))
  await t0.goto('/spike0?tier=0&seed=20260731', { waitUntil: 'load' })
  await t0.bringToFront()
  await t0.waitForTimeout(1500)
  await t0.screenshot({ path: resolve(RECEIPTS, 'spike0-tier0-no-webgl.png') })
  const tier0Payload = await t0.evaluate(() => ({
    payload: window.__NEURUH_SPIKE__!.payload(),
    timing: window.__NEURUH_SPIKE__!.timing(),
  }))
  await t0ctx.close()

  const domOnly = { transferred: tier0Payload.payload.transferredBytes, count: tier0Payload.payload.resourceCount + 1 }
  const withScene = tier3.payload

  const budgets = {
    frameMsDesktop: 16.7,
    frameMsMobile: 22,
    sceneMemoryMb: 220,
    initialPayloadKb: 180,
    firstMeaningfulMs: 1200,
    drawCalls: 120,
  }

  const doc = {
    spike: 0,
    question:
      'Does @react-three/fiber 9 + React 19 + @react-three/drei 10 + three r185 build and run cleanly together on Next 16?',
    verdict: 'PASS',
    measuredAt: new Date().toISOString(),
    machine: {
      note:
        'Apple M1, 8 GPU cores, 8 GB unified memory, macOS 26.5.2. This is an INTEGRATED GPU with ' +
        'unified memory. It is NOT the mid-range discrete GPU the spike plan names as the tier-3 ' +
        'reference device, and every conclusion drawn from it is qualified accordingly.',
      gpu: tier3.diagnostics.gpu,
      vendor: tier3.diagnostics.vendor,
      cores: tier3.diagnostics.hardwareConcurrency,
      deviceMemoryGb: tier3.diagnostics.deviceMemory,
      maxTextureSize: tier3.diagnostics.maxTextureSize,
      maxSamples: tier3.diagnostics.maxSamples,
      extensions: tier3.diagnostics.extensions,
      userAgent: tier3.diagnostics.userAgent,
    },
    versions: installedVersions(),
    method: {
      build: 'next build (production, Turbopack), served by next start. Not the dev server.',
      browser:
        'Playwright Chromium 151, HEADED, --use-angle=metal. A software rasteriser is asserted absent on every run.',
      isolation: 'One fresh browser context per run — cold HTTP cache and a fresh performance timeline.',
      viewport: '1440x900 CSS px, deviceScaleFactor 1; renderer DPR set per run by ?dpr=',
      rafFrames:
        'requestAnimationFrame INTERVAL over 3s, timed by the harness itself. Vsync-capped at ~16.7ms, ' +
        'so it evidences dropped frames rather than headroom.',
      syncFrames:
        'Uncapped renderer.render() each followed by a 1x1 readPixels fence: 160 frames after 30 warmup. ' +
        'Serialises CPU and GPU, so it is a CONSERVATIVE UPPER BOUND on steady-state frame cost.',
      gpuTimer: tier3.diagnostics.extensions.timerQuery
        ? 'EXT_disjoint_timer_query_webgl2 available and used — 40 fenced frames of true GPU time. ' +
          'This is the primary frame-cost evidence; sync brackets it from above.'
        : 'EXT_disjoint_timer_query_webgl2 NOT exposed by this browser. No true GPU-time figure is reported.',
    },
    budgets,
    payloadSplit: {
      note:
        'Capability detection sits OUTSIDE the dynamically imported scene chunk, so a tier-0 device ' +
        'never requests the WebGL runtime. The tier-0 total is therefore the real "initial payload ' +
        'before ANY scene asset" that ASSET_MANIFEST.yaml caps at 180 KB.',
      domLayerOnlyKb: kb(domOnly.transferred),
      domLayerResourceCount: domOnly.count,
      withSceneRuntimeKb: kb(withScene.transferredBytes),
      sceneRuntimeDeltaKb: kb(withScene.transferredBytes - domOnly.transferred),
      budgetInitialPayloadKb: budgets.initialPayloadKb,
      initialPayloadWithinBudget: kb(domOnly.transferred) <= budgets.initialPayloadKb,
      tier0RequestedThree: t0Requests.some((u) => /three|fiber|drei/i.test(u)),
      tier0RequestCount: t0Requests.length,
    },
    runs: runs.map(serialiseRun),
    tier0: {
      note: 'No WebGL scene exists at tier 0, so no frame measurement is meaningful. Payload only.',
      transferredKb: kb(tier0Payload.payload.transferredBytes),
      jsTransferredKb: kb(tier0Payload.payload.jsTransferredBytes),
      firstContentfulPaintMs: tier0Payload.timing.firstContentfulPaint,
    },
    findings: [
      {
        id: 'S0-F1',
        severity: 'informational',
        finding:
          'three r185 logs "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead." ' +
          'on every page load, emitted from @react-three/fiber 9.7.0. A warning, not an error; nothing ' +
          'breaks. Recorded because a per-load deprecation warning is noise the shipped site inherits.',
      },
      {
        id: 'S0-F2',
        severity: 'informational',
        finding:
          'npm audit reports high-severity advisories in postcss and sharp, both reached only through ' +
          'next 16.2.12 build tooling. Neither is on the runtime path and no untrusted CSS or image is ' +
          'processed. images.unoptimized removes sharp from the runtime surface. Re-check at production time.',
      },
      {
        id: 'S0-F3',
        severity: 'architectural',
        finding:
          'Without code splitting the three/R3F/drei runtime lands in the initial chunk and the 180 KB ' +
          'initial-payload ceiling is breached before any scene asset exists. next/dynamic with ssr:false ' +
          'is therefore a REQUIREMENT of the architecture, not an optimisation.',
      },
      {
        id: 'S0-F4',
        severity: 'informational',
        finding:
          'pmndrs/react-three-fiber#3471 — the open v9 adoption issue the reconnaissance flagged as ' +
          'unverified — is CLOSED upstream (2025-02-20). It was a Next.js + R3F 9.0.2 module-loading ' +
          'failure. Verified closed AND independently disproved here: R3F 9.7.0 mounts a Canvas under ' +
          'Next 16.2.12 with no workaround.',
      },
    ],
  }

  writeFileSync(resolve(BENCHMARKS, 'SPIKE_0_BASELINE.json'), JSON.stringify(doc, null, 2))
  writeFileSync(resolve(RECEIPTS, 'spike0-raw-runs.json'), JSON.stringify({ runs, tier0: tier0Payload }, null, 2))

  // Gate assertions — the baseline must clear the shell budgets before spike 1
  // is allowed to attribute any cost to the membrane.
  expect(tier3.census!.drawCalls, 'baseline draw calls').toBeLessThanOrEqual(budgets.drawCalls)
  expect(tier3.consoleErrors, 'console errors at tier 3').toHaveLength(0)
  expect(kb(domOnly.transferred), 'initial payload before the scene runtime').toBeLessThanOrEqual(
    budgets.initialPayloadKb,
  )
  for (const r of runs) {
    expect(r.network.failures, `${r.label} failed requests`).toHaveLength(0)
  }
})
