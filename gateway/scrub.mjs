/**
 * The last line of the "no browser-visible localhost URL" guarantee.
 *
 * The origin already rewrites loopback URLs to neuruh-private://<organ>/...
 * using the organism manifest it owns. The gateway re-scans every text body it
 * returns and rewrites anything that slipped through to a label-free form, so
 * the public boundary holds even if the origin regresses. Each rewrite is
 * counted in x-neuruh-gw-scrubbed; a non-zero count is an origin defect.
 */
const LOOPBACK_URL = /\b(?:https?|wss?):\/\/(?:127(?:\.\d{1,3}){3}|localhost|0\.0\.0\.0|\[::1\])(?::(\d{1,5}))?/gi
const LOOPBACK_HOSTPORT = /\b(?:127\.0\.0\.1|localhost|0\.0\.0\.0):(\d{2,5})\b/gi

const TEXT_TYPES = /^(?:text\/|application\/(?:json|javascript|x-javascript|ld\+json|manifest\+json)|image\/svg\+xml)/i

export function isScrubbable(contentType) {
  return TEXT_TYPES.test(String(contentType || ''))
}

export function scrubText(text) {
  let count = 0
  const out = String(text)
    .replace(LOOPBACK_URL, (_m, port) => { count += 1; return `neuruh-private://loopback${port ? '-' + port : ''}` })
    .replace(LOOPBACK_HOSTPORT, (_m, port) => { count += 1; return `neuruh-private:loopback-${port}` })
  return { text: out, count }
}

export function findLoopback(text) {
  const s = String(text)
  const hits = []
  for (const re of [LOOPBACK_URL, LOOPBACK_HOSTPORT]) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(s)) && hits.length < 20) hits.push(s.slice(Math.max(0, m.index - 40), m.index + m[0].length + 20))
  }
  return hits
}

/**
 * Streaming scrub for text/event-stream: SSE frames end in a blank line, so a
 * URL can only straddle chunk boundaries inside an unfinished frame. Hold the
 * unfinished tail and scrub whole frames.
 */
export function sseScrubber(onCount) {
  let tail = ''
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  return new TransformStream({
    transform(chunk, controller) {
      tail += decoder.decode(chunk, { stream: true })
      const cut = tail.lastIndexOf('\n\n')
      if (cut < 0) return
      const { text, count } = scrubText(tail.slice(0, cut + 2))
      tail = tail.slice(cut + 2)
      if (count) onCount(count)
      controller.enqueue(encoder.encode(text))
    },
    flush(controller) {
      tail += decoder.decode()
      if (!tail) return
      const { text, count } = scrubText(tail)
      if (count) onCount(count)
      controller.enqueue(encoder.encode(text))
    },
  })
}
