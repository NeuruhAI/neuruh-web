#!/usr/bin/env node
/**
 * Mint an operator key for the public Command surface.
 *
 *   node gateway/tools/mint-operator-key.mjs founder [--keychain]
 *
 * Prints the key once (put it in a password manager; --keychain also stores it
 * in the macOS login keychain) and the NEURUH_OPERATOR_KEYS entry to set on the
 * Vercel project. Only the scrypt hash is ever configured on the gateway, so a
 * gateway env dump does not yield a working key. Re-minting a subject's key
 * revokes every session that subject holds.
 */
import { execFileSync } from 'node:child_process'
import { hashOperatorKey, mintOperatorKey, parseOperatorKeys } from '../session.mjs'

const [subject = 'founder', ...flags] = process.argv.slice(2)
const key = mintOperatorKey(subject)
const hash = await hashOperatorKey(key)
const entry = `${subject}=${hash}`

if (!parseOperatorKeys(entry).has(subject)) {
  console.error('minted entry did not parse; refusing to print it')
  process.exit(1)
}

if (flags.includes('--keychain')) {
  execFileSync('/usr/bin/security', ['add-generic-password', '-U', '-a', subject, '-s', 'neuruh.command.operator-key', '-w', key])
  console.log(`stored in the login keychain: security find-generic-password -a ${subject} -s neuruh.command.operator-key -w\n`)
}

console.log(`OPERATOR KEY (shown once — sign in with this):\n\n  ${key}\n`)
console.log(`Set on the Vercel project (Production and Preview), appending ";" for more operators:\n\n  NEURUH_OPERATOR_KEYS=${entry}\n`)
console.log('  vercel env add NEURUH_OPERATOR_KEYS production --scope anchorpointpg   # paste the value above')
