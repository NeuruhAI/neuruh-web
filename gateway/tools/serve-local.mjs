#!/usr/bin/env node
/**
 * LOCAL DEVELOPMENT ONLY — run the gateway as a plain Node server so the whole
 * chain (browser → gateway → signed origin → Command → organism) can be
 * exercised on the host before anything is exposed. Production runs the same
 * handler as a Vercel Function; nothing here is deployed.
 *
 *   NEURUH_ORIGIN_URL=http://127.0.0.1:8592 \
 *   NEURUH_GATEWAY_ORIGIN_SECRET=… NEURUH_SESSION_SECRET=… NEURUH_OPERATOR_KEYS=… \
 *   node gateway/tools/serve-local.mjs --port 4390
 *
 * Open https://gateway.localhost:<port>/command — a hostname that is not
 * loopback-literal, so Command runs in hosted mode exactly as it will on
 * neuruh.com, while still resolving to this machine.
 *
 * The session cookie is `__Host-`/Secure, which browsers only accept over TLS,
 * so pass a self-signed pair (NEURUH_LOCAL_TLS_CERT / NEURUH_LOCAL_TLS_KEY) to
 * exercise the real sign-in path locally instead of weakening the cookie.
 */
import http from 'node:http'
import https from 'node:https'
import fs from 'node:fs'
import { Readable } from 'node:stream'
import { createGateway } from '../handler.mjs'

const args = process.argv.slice(2)
const port = Number(args[args.indexOf('--port') + 1]) || Number(process.env.PORT) || 4390
const handle = createGateway(process.env)
const tls = process.env.NEURUH_LOCAL_TLS_CERT && process.env.NEURUH_LOCAL_TLS_KEY
  ? { cert: fs.readFileSync(process.env.NEURUH_LOCAL_TLS_CERT), key: fs.readFileSync(process.env.NEURUH_LOCAL_TLS_KEY) }
  : null

const listener = async (req, res) => {
  const url = new URL(req.url, `${tls ? 'https' : 'http'}://${req.headers.host || '127.0.0.1:' + port}`)
  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : Readable.toWeb(req)
  const request = new Request(url, { method: req.method, headers, body, duplex: 'half' })
  const out = await handle(request)
  res.writeHead(out.status, Object.fromEntries(out.headers))
  if (!out.body) return res.end()
  for await (const chunk of out.body) {
    res.write(chunk)
    res.flushHeaders?.()
  }
  res.end()
}

const server = tls ? https.createServer(tls, listener) : http.createServer(listener)
server.listen(port, '127.0.0.1', () => {
  console.log(`  neuruh gateway (local) ${tls ? 'https' : 'http'}://gateway.localhost:${port}/command`)
})
