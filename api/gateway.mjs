/**
 * Vercel Function: the Neuruh gateway. vercel.json rewrites /api/*, /command,
 * /command/* and Command's asset paths here; gateway/handler.mjs does the rest.
 * Configuration is environment-only (see docs/HOSTING_BOUNDARY.md).
 */
import { createGateway } from '../gateway/handler.mjs'

const handle = createGateway(process.env)

export default {
  fetch(request) {
    return handle(request)
  },
}
