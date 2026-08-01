import { mkdir, writeFile } from 'node:fs/promises'

const cases = []
for (let chapter = 1; chapter <= 8; chapter++) {
  for (const tier of [0, 1, 2, 3]) {
    for (const motion of ['full', 'reduced']) {
      for (const viewport of [390, 1024, 1440]) {
        cases.push({ id: `ch${chapter}-t${tier}-${motion}-${viewport}`, chapter, tier, motion, viewport, seed: 20260731, frame: 120, threshold: tier === 0 ? 0.001 : 0.005 })
      }
    }
  }
}
await mkdir('packages/testing/visual', { recursive: true })
await writeFile('packages/testing/visual/matrix.json', JSON.stringify({ count: cases.length, cases }, null, 2) + '\n')
