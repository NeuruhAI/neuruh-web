import { expect, test } from '@playwright/test'

test('accessible and no-WebGL routes carry the complete Alive map with no canvas', async ({ page }) => {
  await page.goto('/accessible')
  await expect(page.locator('section[data-chapter]')).toHaveCount(11)
  await expect(page.locator('canvas')).toHaveCount(0)
  const accessible = await page.locator('main').innerText()

  await page.goto('/no-webgl')
  await expect(page.locator('section[data-chapter]')).toHaveCount(11)
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
  await expect(page.locator('section[data-chapter]')).toHaveCount(11)
  await expect(page.getByTestId('tier0-composition')).toBeAttached()
  expect(webglBytes).toBe(0)
  const encodedBodyBytes = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return nav.encodedBodySize + resources.reduce((sum, entry) => sum + entry.encodedBodySize, 0)
  })
  console.log(`tier0 encoded body: ${(encodedBodyBytes / 1024).toFixed(1)} KB`)
  expect(encodedBodyBytes).toBeLessThanOrEqual(180 * 1024)
})

test('reduced-motion route preserves truth and semantic state parity', async ({ page }) => {
  await page.goto('/accessible')
  const expected = await page.locator('section[data-chapter]').evaluateAll((nodes) => nodes.map((node) => ({
    id: node.getAttribute('data-chapter-id'),
    state: node.getAttribute('data-state'),
    truth: node.getAttribute('data-truth-mode'),
  })))
  await page.goto('/reduced-motion')
  await expect(page.locator('html')).toHaveAttribute('data-motion-route', 'reduced')
  await expect(page.locator('section[data-chapter]')).toHaveCount(11)
  const actual = await page.locator('section[data-chapter]').evaluateAll((nodes) => nodes.map((node) => ({
    id: node.getAttribute('data-chapter-id'),
    state: node.getAttribute('data-state'),
    truth: node.getAttribute('data-truth-mode'),
  })))
  expect(actual).toEqual(expected)
})

test('keyboard trace is reachable on the semantic DOM layer', async ({ page }) => {
  await page.goto('/?tier=0&motion=reduced')
  await page.getByTestId('trace-start').click()
  await expect(page.getByTestId('trace-step-S6')).toHaveAttribute('data-on', 'true')
  await page.keyboard.press('R')
  await expect(page.getByTestId('trace-step-S1')).toHaveAttribute('data-on', 'false')
})

test('semantic routes render Neuruh truth without canvas or fake LIVE state', async ({ page }) => {
  const routes = [
    '/organism', '/galaxy', '/worlds', '/worlds/deedsonar',
    '/research/adaptive-intelligence', '/research/case-zero', '/founder', '/proof',
  ]
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('main#main')).toBeVisible()
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.locator('[data-truth-mode="LIVE"]')).toHaveCount(0)
  }
})

test('keyboard navigation reaches a semantic route', async ({ page }) => {
  await page.goto('/?tier=0')
  const link = page.getByRole('link', { name: 'Organism', exact: true })
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/organism$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Specialized organs')
})

test('Galaxy exposes sourced relationships and preserves contradiction', async ({ page }) => {
  await page.goto('/galaxy')
  await expect(page.locator('main#main > [data-contradiction-id="galaxy-connectivity-boundary"]')).toBeVisible()
  await expect(page.locator('.relationship-list li').first()).toContainText('Source src-')
  await expect(page.getByText('No canvas, orbit, or illustrative edge.')).toBeVisible()
})
