import test from 'node:test'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

test('private-IP leakage court fails closed on factory internals', () => {
  const result = spawnSync(process.execPath, ['scripts/verify-private-ip.mjs'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.match(result.stdout, /private-IP: PASS/)
})
