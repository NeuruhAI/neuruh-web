import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const forbiddenRoots = ['apps/neuruh-web/app', 'packages/spatial-runtime/boundary', 'packages/evidence', 'packages/motion', 'packages/accessibility']
const failures = []
async function walk(dir) {
  for (const name of await readdir(dir)) {
    const file = path.join(dir, name)
    if ((await stat(file)).isDirectory()) await walk(file)
    else if (/\.[cm]?[jt]sx?$/.test(file)) {
      const source = await readFile(file, 'utf8')
      if (/from\s+['"](?:three|@react-three\/)/.test(source)) failures.push(file)
    }
  }
}
for (const root of forbiddenRoots) await walk(root)
if (failures.length) throw new Error(`Forbidden WebGL imports:\n${failures.join('\n')}`)
console.log('boundaries: non-spatial and outer-boundary modules are WebGL-free')
