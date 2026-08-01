import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './apps/neuruh-web/tests',
  testMatch: 'production.smoke.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: [['list'], ['json', { outputFile: 'receipts/playwright-report.json' }]],
  use: { baseURL: 'http://127.0.0.1:4311', headless: true, viewport: { width: 1440, height: 900 } },
  webServer: { command: 'npm run start', url: 'http://127.0.0.1:4311', reuseExistingServer: true, timeout: 120_000 },
})
