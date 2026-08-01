import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const spike = path.resolve(root, '../neuruh-com-spike')

const sources = {
  spikeTag: { repository: spike, revision: 'a391f3daa312465cece69c40988c7a21ba4869c7' },
  spikeHead: { repository: spike, revision: 'ca508953f5bae771c99b88bc865eff09688d3438' },
  studio: { repository: path.resolve(root, '../neuruh-design-studio'), revision: '708a99680e07b86f20d5d2405c6e8594689ce245' },
}

const mappings = [
  ['spikeTag', 'exports/design-system/tokens', 'packages/brand-tokens', 'byte-identical'],
  ['spikeTag', 'exports/design-system/css', 'packages/ui-foundation', 'byte-identical'],
  ['spikeTag', 'exports/design-system/styles.css', 'packages/ui-foundation/styles.css', 'byte-identical'],
  ['spikeTag', 'components/dom/SceneBoundary.tsx', 'packages/spatial-runtime/boundary/SceneBoundary.tsx', 'byte-identical'],
  ['spikeTag', 'components/dom/Tier0.tsx', 'packages/spatial-runtime/boundary/Tier0.tsx', 'byte-identical'],
  ['spikeTag', 'lib/capability.ts', 'packages/spatial-runtime/boundary/capability.ts', 'byte-identical'],
  ['spikeTag', 'lib/sceneStates.ts', 'packages/spatial-runtime/contract/sceneStates.ts', 'byte-identical'],
  ['spikeTag', 'lib/sceneStates.ts', 'packages/spatial-runtime/contract/cameraPoses.ts', 'byte-identical'],
  ['spikeTag', 'lib/metrics.ts', 'packages/spatial-runtime/harness/metrics.ts', 'byte-identical'],
  ['spikeTag', 'lib', 'packages/spatial-runtime/lib', 'byte-identical'],
  ['spikeTag', 'components/scene', 'packages/spatial-runtime/scene', 'ported'],
  ['spikeTag', 'tests/measure.ts', 'packages/testing/measure.ts', 'byte-identical'],
  ['spikeTag', 'tests/spike1.matrix.json', 'packages/testing/matrix.json', 'byte-identical'],
  ['spikeTag', 'scripts/run-spike1-resumable.sh', 'packages/testing/run-resumable.sh', 'byte-identical'],
  ['spikeTag', 'scripts/aggregate-spike1.mjs', 'packages/testing/aggregate.mjs', 'byte-identical'],
  ['spikeTag', 'tests/spike0.smoke.spec.ts', 'apps/neuruh-web/tests/spike0.smoke.spec.ts', 'byte-identical'],
  ['spikeTag', 'tests/spike0.baseline.spec.ts', 'apps/neuruh-web/tests/spike0.baseline.spec.ts', 'byte-identical'],
  ['spikeTag', 'tests/spike1.material.spec.ts', 'apps/neuruh-web/tests/spike1.material.spec.ts', 'byte-identical'],
  ['spikeTag', 'tests/spike1.matrix.json', 'apps/neuruh-web/tests/spike1.matrix.json', 'byte-identical'],
  ['spikeTag', 'tests/run-spike1-resumable.test.sh', 'packages/testing/run-resumable.test.sh', 'byte-identical'],
  ['spikeTag', 'app/spike1/Spike1Client.tsx', 'apps/neuruh-web/components/NeuruhExperience.tsx', 'ported'],
  ['spikeTag', 'app/globals.css', 'apps/neuruh-web/app/globals.css', 'ported'],
  ['spikeTag', 'app/icon.svg', 'apps/neuruh-web/app/icon.svg', 'byte-identical'],
  ['spikeTag', 'exports/prototype/ASSET_MANIFEST.yaml', 'assets/manifests/ASSET_MANIFEST.yaml', 'byte-identical'],
  ['spikeTag', 'exports/prototype/index.html', 'content/architecture/locked-prototype.html', 'byte-identical'],
  ['spikeTag', 'exports/handoff/COMPONENT_CONTRACTS.md', 'packages/evidence/COMPONENT_CONTRACTS.md', 'byte-identical'],
  ['spikeTag', 'exports/handoff/fixtures/working-set.json', 'content/proof/working-set.fixture.json', 'byte-identical'],
  ['spikeTag', 'docs/SCENE_CONTRACT.md', 'packages/spatial-runtime/contract/SCENE_CONTRACT.md', 'byte-identical'],
  ['spikeTag', 'docs/DESIGN_LOCK.md', 'decisions/DESIGN_LOCK.md', 'byte-identical'],
  ['spikeHead', 'PRODUCTION_PERFORMANCE_BUDGETS.md', 'decisions/PRODUCTION_PERFORMANCE_BUDGETS.md', 'byte-identical'],
  ['spikeTag', 'receipts/stage4-accept-01-arrival.png', 'receipts/references/stage4-accept-01-arrival.png', 'byte-identical'],
  ['spikeTag', 'receipts/stage4-accept-04-signature-trace.png', 'receipts/references/stage4-accept-04-signature-trace.png', 'byte-identical'],
  ['spikeTag', 'receipts/stage4-accept-06-governance-gating.png', 'receipts/references/stage4-accept-06-governance-gating.png', 'byte-identical'],
  ['spikeTag', 'receipts/stage4-accept-tier0-no-webgl.png', 'receipts/references/stage4-accept-tier0-no-webgl.png', 'byte-identical'],
]

async function hash(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex')
}

async function expand(sourceKey, sourceRel, destinationRel, mode) {
  const sourceRoot = path.join(sources[sourceKey].repository, sourceRel)
  const destinationRoot = path.join(root, destinationRel)
  if ((await stat(sourceRoot)).isFile()) return [[sourceRoot, destinationRoot, sourceRel, destinationRel]]
  const result = []
  async function walk(dir) {
    for (const name of (await readdir(dir)).sort()) {
      const sourceFile = path.join(dir, name)
      if ((await stat(sourceFile)).isDirectory()) await walk(sourceFile)
      else {
        const suffix = path.relative(sourceRoot, sourceFile)
        result.push([sourceFile, path.join(destinationRoot, suffix), path.join(sourceRel, suffix), path.join(destinationRel, suffix)])
      }
    }
  }
  await walk(sourceRoot)
  return result
}

const artifacts = []
for (const [sourceKey, sourceRel, destinationRel, mode] of mappings) {
  for (const [sourceFile, destinationFile, sourcePath, destinationPath] of await expand(sourceKey, sourceRel, destinationRel, mode)) {
    let effectiveMode = mode
    if (sourcePath.endsWith('SceneShell.tsx') || sourcePath.endsWith('SceneBoundary.tsx') || sourcePath === 'tests/measure.ts') effectiveMode = 'ported'
    artifacts.push({
      source: { ...sources[sourceKey], path: sourcePath },
      destination: destinationPath,
      mode: effectiveMode,
      sourceSha256: await hash(sourceFile),
      destinationSha256: await hash(destinationFile),
      adaptation: effectiveMode === 'ported' ? 'Production path/import adaptation or locked trs=0.75 policy; source remains unchanged.' : null,
    })
  }
}

await mkdir(path.join(root, 'receipts/provenance'), { recursive: true })
await writeFile(path.join(root, 'receipts/provenance/artifacts.json'), JSON.stringify({ generatedAt: new Date().toISOString(), upstreamDesignStudio: sources.studio, artifacts }, null, 2) + '\n')
