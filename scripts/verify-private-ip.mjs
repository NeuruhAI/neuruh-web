#!/usr/bin/env node
/**
 * Fail closed if public commercial surfaces leak Neuruh Core / factory internals.
 * Doctrine: SHOW THE MAGIC, SELL THE DEPTH, NEVER SHIP THE FACTORY.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const SOURCE_ROOTS = [
  'apps/neuruh-web/app',
  'apps/neuruh-web/components',
  'apps/neuruh-web/lib',
]

const SOURCE_EXTENSIONS = /\.(tsx|ts|mjs|css)$/
const HTML_ROUTES = [
  'index',
  'offers',
  'ask',
  'work-with-neuruh',
  'thank-you',
  'cases',
  'contact',
  'proof',
]

const FORBIDDEN = [
  { id: 'mother-organ', re: /\bMother\b/ },
  { id: 'axon', re: /\bAXON\b/ },
  { id: 'aegis', re: /\bAegis\b/ },
  { id: 'iar', re: /\bIAR\b/ },
  { id: 'rei-x', re: /\bREI[-_ ]?X\b/i },
  { id: 'recipe-engine', re: /recipe[- ]engine|scoring weights|weight vector|recipe weights/i },
  { id: 'secret-topology', re: /secret topology|factory topology/i },
  { id: 'system-prompt', re: /system prompt|hidden prompt/i },
  { id: 'customer-data', re: /customer PII|tenant dump|customer_data/i },
  { id: 'local-path', re: /(?:^|[\s"'`])\/(?:Users|home)\// },
  { id: 'secret-token', re: /(?:sk|ghp|github_pat)_[A-Za-z0-9_-]{12,}/ },
]

const failures = []

async function walk(dir, files = []) {
  for (const name of await readdir(dir)) {
    const file = path.join(dir, name)
    if ((await stat(file)).isDirectory()) await walk(file, files)
    else if (SOURCE_EXTENSIONS.test(file)) files.push(file)
  }
  return files
}

function scan(label, text) {
  for (const rule of FORBIDDEN) {
    if (rule.re.test(text)) failures.push(`${label}: ${rule.id}`)
  }
}

for (const root of SOURCE_ROOTS) {
  for (const file of await walk(root)) {
    scan(file, await readFile(file, 'utf8'))
  }
}

const htmlRoot = 'apps/neuruh-web/.next/server/app'
for (const route of HTML_ROUTES) {
  const file = path.join(htmlRoot, `${route}.html`)
  try {
    scan(`html:${route}`, await readFile(file, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

if (failures.length) {
  throw new Error(`private-IP leakage court FAILED\n${failures.join('\n')}`)
}
console.log('private-IP: PASS — no factory internals on scanned public surfaces')
