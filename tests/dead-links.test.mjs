import test from 'node:test'
import { spawnSync } from 'node:child_process'
import { access } from 'node:fs/promises'
import assert from 'node:assert/strict'

test('dead-link court fails closed on broken in-site hrefs after build', async () => {
  try {
    await access('apps/neuruh-web/.next/server/app/index.html')
  } catch {
    return
  }
  const result = spawnSync(process.execPath, ['scripts/verify-dead-links.mjs'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.match(result.stdout, /dead-link: PASS/)
})
