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

test('the scripted trace illustration runs and resets from the keyboard', async ({ page }) => {
  await page.goto('/how-it-works')
  await page.getByTestId('trace-start').click()
  await expect(page.getByTestId('trace-step-S6')).toHaveAttribute('data-on', 'true')
  await page.keyboard.press('R')
  await expect(page.getByTestId('trace-step-S1')).toHaveAttribute('data-on', 'false')
})

test('primary routes render truthfully without fake LIVE state', async ({ page }) => {
  const routes = [
    '/products', '/how-it-works', '/proof', '/refusals', '/founder', '/contact',
    '/offers', '/ask', '/work-with-neuruh', '/work-with-us', '/thank-you', '/cases',
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

test('390px homepage keeps hero CTAs and header Work with us inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const headerCta = page.locator('header.hdr a.work-cta')
  await expect(headerCta).toHaveText('Work with us')
  const headerBox = await headerCta.boundingBox()
  expect(headerBox, 'header Work with us must render').toBeTruthy()
  expect(headerBox!.x).toBeGreaterThanOrEqual(0)
  expect(headerBox!.x + headerBox!.width).toBeLessThanOrEqual(391)

  const heroButtons = page.locator('.hero-v2 .hero-ctas .v2-btn')
  await expect(heroButtons).toHaveCount(3)
  const tops = new Set<number>()
  for (const button of await heroButtons.all()) {
    const box = await button.boundingBox()
    expect(box, 'hero CTA must render').toBeTruthy()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(391)
    tops.add(Math.round(box!.y))
  }
  expect(tops.size).toBe(3)

  await expect(page.locator('footer.site-footer a[href^="mailto:"]')).toHaveCount(0)
  await expect(page.locator('footer.site-footer a[href="/security"]')).toBeVisible()

  await page.goto('/offers')
  const offersCta = page.locator('header.hdr a.work-cta')
  const offersBox = await offersCta.boundingBox()
  expect(offersBox, 'offers header Work with us must render').toBeTruthy()
  expect(offersBox!.x).toBeGreaterThanOrEqual(0)
  expect(offersBox!.x + offersBox!.width).toBeLessThanOrEqual(391)
})

test('keyboard navigation reaches Products from the header', async ({ page }) => {
  await page.goto('/')
  const link = page.locator('header.hdr nav.primary > a', { hasText: 'Products' })
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/products$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Real systems')
})

test('offers page shows three live cashier prices and exact Stripe hrefs', async ({ page }) => {
  const expected = [
    { id: 'O01', price: '$299', href: 'https://book.stripe.com/bJe5kDagndYugJlaow2cg04' },
    { id: 'O02', price: '$499', href: 'https://book.stripe.com/8x2cN574b1bIakXgMU2cg05' },
    { id: 'O05', price: '$1250', href: 'https://book.stripe.com/7sY00j1JRf2y2Sv4082cg06' },
  ] as const
  await page.goto('/offers')
  await expect(page.locator('[data-testid="offers-grid"] [data-offer-id]')).toHaveCount(3)
  await expect(page.getByTestId('offers-next')).toContainText('replies from jeramie@neuruh.com')
  for (const offer of expected) {
    const card = page.getByTestId(`offer-${offer.id}`)
    await expect(card).toContainText(offer.price)
    await expect(card).toContainText('You provide:')
    await expect(card).toContainText('You receive:')
    await expect(card).toContainText('Turnaround:')
    await expect(card).toContainText('Proof:')
    await expect(page.getByTestId(`offer-cta-${offer.id}`)).toHaveAttribute('href', offer.href)
  }
})

test('Ask Neuruh returns exactly three public cards and never a fourth', async ({ page }) => {
  await page.goto('/ask')
  await expect(page.getByTestId('ask-output').locator('[data-lane]')).toHaveCount(3)
  await expect(page.getByTestId('ask-card-fastest')).toContainText('Data Rescue')
  await expect(page.getByTestId('ask-card-best-value')).toContainText('Opportunity Dossier')
  await expect(page.getByTestId('ask-card-custom')).toContainText('Workflow Sprint')
  await page.getByTestId('ask-intent-data').click()
  await expect(page.getByTestId('ask-card-fastest')).toHaveAttribute('data-highlight', 'true')
  await expect(page.getByTestId('ask-output').locator('[data-lane]')).toHaveCount(3)
})

test('work-with, thank-you, cases, and contact route without leaking a factory tour', async ({ page }) => {
  await page.goto('/work-with-neuruh')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Buy a scoped piece of work')
  await expect(page.locator('a[href="https://book.stripe.com/bJe5kDagndYugJlaow2cg04"]')).toBeVisible()

  await page.goto('/work-with-us')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Buy a scoped piece of work')

  await page.goto('/thank-you')
  await expect(page.getByTestId('thank-you-handoff')).toContainText('does not receive Stripe webhooks')
  await expect(page.getByTestId('thank-you-next')).toContainText('replies from jeramie@neuruh.com')

  await page.goto('/cases')
  await expect(page.getByTestId('case-studies').locator('article')).toHaveCount(5)
  await expect(page.getByTestId('case-neuruh-com-launch')).toContainText('30947182')

  await page.goto('/proof')
  await expect(page.getByTestId('proof-card-xai-marketplace')).toContainText('IN_REVIEW')
  await expect(page.getByTestId('proof-card-xai-marketplace')).not.toContainText('book.stripe.com')

  await page.goto('/contact')
  await expect(page.getByRole('link', { name: /See offers/i })).toHaveAttribute('href', '/offers')
})

test('Galaxy exposes sourced relationships, preserves contradiction, and hosts the only scene', async ({ page }) => {
  await page.goto('/galaxy')
  await expect(page.locator('main#main > [data-contradiction-id="galaxy-connectivity-boundary"]')).toBeVisible()
  await expect(page.locator('.relationship-list li').first()).toContainText('Source src-')
  await expect(page.getByText('No canvas, orbit, or illustrative edge.')).toBeVisible()
})
