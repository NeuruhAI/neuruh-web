// The public-truth compiler and every build-time importer use repo-root `public/truth`.
// Next serves `apps/neuruh-web/public`, so the compiled artifacts must also be published
// there or /truth/snapshot.json 404s and the "this snapshot is verifiable" claim breaks.
// Single source of truth stays repo-root; this publishes it and proves byte parity.
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const src = 'public/truth'
const dest = 'apps/neuruh-web/public/truth'
const check = process.argv.includes('--check')

const files = (await readdir(src)).sort()
await mkdir(dest, { recursive: true })
const drift = []
for (const f of files) {
  const a = await readFile(path.join(src, f))
  let b = null
  try { b = await readFile(path.join(dest, f)) } catch {}
  const same = b && createHash('sha256').update(a).digest('hex') === createHash('sha256').update(b).digest('hex')
  if (same) continue
  if (check) { drift.push(`${f}: served copy ${b ? 'differs from' : 'missing beside'} canonical public/truth`); continue }
  await writeFile(path.join(dest, f), a)
}
if (check && drift.length) throw new Error(`Served public-truth parity failed:\n${drift.join('\n')}`)
console.log(check
  ? `public-truth: ${files.length} served artifacts byte-identical to canonical`
  : `public-truth: published ${files.length} artifacts to ${dest}`)
