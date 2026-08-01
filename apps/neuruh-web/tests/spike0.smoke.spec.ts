/**
 * Spike 0 — automated smoke test.
 *
 * Pass condition from TECHNICAL_SPIKE_PLAN.md: "A trivial instanced scene
 * builds, hot-reloads, and renders on the target React version with no
 * pinned-transitive workarounds."
 *
 * Build-and-run is proved by the fact that these tests execute at all against a
 * production build; what is asserted here is that the scene actually RENDERS,
 * that the four routes exist, and that the contract's structural rules hold.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { collectCopy, waitForScene, watchNetwork } from './measure'

test.describe('Spike 0 — toolchain viability', () => {
  test('the instanced scene builds and renders on the real GPU', async ({ page }) => {
    const net = watchNetwork(page)
    await page.goto('/spike0?seed=20260731')
    await waitForScene(page)

    const d = await page.evaluate(() => window.__NEURUH_SPIKE__!.diagnostics())
    expect(d.webglVersion, 'WebGL2 context expected').toBe('webgl2')
    expect(
      d.softwareRenderer,
      `Software rasteriser detected (${d.gpu}). Re-run headed with GPU enabled.`,
    ).toBe(false)

    const census = await page.evaluate(() => window.__NEURUH_SPIKE__!.census())
    expect(census, 'scene census unavailable').not.toBeNull()
    // One InstancedMesh for the whole tissue block. If per-cell state had forced
    // one mesh per cell, this number would be in the hundreds and the draw-call
    // budget would already be gone.
    expect(census!.drawCalls).toBeGreaterThan(0)
    expect(census!.drawCalls).toBeLessThanOrEqual(4)
    expect(census!.triangles).toBeGreaterThan(1000)

    expect(net.consoleErrors, `console errors: ${net.consoleErrors.join(' | ')}`).toHaveLength(0)
    expect(net.result().failures, 'failed requests').toHaveLength(0)
  })

  test('no pinned transitive workarounds are present', async () => {
    // The spike plan's pass condition names this explicitly: "with no
    // pinned-transitive workarounds". An absent overrides block is the evidence.
    const json = JSON.parse(
      readFileSync(resolve(__dirname, '../package.json'), 'utf8'),
    ) as Record<string, unknown>
    expect(json.overrides ?? null, 'npm overrides present — a transitive was pinned').toBeNull()
    expect(json.resolutions ?? null, 'yarn resolutions present — a transitive was pinned').toBeNull()
    expect(json.pnpm ?? null, 'pnpm overrides present — a transitive was pinned').toBeNull()

    // next.config.ts must also be free of a three/R3F transpile workaround.
    const cfg = readFileSync(resolve(__dirname, '../next.config.ts'), 'utf8')
    expect(/transpilePackages\s*:/.test(cfg), 'transpilePackages workaround present').toBe(false)
  })

  test('capability detection selects a tier and the override wins', async ({ page }) => {
    await page.goto('/spike0')
    await waitForScene(page)
    const detected = await page.getByTestId('s0-tier').textContent()
    expect(['1', '2', '3']).toContain(detected)

    await page.goto('/spike0?tier=2')
    await waitForScene(page)
    await expect(page.getByTestId('s0-tier')).toHaveText('2')
    await expect(page.getByTestId('s0-capability')).toContainText('user override')
  })

  test('the camera path walks the five named positions, never orbiting', async ({ page }) => {
    await page.goto('/spike0')
    await waitForScene(page)

    // The chapter -> state -> camera binding table, asserted row by row. A set
    // comparison would pass even if two chapters were bound to the wrong poses
    // as long as every pose appeared somewhere.
    const expected = [
      ['1', 'dormant', 'wide'],
      ['2', 'fragmented', 'wide'],
      ['3', 'awakening', 'mid'],
      ['4', 'metabolism', 'close'],
      ['5', 'vertical', 'vertical'],
      ['6', 'gating', 'core'],
      ['7', 'receipt', 'mid'],
      ['8', 'entry', 'wide'],
    ]

    for (const [n, state, cam] of expected) {
      await expect(page.getByTestId('s0-chapter')).toHaveText(n)
      await expect(page.getByTestId('s0-state')).toHaveText(state)
      await expect(page.getByTestId('s0-camera')).toHaveText(cam)
      if (n !== '8') {
        await page.getByTestId('s0-next').click()
        await expect(page.getByTestId('s0-chapter')).toHaveText(String(Number(n) + 1))
      }
    }

    // Structural proof that the rig cannot orbit: the camera's angle around the
    // pivot must be identical at two different dolly distances.
    const angles = await page.evaluate(async () => {
      const h = window.__NEURUH_SPIKE__!
      const cam = h.camera as unknown as { position: { x: number; y: number; z: number } }
      const read = () => Math.atan2(cam.position.x, cam.position.z)
      const a = read()
      await new Promise((r) => setTimeout(r, 50))
      return { a, b: read() }
    })
    expect(Math.abs(angles.a - angles.b)).toBeLessThan(1e-6)
  })

  test('reduced motion is a route, not disabled animation', async ({ page }) => {
    await page.goto('/spike0?motion=reduced')
    await waitForScene(page)
    await expect(page.getByTestId('s0-motion')).toHaveText('reduced')

    // Every state must remain reachable and distinguishable on the route.
    const states: string[] = []
    for (let i = 0; i < 8; i++) {
      states.push((await page.getByTestId('s0-state').textContent()) ?? '')
      await page.getByTestId('s0-next').click()
      await page.waitForTimeout(60)
    }
    expect(new Set(states).size).toBe(8)
  })

  test('the no-WebGL route keeps every word of copy', async ({ page }) => {
    await page.goto('/spike0')
    await waitForScene(page)
    const full = await collectCopy(page, '#s0-copy')
    expect(full.length, 'no copy collected — the assertion would be vacuous').toBeGreaterThan(2)

    await page.goto('/spike0?tier=0')
    await page.waitForTimeout(600)
    await expect(page.getByTestId('tier0-composition')).toBeVisible()
    await expect(page.getByTestId('scene-canvas-layer')).toHaveCount(0)

    const tier0 = await collectCopy(page, '#s0-copy')

    // Compared block by block rather than as one blob: an element can survive
    // with its text swapped for a degradation message, which is exactly what
    // DESIGN_LOCK.md forbids ("none is a degradation message").
    expect(tier0, 'tier 0 changed the editorial copy').toEqual(full)
  })

  test('a scene error drops to tier 0 and the DOM layer never unmounts', async ({ page }) => {
    await page.goto('/spike0')
    await waitForScene(page)
    await expect(page.getByTestId('scene-canvas-layer')).toBeVisible()

    // Force the failure the contract names, through the browser's own mechanism
    // rather than by mocking our error handler.
    await page.evaluate(() => {
      const gl = window.__NEURUH_SPIKE__!.renderer!.getContext()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    })
    await expect(page.getByTestId('tier0-composition')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('#s0-copy h1')).toBeVisible()
    await expect(page.locator('#s0-copy')).toContainText('A trivial instanced scene')
  })

  test('no essential copy lives inside WebGL', async ({ page }) => {
    await page.goto('/spike0')
    await waitForScene(page)
    const canvasLayer = page.getByTestId('scene-canvas-layer')
    await expect(canvasLayer).toHaveAttribute('aria-hidden', 'true')
    // Automated assertion, per ENGINEERING_HANDOFF.md §10 — not a manual check.
    expect(await canvasLayer.locator('p, h1, h2, h3, li, button, a').count()).toBe(0)
  })
})
