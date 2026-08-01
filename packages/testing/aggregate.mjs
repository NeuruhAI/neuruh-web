#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MATRIX_FILE = resolve(ROOT, 'tests/spike1.matrix.json')
const ROWS_DIR = resolve(ROOT, 'receipts/spike1-rows')
const RESULTS_FILE = resolve(ROOT, 'benchmarks/SPIKE_1_RESULTS.json')
const matrix = JSON.parse(readFileSync(MATRIX_FILE, 'utf8'))
const prior = JSON.parse(readFileSync(RESULTS_FILE, 'utf8'))
const finite = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

function fail(message) {
  throw new Error(`Spike 1 receipt validation failed: ${message}`)
}

function validate(spec) {
  const saved = JSON.parse(readFileSync(resolve(ROWS_DIR, `${spec.id}.json`), 'utf8'))
  const { row, raw } = saved
  const keys = Object.keys(spec.params).sort()
  if (row?.id !== spec.id || raw?.id !== spec.id || raw?.label !== spec.id) fail(`${spec.id}: identity mismatch`)
  if (row?.group !== spec.group || row?.note !== spec.note) fail(`${spec.id}: manifest text mismatch`)
  if (JSON.stringify(Object.keys(raw?.params ?? {}).sort()) !== JSON.stringify(keys)) fail(`${spec.id}: parameter keys mismatch`)
  for (const key of keys) if (raw.params[key] !== spec.params[key]) fail(`${spec.id}: parameter ${key} mismatch`)
  for (const errors of [row?.errors, raw?.errors, raw?.consoleErrors]) {
    if (!Array.isArray(errors) || errors.length !== 0) fail(`${spec.id}: errors present or missing`)
  }
  if (raw?.diagnostics?.softwareRenderer !== false) fail(`${spec.id}: software renderer`)
  if (!/metal/i.test(raw?.diagnostics?.gpu ?? '') || /swiftshader|software|llvmpipe/i.test(raw.diagnostics.gpu)) {
    fail(`${spec.id}: invalid GPU diagnostics`)
  }
  const required = [
    row?.gpuP95,
    row?.syncP95,
    row?.rafP95,
    row?.sceneMemoryMb,
    row?.drawCalls,
    row?.transferredKb,
    row?.firstFrameMs,
    raw?.frames?.gpuTimer?.p95,
    raw?.frames?.sync?.p95,
    raw?.frames?.raf?.p95,
    raw?.census?.drawCalls,
    raw?.census?.drawingBuffer?.width,
    raw?.census?.drawingBuffer?.height,
  ]
  if (!required.every(finite)) fail(`${spec.id}: required measurement missing or non-finite`)

  if (spec.shot) {
    const png = readFileSync(resolve(ROOT, 'receipts', `${spec.shot}.png`))
    if (png.length <= pngSignature.length || !png.subarray(0, pngSignature.length).equals(pngSignature)) {
      fail(`${spec.id}: visual receipt is not a valid PNG`)
    }
  }

  return { ...row, receiptKind: spec.shot ? 'measurement+visual' : 'measurement-only' }
}

if (matrix.length !== 27 || new Set(matrix.map((row) => row.id)).size !== 27) fail('matrix is not 27 unique rows')
const rows = matrix.map(validate)
const at = (id) => rows.find((row) => row.id === id)
const routeEvidence = prior.routes
if (!routeEvidence?.tier0CopyRetained || routeEvidence.signatureTraceCompleted !== 'complete') {
  fail('persisted route evidence is incomplete')
}

const budgets = {
  frameMsDesktop: 16.7,
  frameMsMobile: 22,
  sceneMemoryMb: 220,
  drawCalls: 120,
  initialPayloadKb: 180,
  firstMeaningfulMs: 1200,
}
const winning = at('E-phys-L2-trs0.75')
const full = at('A-phys-L2-dpr2')
const corroboration = at('G-tier3-shipping')
const firstFrames = rows.map((row) => row.firstFrameMs)

const result = {
  schemaVersion: 2,
  spike: 1,
  generatedAt: new Date().toISOString(),
  gateResult: 'DIRECTION_A_REQUIRES_CONTROLLED_REDUCTION',
  question: 'How many stacked live transmissive membranes preserve Direction A inside the locked budgets?',
  decisionBasis: {
    thesisPreserved: true,
    fullPlanProven: false,
    explanation:
      'Two real MeshPhysicalMaterial sheets remain live, refractive, and state-driven at transmissionResolutionScale=0.75. ' +
      'The original discrete-GPU plan is not fully proven: only an Apple M1 integrated GPU was available, full-resolution ' +
      'transmission leaves inadequate production-asset memory headroom, and formal art-direction approval is still required.',
  },
  budgets,
  device: {
    measuredGpu: rows[0].drawingBuffer ? 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)' : null,
    class: 'integrated GPU; 8 GB unified memory; 8 CPU/GPU capability cores reported by Chromium',
    browser: 'Playwright Chromium 151, headed, ANGLE Metal, software rasterisation rejected',
    interpretation:
      'The forced tier/DPR matrix defines tier behavior on the available machine; it does not substitute for the plan-required ' +
      'mid-range discrete laptop, mid-range Android, and recent iPhone measurements.',
  },
  exactSettings: {
    common: { seed: 20260731, viewportCss: '1440x900', heroState: 'metabolism', camera: 'close' },
    physical: {
      type: 'three MeshPhysicalMaterial',
      transmission: 0.72,
      baseThickness: 0.4,
      ior: 1.36,
      roughness: '0.16 + 0.10 × stackDepth + 0.06 × state presence',
      attenuationColor: '#22323f',
      attenuationDistance: '3.4 - 2.2 × state presence',
      normalScale: 1,
      side: 'FrontSide',
      transparent: false,
      depthWrite: false,
      stateMapping: 'presence changes thickness and attenuation; transmission and IOR stay fixed',
    },
    ssr: {
      type: 'drei MeshTransmissionMaterial',
      resolution: 512,
      samples: 6,
      chromaticAberration: 0.035,
      anisotropicBlur: 0.4,
      distortion: 0.15,
      backside: false,
    },
    fresnel: 'MeshPhysicalMaterial plus onBeforeCompile analytic scatter; transmission=0; explicitly not refraction',
    baked: 'MeshPhysicalMaterial; transmission=0; procedural normal/thickness maps; constant alpha; tier 2/1 fallback',
  },
  acceptedConfiguration: {
    tier: 3,
    dpr: 2,
    approach: 'physical',
    liveLayers: 2,
    transmissionResolutionScale: 0.75,
    gpuP95Ms: winning.gpuP95,
    gpuP95PassesMs: winning.gpuP95Samples,
    syncP95Ms: winning.syncP95,
    sceneMemoryMb: winning.sceneMemoryMb,
    drawCalls: winning.drawCalls,
    firstMeaningfulMs: winning.firstFrameMs,
    rationale:
      'Keeps both membranes genuinely live while cutting the transmission target from about 209 MB to about 117 MB; ' +
      'the static 1.0/0.75 receipts show no obvious loss at capture resolution, subject to required art-direction sign-off.',
  },
  fullResolutionEvidence: {
    primary: { id: full.id, gpuP95Ms: full.gpuP95, gpuP95PassesMs: full.gpuP95Samples, sceneMemoryMb: full.sceneMemoryMb },
    independentLoad: { id: corroboration.id, gpuP95Ms: corroboration.gpuP95, gpuP95PassesMs: corroboration.gpuP95Samples },
    interpretation:
      'Both median p95 results pass 16.7 ms, but the primary load includes an 18.18 ms pass and consumes 95.5% of the ' +
      'scene-memory budget before final PBR assets. It is evidence of feasibility, not the production choice.',
  },
  rejectedConfigurations: [
    { id: 'C-ssr-L2-dpr2', reason: '80.99 ms GPU p95; one private FBO per material scales poorly' },
    { id: 'D-ssr-L4-dpr2', reason: '149.78 ms GPU p95; decisively over budget' },
    { id: 'F-phys-L2-doubleSided', reason: '31.68 ms GPU p95; double-sided transmission is over budget' },
    { id: 'C-fresnel-L2-dpr2', reason: '5.27 ms, but has no refraction and cannot prove the live material thesis' },
    { id: 'C-baked-L2-dpr2', reason: '5.06 ms, but has no transmission; fallback only' },
    { id: 'A-phys-L2-dpr2', reason: 'passes frame median but uses 210.183 MB; rejected for inadequate asset headroom' },
    { id: 'E-phys-L2-trs0.5', reason: 'reserve fallback; adds avoidable resolution loss' },
    { id: 'E-phys-L2-trs0.25', reason: 'last-resort fallback; adds avoidable resolution loss' },
  ],
  tiers: {
    tier3: 'DPR 2; two live FrontSide physical sheets at transmissionResolutionScale=0.75, pending art/device approval',
    tier2: 'DPR 1.5; four baked sheets; 4.22 ms GPU p95, 2.772 MB, 13 draw calls',
    tier1: 'DPR 1; three baked sheets; 1.64 ms GPU p95, 2.759 MB, 11 draw calls',
    tier0: 'authored static DOM composition; all 59 copy blocks retained; no live WebGL scene',
    reducedMotion:
      'All eight semantic states remain reachable with camera cuts. The persisted full-resolution live row is over budget at ' +
      '19.17 ms; the selected 0.75 configuration must be remeasured on this route.',
  },
  performanceFindings: {
    frameTime: 'GPU timer p95 is primary; forced-sync p95 is a conservative upper bound; rAF is vsync evidence, not headroom.',
    memory:
      'Estimated compact-scene memory: 210.183 MB at full DPR-2 transmission versus 118.832 MB at scale 0.75. ' +
      'This is analytic allocation, not a driver reading.',
    drawCalls: `Observed range ${Math.min(...rows.map((row) => row.drawCalls))}-${Math.max(...rows.map((row) => row.drawCalls))}, under 120; SSR nested renders are under-counted.`,
    payload:
      `Tier-0 cold initial transfer ${routeEvidence.tier0TransferredKb} KB, under 180 KB. Scene routes transfer 412.9 KB including the dynamically loaded WebGL runtime; that is not the before-scene budget.`,
    firstMeaningful:
      `First scene frame range ${Math.min(...firstFrames)}-${Math.max(...firstFrames)} ms; all 27 rows are under 1200 ms.`,
  },
  visualAndDesignLock: {
    status: 'mechanics preserved; launch-fidelity approval outstanding',
    preserved:
      'Live refraction, state-driven membrane thickness/attenuation, engineered tissue, governance core, evidence channels, ' +
      'receipt-return state, fixed-axis camera language, and authored fallbacks remain intact.',
    interpretation:
      'R3F and locked SVG have no shared raster basis. Screenshots establish material behavior and composition, not pixel parity. ' +
      'The 1.0/0.75 comparison is a manual static assessment; matrix captures do not pin ?frame=.',
    defects:
      'The unconditional tier-0 note was found and fixed in CSS. Existing pre-fix screenshots retain that stale note. ' +
      'The fragmented story capture also shows excessive dark membrane occlusion that needs production art direction.',
  },
  fallbackRoute: {
    normal: 'Tier 2/1 use baked thickness + normal; Tier 0 uses the authored static composition with full copy.',
    contingency:
      'If the two-layer 0.75 route fails the named device checks, test one live physical layer at 0.75 before any baked-only proposal. ' +
      'If no live layer holds, select DIRECTION_A_FAILED_SPIKE_1 and reopen A/B/C.',
  },
  knownLimitations: [
    'No mid-range discrete GPU, mid-range Android, or recent iPhone was available.',
    'Final glTF/KTX2 assets, production textures, subsurface treatment, and depth of field are absent.',
    'Memory is analytically estimated; SSR nested draw calls are not visible to renderer.info.',
    'GPU timer samples show run variance; the full-resolution two-layer primary row has a 4.86 ms p95 spread.',
    'Reduced-motion performance exists only for full-resolution transmission and must be rerun at scale 0.75.',
    'Existing visual receipts predate the tier-0-note visibility fix and are not launch-art approval.',
  ],
  receiptValidation: {
    matrixRows: matrix.length,
    validRows: rows.length,
    visualRows: matrix.filter((row) => row.shot).length,
    measurementOnlyRows: matrix.filter((row) => !row.shot).length,
    failures: 0,
    gpuRule: 'Metal required; software, SwiftShader, and llvmpipe rejected',
  },
  routes: {
    ...routeEvidence,
    evidenceSource:
      'Persisted from the successful pre-repair full aggregation and cross-checked against its screenshots; final browser rerun ' +
      'was blocked in the managed workspace by listen EPERM.',
  },
  rows,
}

writeFileSync(RESULTS_FILE, `${JSON.stringify(result, null, 2)}\n`)
console.log(`Spike 1 aggregate: ${rows.length}/27 valid; gate=${result.gateResult}`)
