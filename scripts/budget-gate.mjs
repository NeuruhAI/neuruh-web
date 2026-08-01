import { readFile } from 'node:fs/promises'

export const budgets = JSON.parse(await readFile(new URL('../budgets.json', import.meta.url), 'utf8'))

export function assertBudgets(measurement) {
  const checks = [
    ['initial payload', measurement.initialPayloadKb, budgets.payloadKb.initial],
    ['scene runtime gzip', measurement.sceneRuntimeGzipKb, budgets.payloadKb.sceneRuntimeGzip],
    ['tier-3 assets', measurement.tier3AssetsKb, budgets.payloadKb.tier3Assets],
    ['decoded assets', measurement.assetDecodedMb, budgets.assetDecodedMb],
    ['scene memory', measurement.sceneMemoryMb, budgets.sceneMemoryMb],
    ['draw calls', measurement.drawCalls, budgets.drawCalls],
  ]
  for (const [name, value, limit] of checks) {
    if (value > limit) throw new Error(`${name} budget failed: measured ${value}, limit ${limit}`)
  }
  return true
}
