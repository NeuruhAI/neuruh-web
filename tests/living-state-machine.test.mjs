import test from 'node:test'
import assert from 'node:assert/strict'
import { SEMANTIC_TO_RENDERER, TRANSITIONS, transition } from '../packages/public-truth/src/state-machine.mjs'

test('every declared state-machine transition is accepted', () => {
  for (const [from, targets] of Object.entries(TRANSITIONS)) {
    for (const to of targets) {
      const context = to === 'EXECUTING'
        ? { truth_mode: 'SANDBOX', authority: 'HUMAN_APPROVED_SANDBOX', reversibility: 'REVERSIBLE', source: 'src-test' }
        : from === 'EXECUTING' && to === 'RECEIVING'
          ? { receipt_ref: 'sandbox-receipt' }
          : {}
      assert.deepEqual(transition(from, to, context), { from, to })
    }
  }
})

test('illegal transition and under-specified execution fail closed', () => {
  assert.throws(() => transition('DORMANT', 'EXECUTING'), /illegal living-state transition/)
  assert.throws(() => transition('GOVERNING', 'EXECUTING', { truth_mode: 'SANDBOX' }), /EXECUTING requires authority/)
  assert.throws(() => transition('EXECUTING', 'RECEIVING'), /receipt_ref/)
})

test('all semantic states map to the existing eight-state renderer boundary', () => {
  assert.deepEqual(new Set(Object.keys(SEMANTIC_TO_RENDERER)), new Set(Object.keys(TRANSITIONS)))
  const rendererStates = new Set(['dormant', 'fragmented', 'awakening', 'metabolism', 'vertical', 'gating', 'receipt', 'entry'])
  for (const state of Object.values(SEMANTIC_TO_RENDERER)) assert.ok(rendererStates.has(state))
})

