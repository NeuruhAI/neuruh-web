/**
 * Spike measurement harness.
 *
 * Everything the two spikes claim must come out of this file, out of
 * Playwright's network layer, or out of a screenshot. Nothing is asserted from
 * inspection.
 *
 * The harness is exposed on `window.__NEURUH_SPIKE__` so the Playwright runner
 * drives the same code path a human driving the page does.
 *
 * MEASUREMENT HONESTY NOTES — these are load-bearing, not boilerplate:
 *
 *  1. A requestAnimationFrame delta measures the frame *interval*, which vsync
 *     pins at ~16.7 ms on a 60 Hz display no matter how cheap the frame is. It
 *     tells you whether frames are being dropped. It cannot tell you how much
 *     headroom is left. Both are reported and never conflated.
 *
 *  2. `sync` mode renders back to back and forces a GPU fence with a 1x1
 *     readPixels after each frame. That serialises CPU and GPU, so it slightly
 *     OVERSTATES steady-state cost (a real frame pipelines the next frame's CPU
 *     work against this frame's GPU work). It is reported as a conservative
 *     upper bound and labelled as one.
 *
 *  3. EXT_disjoint_timer_query_webgl2 is used when the browser exposes it. On
 *     current Chrome/macOS it usually is not; its absence is recorded rather
 *     than papered over.
 */

import type { WebGLRenderer, Scene, Camera, Material, Texture } from 'three'

export interface FrameStats {
  samples: number
  min: number
  p50: number
  p75: number
  p95: number
  p99: number
  max: number
  mean: number
  /** Frames whose interval exceeded 1.5x the observed vsync period. */
  dropped: number
}

export interface SceneCensus {
  drawCalls: number
  triangles: number
  points: number
  lines: number
  programs: number
  geometries: number
  textures: number
  materials: number
  /** Distinct material types present, for the decision record. */
  materialTypes: Record<string, number>
  /** MB. Analytic estimate — see estimateTextureMemory. */
  textureMemoryMb: number
  /** MB. three's transmission render target, accounted separately. */
  transmissionTargetMb: number
  /** MB. Vertex + index buffers. */
  geometryMemoryMb: number
  transmissionResolutionScale: number
  drawingBuffer: { width: number; height: number }
  pixelRatio: number
}

export interface PayloadStats {
  /** Bytes actually pulled over the wire (compressed). */
  transferredBytes: number
  /** Bytes after decompression. */
  decodedBytes: number
  jsTransferredBytes: number
  jsDecodedBytes: number
  cssTransferredBytes: number
  documentTransferredBytes: number
  otherTransferredBytes: number
  resourceCount: number
  /** Largest few resources, for attribution. */
  top: Array<{ name: string; type: string; transferred: number; decoded: number }>
}

export interface TimingStats {
  navigationStart: number
  domContentLoaded: number | null
  loadEvent: number | null
  firstPaint: number | null
  firstContentfulPaint: number | null
  /** Our own mark: capability resolved, tier chosen. */
  capabilityResolvedMs: number | null
  /** Our own mark: scene graph built, before first render. */
  sceneBuiltMs: number | null
  /** Our own mark: first rendered frame presented. */
  firstFrameMs: number | null
  /** Our own mark: scene accepts pointer input. */
  interactiveMs: number | null
  /** Wall time spent inside renderer.compile() — the shader compile stall. */
  shaderCompileMs: number | null
  /** True when KHR_parallel_shader_compile let the compile overlap. */
  parallelShaderCompile: boolean
  longTasks: Array<{ start: number; duration: number }>
  longTaskTotalMs: number
}

export interface Diagnostics {
  gpu: string | null
  vendor: string | null
  webglVersion: 'webgl' | 'webgl2' | null
  softwareRenderer: boolean
  maxTextureSize: number | null
  maxSamples: number | null
  extensions: {
    timerQuery: boolean
    colorBufferHalfFloat: boolean
    multisampledRenderToTexture: boolean
    parallelShaderCompile: boolean
  }
  userAgent: string
  hardwareConcurrency: number | null
  deviceMemory: number | null
  screen: { width: number; height: number; dpr: number }
}

export interface Snapshot {
  label: string
  url: string
  timing: TimingStats
  payload: PayloadStats
  census: SceneCensus | null
  frames: { raf: FrameStats | null; sync: FrameStats | null; gpuTimer: FrameStats | null }
  diagnostics: Diagnostics
  errors: string[]
}

// ── statistics ────────────────────────────────────────────────────────────────

export function summarise(values: number[], vsyncPeriod = 16.7): FrameStats {
  if (values.length === 0) {
    return { samples: 0, min: 0, p50: 0, p75: 0, p95: 0, p99: 0, max: 0, mean: 0, dropped: 0 }
  }
  const sorted = [...values].sort((a, b) => a - b)
  const q = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))]
  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length
  return {
    samples: sorted.length,
    min: round(sorted[0]),
    p50: round(q(50)),
    p75: round(q(75)),
    p95: round(q(95)),
    p99: round(q(99)),
    max: round(sorted[sorted.length - 1]),
    mean: round(mean),
    dropped: values.filter((v) => v > vsyncPeriod * 1.5).length,
  }
}

const round = (n: number) => Math.round(n * 100) / 100
const round3 = (n: number) => Math.round(n * 1000) / 1000

// ── texture / geometry accounting ────────────────────────────────────────────

const BYTES_PER_PIXEL: Record<number, number> = {
  1023: 4, // RGBAFormat
  1022: 3, // RGBFormat (three still reports it on some paths)
  1028: 1, // RedFormat
  1029: 2, // RGFormat
}

function textureBytes(tex: Texture): number {
  const img = tex.image as { width?: number; height?: number } | undefined
  const w = img?.width ?? 0
  const h = img?.height ?? 0
  if (!w || !h) return 0
  // three's UnsignedByteType is 1009; HalfFloatType 1016; FloatType 1015.
  const type = (tex as unknown as { type: number }).type
  const bytesPerChannel = type === 1015 ? 4 : type === 1016 ? 2 : 1
  const channels = (BYTES_PER_PIXEL[(tex as unknown as { format: number }).format] ?? 4) /
    (BYTES_PER_PIXEL[1023] / 4)
  const base = w * h * channels * bytesPerChannel
  return tex.generateMipmaps ? base * 1.3333 : base
}

/**
 * three allocates the transmission render target lazily, sized to the viewport
 * times `transmissionResolutionScale`, as HalfFloat RGBA with mipmaps AND a
 * multisample buffer of at least 4 samples (WebGLRenderer.js, renderTransmissionPass).
 * That multisample buffer is the single largest allocation a transmissive scene
 * makes and is invisible to `renderer.info`, so it is computed here explicitly
 * rather than left out of the memory number.
 */
export function estimateTransmissionTargetMb(
  drawW: number,
  drawH: number,
  scale: number,
  samples: number,
  halfFloat: boolean,
): number {
  const w = Math.max(1, Math.floor(drawW * scale))
  const h = Math.max(1, Math.floor(drawH * scale))
  const bytesPerPx = 4 * (halfFloat ? 2 : 1)
  const resolve = w * h * bytesPerPx * 1.3333 // mipmap chain
  const multisample = w * h * bytesPerPx * Math.max(1, samples)
  return (resolve + multisample) / (1024 * 1024)
}

// ── the harness ───────────────────────────────────────────────────────────────

type Marks = Partial<Record<'capabilityResolved' | 'sceneBuilt' | 'firstFrame' | 'interactive', number>>

class SpikeHarness {
  private marks: Marks = {}
  private rafSamples: number[] = []
  private recordingRaf = false
  private longTasks: Array<{ start: number; duration: number }> = []
  private errorLog: string[] = []
  private shaderCompileMs: number | null = null
  private parallelShaderCompile = false

  renderer: WebGLRenderer | null = null
  scene: Scene | null = null
  camera: Camera | null = null
  /** Set by the scene when a frame has been presented. */
  ready = false
  meta: Record<string, unknown> = {}

  constructor() {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const po = new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            this.longTasks.push({ start: round(e.startTime), duration: round(e.duration) })
          }
        })
        po.observe({ type: 'longtask', buffered: true })
      } catch {
        /* longtask unsupported — recorded as an empty list, never as zero cost */
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (e) => this.errorLog.push(`error: ${e.message}`))
      window.addEventListener('unhandledrejection', (e) =>
        this.errorLog.push(`unhandledrejection: ${String((e as PromiseRejectionEvent).reason)}`),
      )
    }
  }

  mark(name: keyof Marks) {
    if (this.marks[name] === undefined) this.marks[name] = round(performance.now())
  }

  attach(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
  }

  recordError(message: string) {
    this.errorLog.push(message)
  }

  /**
   * Compiles every program the scene needs and records the stall. This is the
   * "shader compile delay" the spike brief asks for: without it the cost hides
   * inside the first frame and gets misread as a slow first frame.
   */
  compileAndMeasure() {
    const { renderer, scene, camera } = this
    if (!renderer || !scene || !camera) return
    const gl = renderer.getContext()
    this.parallelShaderCompile = !!gl.getExtension('KHR_parallel_shader_compile')
    const t0 = performance.now()
    renderer.compile(scene, camera)
    // Force the driver to finish linking before we stop the clock; without this
    // a parallel-compiling driver reports a compile time of ~0 and the stall
    // simply reappears on the first draw.
    const buf = new Uint8Array(4)
    renderer.render(scene, camera)
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf)
    this.shaderCompileMs = round(performance.now() - t0)
  }

  startRafRecording() {
    this.rafSamples = []
    this.lastTick = performance.now()
    this.recordingRaf = true
  }

  private lastTick = 0

  /**
   * Called once per rAF tick by the scene's frame loop.
   *
   * The interval is computed here from performance.now() rather than taken from
   * the renderer's delta. R3F derives its delta from a clock that other code can
   * also read, and a second reader in the same frame leaves the subscriber with
   * a near-zero delta — which reads as a suspiciously fast page instead of as a
   * broken measurement.
   */
  tick() {
    const now = performance.now()
    const delta = now - this.lastTick
    this.lastTick = now
    if (this.recordingRaf && delta > 0 && delta < 500) this.rafSamples.push(delta)
  }

  stopRafRecording(): FrameStats {
    this.recordingRaf = false
    return summarise(this.rafSamples)
  }

  /** Summarise samples collected outside the page (batched sync measurement). */
  summariseExternal(values: number[]): FrameStats {
    return summarise(values)
  }

  /** R3F's loop control, injected by <Harness/>. */
  setFrameloop: ((mode: 'always' | 'demand' | 'never') => void) | null = null

  /**
   * Stops R3F driving the renderer so a synchronous measurement is not
   * interleaved with rAF-driven frames. Without this the sync numbers are a
   * blend of two loops and mean nothing.
   */
  pauseLoop() {
    this.setFrameloop?.('never')
  }

  resumeLoop() {
    this.setFrameloop?.('always')
  }

  /**
   * Uncapped, GPU-synchronised frame cost, in batches.
   *
   * Returns raw samples rather than a summary so the caller can accumulate
   * across batches — 150 synchronous heavy frames in one task would block the
   * main thread long enough for the browser to consider the page unresponsive.
   *
   * See honesty note 2 at the top of the file: this is a conservative upper
   * bound, not a steady-state number.
   */
  measureSyncBatch(count = 20, warmup = 0): number[] {
    const { renderer, scene, camera } = this
    if (!renderer || !scene || !camera) return []
    const gl = renderer.getContext()
    const pixel = new Uint8Array(4)
    const samples: number[] = []

    for (let i = 0; i < warmup; i++) {
      renderer.render(scene, camera)
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
    }
    for (let i = 0; i < count; i++) {
      const t0 = performance.now()
      renderer.render(scene, camera)
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
      samples.push(performance.now() - t0)
    }
    return samples
  }

  /**
   * True GPU time via EXT_disjoint_timer_query_webgl2 when the browser exposes
   * it. Returns null when it does not — which is the common case on macOS
   * Chrome and is reported as such rather than silently substituted.
   */
  async measureGpuTimer(count = 60): Promise<FrameStats | null> {
    const { renderer, scene, camera } = this
    if (!renderer || !scene || !camera) return null
    const gl = renderer.getContext() as WebGL2RenderingContext
    const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as
      | { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number }
      | null
    if (!ext) return null

    const samples: number[] = []
    for (let i = 0; i < count; i++) {
      const query = gl.createQuery()
      if (!query) break
      gl.beginQuery(ext.TIME_ELAPSED_EXT, query)
      renderer.render(scene, camera)
      gl.endQuery(ext.TIME_ELAPSED_EXT)
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => requestAnimationFrame(r))
      let available = false
      let guard = 0
      while (!available && guard++ < 200) {
        available = gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE) as boolean
        if (!available) await new Promise((r) => setTimeout(r, 1))
      }
      const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT) as boolean
      if (available && !disjoint) {
        const ns = gl.getQueryParameter(query, gl.QUERY_RESULT) as number
        samples.push(ns / 1e6)
      }
      gl.deleteQuery(query)
    }
    return samples.length ? summarise(samples) : null
  }

  census(): SceneCensus | null {
    const { renderer, scene } = this
    if (!renderer || !scene) return null
    const info = renderer.info
    const gl = renderer.getContext()

    const materials = new Set<Material>()
    const materialTypes: Record<string, number> = {}
    const textures = new Set<Texture>()
    let geometryBytes = 0
    const seenGeom = new Set<unknown>()

    scene.traverse((obj) => {
      const anyObj = obj as unknown as { material?: Material | Material[]; geometry?: unknown }
      const mats = anyObj.material
      const list = Array.isArray(mats) ? mats : mats ? [mats] : []
      for (const m of list) {
        if (materials.has(m)) continue
        materials.add(m)
        materialTypes[m.type] = (materialTypes[m.type] ?? 0) + 1
        for (const value of Object.values(m as unknown as Record<string, unknown>)) {
          const t = value as Texture | null
          if (t && (t as unknown as { isTexture?: boolean }).isTexture) textures.add(t)
        }
      }
      const geom = anyObj.geometry as
        | { attributes?: Record<string, { array?: ArrayBufferView }>; index?: { array?: ArrayBufferView } }
        | undefined
      if (geom && !seenGeom.has(geom)) {
        seenGeom.add(geom)
        for (const attr of Object.values(geom.attributes ?? {})) {
          geometryBytes += attr.array?.byteLength ?? 0
        }
        geometryBytes += geom.index?.array?.byteLength ?? 0
      }
    })

    let textureBytesTotal = 0
    textures.forEach((t) => {
      textureBytesTotal += textureBytes(t)
    })

    // Read straight off the context rather than via getDrawingBufferSize(target):
    // that call needs a THREE.Vector2, and importing one here would pull the
    // whole three runtime into the DOM-layer bundle.
    const size = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight }
    const halfFloat =
      !!gl.getExtension('EXT_color_buffer_half_float') || !!gl.getExtension('EXT_color_buffer_float')
    const maxSamples = (gl as WebGL2RenderingContext).getParameter?.(
      (gl as WebGL2RenderingContext).MAX_SAMPLES,
    ) as number | undefined
    const rendererSamples = Math.max(4, typeof maxSamples === 'number' ? Math.min(maxSamples, 4) : 4)

    const hasTransmissive = [...materials].some(
      (m) => ((m as unknown as { transmission?: number }).transmission ?? 0) > 0,
    )

    return {
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      points: info.render.points,
      lines: info.render.lines,
      programs: info.programs?.length ?? 0,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      materials: materials.size,
      materialTypes,
      textureMemoryMb: round3(textureBytesTotal / (1024 * 1024)),
      transmissionTargetMb: hasTransmissive
        ? round3(
            estimateTransmissionTargetMb(
              size.width,
              size.height,
              renderer.transmissionResolutionScale,
              rendererSamples,
              halfFloat,
            ),
          )
        : 0,
      geometryMemoryMb: round3(geometryBytes / (1024 * 1024)),
      transmissionResolutionScale: renderer.transmissionResolutionScale,
      drawingBuffer: { width: size.width, height: size.height },
      pixelRatio: renderer.getPixelRatio(),
    }
  }

  payload(): PayloadStats {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined

    let transferred = nav?.transferSize ?? 0
    let decoded = nav?.decodedBodySize ?? 0
    const documentTransferred = nav?.transferSize ?? 0
    let js = 0
    let jsDecoded = 0
    let css = 0
    let other = 0

    const rows = entries.map((e) => {
      const isJs = /\.js(\?|$)/.test(e.name) || e.initiatorType === 'script'
      const isCss = /\.css(\?|$)/.test(e.name) || e.initiatorType === 'link' || e.initiatorType === 'css'
      transferred += e.transferSize
      decoded += e.decodedBodySize
      if (isJs) {
        js += e.transferSize
        jsDecoded += e.decodedBodySize
      } else if (isCss) {
        css += e.transferSize
      } else {
        other += e.transferSize
      }
      return {
        name: e.name.replace(location.origin, ''),
        type: isJs ? 'js' : isCss ? 'css' : e.initiatorType || 'other',
        transferred: e.transferSize,
        decoded: e.decodedBodySize,
      }
    })

    rows.sort((a, b) => b.transferred - a.transferred)

    return {
      transferredBytes: transferred,
      decodedBytes: decoded,
      jsTransferredBytes: js,
      jsDecodedBytes: jsDecoded,
      cssTransferredBytes: css,
      documentTransferredBytes: documentTransferred,
      otherTransferredBytes: other,
      resourceCount: entries.length,
      top: rows.slice(0, 12),
    }
  }

  timing(): TimingStats {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const paints = performance.getEntriesByType('paint') as PerformanceEntry[]
    const fp = paints.find((p) => p.name === 'first-paint')
    const fcp = paints.find((p) => p.name === 'first-contentful-paint')
    return {
      navigationStart: 0,
      domContentLoaded: nav ? round(nav.domContentLoadedEventEnd) : null,
      loadEvent: nav && nav.loadEventEnd > 0 ? round(nav.loadEventEnd) : null,
      firstPaint: fp ? round(fp.startTime) : null,
      firstContentfulPaint: fcp ? round(fcp.startTime) : null,
      capabilityResolvedMs: this.marks.capabilityResolved ?? null,
      sceneBuiltMs: this.marks.sceneBuilt ?? null,
      firstFrameMs: this.marks.firstFrame ?? null,
      interactiveMs: this.marks.interactive ?? null,
      shaderCompileMs: this.shaderCompileMs,
      parallelShaderCompile: this.parallelShaderCompile,
      longTasks: this.longTasks,
      longTaskTotalMs: round(this.longTasks.reduce((a, t) => a + t.duration, 0)),
    }
  }

  diagnostics(): Diagnostics {
    const renderer = this.renderer
    let gpu: string | null = null
    let vendor: string | null = null
    let webglVersion: 'webgl' | 'webgl2' | null = null
    let maxTextureSize: number | null = null
    let maxSamples: number | null = null
    const extensions = {
      timerQuery: false,
      colorBufferHalfFloat: false,
      multisampledRenderToTexture: false,
      parallelShaderCompile: false,
    }

    if (renderer) {
      const gl = renderer.getContext() as WebGL2RenderingContext
      webglVersion = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ? 'webgl2' : 'webgl'
      try {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info')
        gpu = dbg ? (gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string) : (gl.getParameter(gl.RENDERER) as string)
        vendor = dbg ? (gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) as string) : (gl.getParameter(gl.VENDOR) as string)
      } catch {
        /* debug info unavailable */
      }
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number
      try {
        maxSamples = gl.getParameter(gl.MAX_SAMPLES) as number
      } catch {
        maxSamples = null
      }
      extensions.timerQuery = !!gl.getExtension('EXT_disjoint_timer_query_webgl2')
      extensions.colorBufferHalfFloat =
        !!gl.getExtension('EXT_color_buffer_half_float') || !!gl.getExtension('EXT_color_buffer_float')
      extensions.multisampledRenderToTexture = !!gl.getExtension('WEBGL_multisampled_render_to_texture')
      extensions.parallelShaderCompile = !!gl.getExtension('KHR_parallel_shader_compile')
    }

    const nav = navigator as Navigator & { deviceMemory?: number }
    return {
      gpu,
      vendor,
      webglVersion,
      softwareRenderer: !!gpu && /swiftshader|llvmpipe|software|microsoft basic render/i.test(gpu),
      maxTextureSize,
      maxSamples,
      extensions,
      userAgent: navigator.userAgent,
      hardwareConcurrency: nav.hardwareConcurrency ?? null,
      deviceMemory: nav.deviceMemory ?? null,
      screen: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
    }
  }

  snapshot(label: string): Snapshot {
    return {
      label,
      url: location.href,
      timing: this.timing(),
      payload: this.payload(),
      census: this.census(),
      frames: { raf: null, sync: null, gpuTimer: null },
      diagnostics: this.diagnostics(),
      errors: [...this.errorLog],
    }
  }
}

declare global {
  interface Window {
    __NEURUH_SPIKE__?: SpikeHarness
  }
}

export function getHarness(): SpikeHarness {
  if (typeof window === 'undefined') return new SpikeHarness()
  if (!window.__NEURUH_SPIKE__) window.__NEURUH_SPIKE__ = new SpikeHarness()
  return window.__NEURUH_SPIKE__
}

export type { SpikeHarness }
