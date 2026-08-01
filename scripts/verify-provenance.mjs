import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const receipt = JSON.parse(await readFile('receipts/provenance/artifacts.json', 'utf8'))
const failures = []
for (const artifact of receipt.artifacts) {
  const digest = createHash('sha256').update(await readFile(artifact.destination)).digest('hex')
  if (digest !== artifact.destinationSha256) failures.push(`${artifact.destination}: changed after receipt`)
  if (artifact.mode === 'byte-identical' && digest !== artifact.sourceSha256) failures.push(`${artifact.destination}: not byte-identical`)
}
if (failures.length) throw new Error(`Provenance verification failed:\n${failures.join('\n')}`)
console.log(`provenance: ${receipt.artifacts.length} artifacts verified`)
