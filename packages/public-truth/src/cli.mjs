#!/usr/bin/env node
import path from 'node:path'
import { compileTruthFile } from './compiler.mjs'

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=')
  return [key, value.join('=')]
}))

const input = path.resolve(args.input ?? 'packages/public-truth/fixtures/verified-snapshot.input.json')
const output = path.resolve(args.output ?? 'public/truth')
const evaluationTime = args['as-of']

try {
  const compiled = await compileTruthFile(input, output, { evaluationTime })
  process.stdout.write(`public truth: ${compiled.snapshot.objects.length} objects, ${compiled.events.length} events, checksum ${compiled.signature.snapshot_sha256}\n`)
} catch (error) {
  process.stderr.write(`public truth compilation failed closed: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}

