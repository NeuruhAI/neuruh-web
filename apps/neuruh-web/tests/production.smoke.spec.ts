import { expect, test } from '@playwright/test'

test('accessible and no-WebGL routes carry all eight chapters with no canvas', async ({ page }) => {
  await page.goto('/accessible')
  await expect(page.locator('section[data-chapter]')).toHaveCount(8)
  await expect(page.locator('canvas')).toHaveCount(0)
  const accessible = await page.locator('main').innerText()

  await page.goto('/no-webgl')
  await expect(page.locator('section[data-chapter]')).toHaveCount(8)
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(await page.locator('main').innerText()).toBe(accessible)
})

test('tier 0 fetches zero WebGL scene bytes and retains semantic copy', async ({ page }) => {
  let webglBytes = 0
  page.on('response', async (response) => {
    if (!/javascript|ecmascript/.test(response.headers()['content-type'] ?? '')) return
    const body = await response.body().catch(() => Buffer.alloc(0))
    const text = body.toString('utf8')
    if (/neuruh-tissue-instanced-state|renderTransmissionPass|MeshTransmissionMaterial/.test(text)) webglBytes += body.byteLength
  })
  await page.goto('/?tier=0')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('section[data-chapter]')).toHaveCount(8)
  await expect(page.getByTestId('tier0-composition')).toBeAttached()
  expect(webglBytes).toBe(0)
  const transferBytes = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return nav.transferSize + resources.reduce((sum, entry) => sum + entry.transferSize, 0)
  })
  console.log(`tier0 transfer: ${(transferBytes / 1024).toFixed(1)} KB`)
  expect(transferBytes).toBeLessThanOrEqual(180 * 1024)
})

test('reduced-motion route selects reduced route and preserves eight states', async ({ page }) => {
  await page.goto('/reduced-motion')
  await expect(page.locator('html')).toHaveAttribute('data-motion-route', 'reduced')
  await expect(page.locator('section[data-chapter]')).toHaveCount(8)
  const states = await page.locator('section[data-chapter]').evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-state')))
  expect(new Set(states).size).toBe(8)
})

test('keyboard trace is reachable on the semantic DOM layer', async ({ page }) => {
  await page.goto('/?tier=0&motion=reduced')
  await page.getByTestId('trace-start').click()
  await expect(page.getByTestId('trace-step-S6')).toHaveAttribute('data-on', 'true')
  await page.keyboard.press('R')
  await expect(page.getByTestId('trace-step-S1')).toHaveAttribute('data-on', 'false')
})
