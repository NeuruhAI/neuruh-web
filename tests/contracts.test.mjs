import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const states = await readFile('packages/spatial-runtime/contract/sceneStates.ts', 'utf8')
const camera = await readFile('packages/spatial-runtime/scene/CameraRig.tsx', 'utf8')
const shell = await readFile('packages/spatial-runtime/scene/SceneShell.tsx', 'utf8')
const experience = await readFile('apps/neuruh-web/components/NeuruhExperience.tsx', 'utf8')
const pkg = JSON.parse(await readFile('package.json', 'utf8'))

test('eight locked states and eight chapter bindings remain transcribed', () => {
  for (const state of ['dormant', 'fragmented', 'awakening', 'metabolism', 'vertical', 'gating', 'receipt', 'entry']) assert.match(states, new RegExp(`\\b${state}:`))
  assert.equal((states.match(/\{ n: \d, id: 'ch\d'/g) ?? []).length, 8)
})

test('five named camera poses and fixed-axis language exclude orbit', () => {
  for (const pose of ['wide', 'mid', 'close', 'vertical', 'core']) assert.match(states, new RegExp(`\\b${pose}:\\s+\\{ scale:`))
  assert.match(camera, /const AZIMUTH/)
  assert.doesNotMatch(camera, /OrbitControls|orbitControls/)
  assert.equal(pkg.dependencies?.['@theatre/core'], undefined)
})

test('production material policy is structurally fixed and honest', () => {
  assert.match(shell, /transmissionResolutionScale = 0\.75/)
  assert.match(experience, /cap\.tier === 3 \? 'physical' : 'baked'/)
  assert.match(experience, /cap\.tier === 3 \? 2 : cap\.tier === 2 \? 4 : 3/)
  assert.doesNotMatch(experience, /APPROACH_LABEL|MEMBRANE_APPROACHES/)
})

test('visual determinism hooks remain present', async () => {
  const rng = await readFile('packages/spatial-runtime/lib/rng.ts', 'utf8')
  assert.match(rng, /seed/)
  assert.match(rng, /frame/)
})
