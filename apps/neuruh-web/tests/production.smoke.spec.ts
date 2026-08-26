import { expect, test } from '@playwright/test'

test('accessible and no-WebGL routes carry the complete homepage story with no canvas', async ({ page }) => {
  await page.goto('/accessible')
  expect(await page.locator('main section[data-section]').count()).toBeGreaterThanOrEqual(10)
  await expect(page.locator('canvas')).toHaveCount(0)
  const accessible = await page.locator('main').innerText()

  await page.goto('/no-webgl')
  expect(await page.locator('main section[data-section]').count()).toBeGreaterThanOrEqual(10)
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(await page.locator('main').innerText()).toBe(accessible)
})

test('homepage fetches zero WebGL scene bytes and retains the full story', async ({ page }) => {
  let webglBytes = 0
  page.on('response', async (response) => {
    if (!/javascript|ecmascript/.test(response.headers()['content-type'] ?? '')) return
    const body = await response.body().catch(() => Buffer.alloc(0))
    const text = body.toString('utf8')
    if (/neuruh-tissue-instanced-state|renderTransmissionPass|MeshTransmissionMaterial/.test(text)) webglBytes += body.byteLength
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(await page.locator('main section[data-section]').count()).toBeGreaterThanOrEqual(10)
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(webglBytes).toBe(0)
})

test('reduced-motion route preserves the identical story and marks the route', async ({ page }) => {
  await page.goto('/accessible')
  const expected = await page.locator('main section[data-section]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-section')))
  await page.goto('/reduced-motion')
  await expect(page.locator('html')).toHaveAttribute('data-motion-route', 'reduced')
  const actual = await page.locator('main section[data-section]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-section')))
  expect(actual).toEqual(expected)
})

test('the governed trace runs and resets from the keyboard', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('trace-start').click()
  await expect(page.getByTestId('trace-step-S6')).toHaveAttribute('data-on', 'true')
  await page.keyboard.press('R')
  await expect(page.getByTestId('trace-step-S1')).toHaveAttribute('data-on', 'false')
})

test('primary routes render truthfully without fake LIVE state', async ({ page }) => {
  const routes = [
    '/products', '/how-it-works', '/proof', '/refusals', '/founder', '/contact',
    '/organism', '/worlds', '/worlds/deedsonar', '/worlds/liquidity-engine',
    '/research/adaptive-intelligence', '/research/case-zero',
  ]
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('main#main')).toBeVisible()
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.locator('[data-truth-mode="LIVE"]')).toHaveCount(0)
  }
})

test('keyboard navigation reaches Products from the header', async ({ page }) => {
  await page.goto('/')
  const link = page.locator('header.hdr nav.primary > a', { hasText: 'Products' })
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/products$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Real systems')
})

test('Galaxy exposes sourced relationships, preserves contradiction, and hosts the only scene', async ({ page }) => {
  await page.goto('/galaxy')
  await expect(page.locator('main#main > [data-contradiction-id="galaxy-connectivity-boundary"]')).toBeVisible()
  await expect(page.locator('.relationship-list li').first()).toContainText('Source src-')
  await expect(page.getByText('No canvas, orbit, or illustrative edge.')).toBeVisible()
})
