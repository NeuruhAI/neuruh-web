import test from 'node:test'
import assert from 'node:assert/strict'
import { assertBudgets } from '../scripts/budget-gate.mjs'

const valid = { initialPayloadKb: 170, sceneRuntimeGzipKb: 236, tier3AssetsKb: 1200, assetDecodedMb: 78, sceneMemoryMb: 218, drawCalls: 16 }

test('valid budget fixture passes', () => assert.equal(assertBudgets(valid), true))
test('deliberate 30 MB regression is rejected with measured receipt', () => {
  assert.throws(() => assertBudgets({ ...valid, assetDecodedMb: valid.assetDecodedMb + 30 }), /decoded assets budget failed: measured 108, limit 80/)
})
test('full-resolution four-layer canary is rejected', () => {
  assert.throws(() => assertBudgets({ ...valid, sceneMemoryMb: 240 }), /scene memory budget failed: measured 240, limit 220/)
})
