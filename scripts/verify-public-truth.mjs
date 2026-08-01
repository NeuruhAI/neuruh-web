import { createHash } from 'node:crypto'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { compileTruthFile } from '../packages/public-truth/src/compiler.mjs'

const temporary = await mkdtemp(path.join(tmpdir(), 'neuruh-public-truth-'))
try {
  const compiled = await compileTruthFile(
    'packages/public-truth/fixtures/verified-snapshot.input.json',
    temporary,
    { evaluationTime: '2026-08-01T22:00:00.000Z' },
  )
  for (const file of ['snapshot.json', 'events.jsonl', 'signature.json']) {
    const [expected, actual] = await Promise.all([
      readFile(path.join('public/truth', file), 'utf8'),
      readFile(path.join(temporary, file), 'utf8'),
    ])
    if (expected !== actual) throw new Error(`${file} is not the deterministic compiler output`)
  }
  const digest = createHash('sha256').update(compiled.snapshotText).digest('hex')
  if (digest !== compiled.signature.snapshot_sha256) throw new Error('snapshot checksum mismatch')
  process.stdout.write(`public truth: deterministic, ${compiled.snapshot.objects.length} objects, ${compiled.events.length} events\n`)
} finally {
  await rm(temporary, { recursive: true, force: true })
}
