/**
 * Deterministic PRNG.
 *
 * ENGINEERING_HANDOFF.md §5: "the scene must expose a ?seed= and ?frame=
 * parameter so captures are reproducible. Without this, regression testing a
 * live scene is noise. This is an implementation requirement, not a
 * nice-to-have."
 *
 * Every random decision in the scene draws from here. `Math.random` is not
 * called anywhere in the scene modules.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function readSeed(search = typeof window !== 'undefined' ? window.location.search : ''): number {
  const raw = new URLSearchParams(search).get('seed')
  const n = raw === null ? NaN : Number(raw)
  return Number.isFinite(n) ? n : 20260731
}

/**
 * `?frame=N` pins the scene clock to a fixed time so a screenshot is
 * reproducible. Returns null when the clock should run freely.
 */
export function readPinnedFrame(
  search = typeof window !== 'undefined' ? window.location.search : '',
): number | null {
  const raw = new URLSearchParams(search).get('frame')
  const n = raw === null ? NaN : Number(raw)
  return Number.isFinite(n) ? n : null
}
