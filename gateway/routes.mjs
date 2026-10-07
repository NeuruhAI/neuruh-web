/**
 * What the public boundary will forward to the private organism, and nothing else.
 *
 * Command is read-only by construction; the gateway keeps it that way. Every
 * Command read route the Command UI calls is listed by name. Unknown /api/*
 * paths are refused here and never reach the origin. The only non-GET routes
 * are Command's two existing Presence exchanges, which never return an
 * operator credential and carry no execution authority. There is deliberately
 * no route that approves, executes, dispatches, merges, deploys or writes:
 * Governance remains the execution authority, Founder Runtime the
 * mission/control authority, Sentinel the independent court.
 *
 * Mirrors NeuruhAI/neuruh-cockpit cockpit/gateway-origin.js, which refuses again.
 */
export const COMMAND_GET_EXACT = new Set([
  '/api/health', '/api/version', '/api/organs', '/api/command-status', '/api/briefing',
  '/api/links', '/api/cases', '/api/decisions', '/api/changes', '/api/worlds',
  '/api/canon', '/api/canon/search', '/api/canon/file', '/api/knowledge/galaxy', '/api/portmap',
  '/api/context/pack', '/api/mission', '/api/laric/mission', '/api/founder-lanes', '/api/timeline',
  '/api/organ-detail', '/api/surfaces', '/api/case/detail', '/api/visual/assets', '/api/visual/trace',
  '/api/organism-dataset', '/api/current-truth', '/api/current-truth/proof', '/api/founder-gates',
  '/api/workers', '/api/capabilities', '/api/operating-model', '/api/governance', '/api/learning',
  '/api/continuity', '/api/semantic', '/api/now', '/api/broker/tools',
  '/api/broker/broker.search_canonical_knowledge', '/api/broker/broker.search_receipts',
])

export const COMMAND_LIVE_ROUTES = new Set([
  'events', 'stream', 'missions', 'control-plane', 'opportunities', 'recipes', 'search', 'economics', 'learning',
])

export const COMMAND_POST_EXACT = new Set(['/api/presence/session', '/api/presence/chat'])

export const STREAM_ROUTE = '/api/live/stream'

/* Command's page references its own assets root-absolute (/command-v2.js,
   /spatial-host/…, /operating-model/…). They are served at those paths,
   behind the same operator session, so Command runs unmodified. The public
   site owns none of these names; tests/gateway.test.mjs keeps it that way. */
export const COMMAND_ASSET = /^\/(?:(?:command|laric)-[a-z0-9-]+\.js|surfaces-menu\.js|(?:spatial-host|operating-model)\/[A-Za-z0-9._\/-]+)$/

/** Classify a public request path. `target` is the path on the origin. */
export function classify(method, pathname) {
  if (pathname === '/api/gateway/health') return { kind: 'gateway-health', public: true }
  if (pathname === '/api/gateway/status') return { kind: 'gateway-status' }
  if (pathname === '/api/auth/login') return { kind: 'auth-login', public: true }
  if (pathname === '/api/auth/logout') return { kind: 'auth-logout', public: true }
  if (pathname === '/api/auth/session') return { kind: 'auth-session', public: true }
  if (pathname === '/command/login') return { kind: 'login-page', public: true }
  const read = method === 'GET' || method === 'HEAD'
  if (pathname === '/command') return read ? { kind: 'command-ui', target: '/' } : { kind: 'method-refused' }
  if (pathname.startsWith('/command/')) return { kind: 'command-redirect' }
  if (COMMAND_ASSET.test(pathname) && !pathname.includes('..')) {
    return read ? { kind: 'command-ui', target: pathname } : { kind: 'method-refused' }
  }
  if (!pathname.startsWith('/api/')) return { kind: 'not-found' }
  if (method === 'POST') {
    return COMMAND_POST_EXACT.has(pathname) ? { kind: 'command-post', target: pathname } : { kind: 'method-refused' }
  }
  if (!read) return { kind: 'method-refused' }
  if (pathname === STREAM_ROUTE) return { kind: 'command-stream', target: pathname }
  if (COMMAND_GET_EXACT.has(pathname)) return { kind: 'command-api', target: pathname }
  if (pathname.startsWith('/api/live/') && COMMAND_LIVE_ROUTES.has(pathname.slice('/api/live/'.length))) {
    return { kind: 'command-api', target: pathname }
  }
  return { kind: 'not-found' }
}
