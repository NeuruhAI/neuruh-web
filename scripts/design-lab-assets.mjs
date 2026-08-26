// Design-lab asset pipeline: crop + resize recovered product screenshots into
// public-safe web media. Crops remove internal chrome (e.g. the APG sidebar on
// pre-rename DeedSonar captures); resizes bound payload. Run once per intake.
import { chromium } from '@playwright/test'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const OUT = 'apps/neuruh-web/public/media/products'
mkdirSync(OUT, { recursive: true })

// [src, out, cropCss(x,y,w,h) in source px | null, targetWidth]
const JOBS = [
  ['/Users/jeramiehicks/neuruh-worktrees/deedsonar-billion-dollar-design/dashboard-full.png', 'deedsonar-dashboard.png', [224, 0, 976, 1080], 1460],
  ['/Users/jeramiehicks/neuruh-worktrees/deedsonar-billion-dollar-design/reports-full.png', 'deedsonar-reports.png', [224, 0, 976, 1120], 1460],
  ['/Users/jeramiehicks/neuruh-workspaces/neuruh-liquidity-engine-fable-20260823/product/artifacts/screenshots/dev/operator_outcomes-desktop.png', 'liquidity-outcomes.png', null, 1440],
  ['/Users/jeramiehicks/neuruh-workspaces/bookeit-agentic-commerce-20260821/artifacts/screenshots/01-home.png', 'bookeit-home.png', null, 1280],
  ['/Users/jeramiehicks/neuruh-workspaces/findsellprofit-autonomous-merchant-os-20260821/docs/screenshots/home-desktop.png', 'fsp-home.png', null, 1280],
  ['/Users/jeramiehicks/neuruh-workspaces/curbclaim-hyperlocal-recovery-20260821/docs/screenshots/06-project-surplus-desktop.png', 'curbclaim-jobsite.png', null, 1280],
]

const browser = await chromium.launch()
const page = await browser.newPage()
for (const [src, out, crop, width] of JOBS) {
  const result = await page.evaluate(
    async ({ src, crop, width }) => {
      const img = new Image()
      img.src = src
      await img.decode()
      const [cx, cy, cw, ch] = crop ?? [0, 0, img.naturalWidth, img.naturalHeight]
      const scale = Math.min(1, width / cw)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(cw * scale)
      canvas.height = Math.round(ch * scale)
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, cx, cy, cw, ch, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/png')
    },
    { src: 'data:image/png;base64,' + readFileSync(src).toString('base64'), crop, width },
  )
  const b64 = result.split(',')[1]
  writeFileSync(`${OUT}/${out}`, Buffer.from(b64, 'base64'))
  console.log(`${out} written`)
}
await browser.close()
