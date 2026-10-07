// Visual court capture harness — deterministic screenshots of key routes.
// Usage: node scripts/visual-court.mjs <outDir> [baseUrl]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'visual-court';
const base = process.argv[3] ?? 'http://127.0.0.1:4311';
mkdirSync(outDir, { recursive: true });

const routes = [
  ['/', 'home'],
  ['/proof', 'proof'],
  ['/worlds', 'worlds'],
  ['/worlds/deedsonar', 'world-deedsonar'],
  ['/organism', 'organism'],
  ['/galaxy', 'galaxy'],
  ['/founder', 'founder'],
  ['/accessible', 'accessible'],
  ['/products', 'products'],
  ['/open-source', 'open-source'],
  ['/contact', 'contact'],
  ['/legal', 'legal'],
  ['/refusals', 'refusals'],
  ['/definitely-missing-route-404', 'not-found'],
];

const viewports = [
  ['desktop-1440', { width: 1440, height: 900 }],
  ['mobile-390', { width: 390, height: 844 }],
];

const browser = await chromium.launch();
for (const [vpName, viewport] of viewports) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [path, name] of routes) {
    try {
      const res = await page.goto(`${base}${path}?seed=11&frame=120`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2500);
      await page.screenshot({
        path: join(outDir, `${name}-${vpName}.png`),
        fullPage: true,
        animations: 'disabled',
        timeout: 30000,
      });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      console.log(`${name}-${vpName}: status=${res?.status()} hoverflow=${overflow}px`);
    } catch (err) {
      console.log(`${name}-${vpName}: FAILED ${String(err).slice(0, 140)}`);
    }
  }
  await ctx.close();
}
await browser.close();
