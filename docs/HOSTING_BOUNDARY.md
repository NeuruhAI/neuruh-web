# The Neuruh hosting boundary

One public boundary. One Command. One truth source.

```
browser
  │  https
  ▼
neuruh.com ─────────────────────────────── PUBLIC HOSTED (Vercel project neuruh-web, team anchorpointpg)
  ├─ /                     the public site (static export, unchanged)
  ├─ /deedsonar/*    307 → https://app.deedsonar.com/*   (DeedSonar, unchanged, its own auth)
  ├─ /command              the Command cockpit, operator-authenticated
  ├─ /command/login        operator sign-in (rendered by the gateway)
  └─ /api/*                THE NEURUH GATEWAY  (api/gateway.mjs)
        │ operator session → read-only allowlist → signed request
        │ (neuruh.gateway-origin.v1, HMAC over method+target+ts+nonce+subject+body)
        ▼
origin.neuruh.com ──────────────────────── PRIVATE HOSTED (Cloudflare Tunnel; optionally Access service-token)
        │ outbound-only connector (cloudflared on the organism host)
        ▼
127.0.0.1:8505  Command gateway-origin ─── PRIVATE (organism host, loopback bind)
        │ verifies the signature, routes on the SIGNED target, refuses anything
        │ that is not a Command read route, rewrites loopback URLs, writes an
        │ access-ledger line per request
        ▼
127.0.0.1:8500  Command (cockpit/server.js) ── the one read model of the organism
        │
        ▼
the governed organism ───────────────────── PRIVATE (loopback only, unchanged)
   Governance :8848 · Founder Runtime :19090 · FR Dispatch (tick) · Workers (on demand)
   Switchboard (tick) · Sentinel court :18731 · IAR :8090 · Git Custodian (in-process)
   LandOS :8410 · LandOS-Ingest (batch) · Recipe Engine (batch) · Lead Recipe OS (factory state)
   Mother :8077 · AXON :8788/:8300 · Presence :8520 · Galaxy :8400 · Qdrant · Ollama
```

The Mac is not a network endpoint. It has no public address, no forwarded port
and nothing listening off-loopback; the connector dials out. If it is offline,
neuruh.com, sign-in and the Command shell still serve and say the origin is
unreachable — the gateway never substitutes cached or synthesized truth.

## What the gateway is, and is not

It authenticates, refuses, signs, forwards and scrubs. It holds no organism
state, computes no truth, and caches nothing. It cannot reach Governance,
Founder Runtime, Workers, Sentinel, IAR or any other organ directly: Command's
read models are the only thing it can ask for, and they cannot execute.

- **Read-only by construction.** Every forwarded route is a Command GET, plus
  the two Presence exchanges Command already had (a capability-scoped chat
  session; no execute capability). Any other method is refused at the gateway
  and again at the origin.
- **Governance remains the execution authority**, Founder Runtime the
  mission/control authority, Sentinel the independent court. No approval,
  dispatch, merge, deploy or spend crosses this boundary. Founder gates are
  displayed; they are decided on the host.
- **FREE-FIRST and every other gate are untouched.** They live in the organism;
  Command reads their ledgers, the gateway relays what Command read.

## Exact URLs

### Public
| URL | What |
|---|---|
| `https://neuruh.com/` | the public site (unchanged) |
| `https://neuruh.com/command` | the Command cockpit (operator session required) |
| `https://neuruh.com/command/login` | operator sign-in |
| `https://neuruh.com/api/gateway/health` | gateway liveness — public, names no private address |
| `https://neuruh.com/api/gateway/status` | origin reachability + the Command commit the origin serves (session) |
| `https://neuruh.com/api/auth/{login,logout,session}` | session lifecycle |
| `https://neuruh.com/api/live/{events,stream,missions,control-plane,opportunities,recipes,search,economics,learning}` | live organism read models |
| `https://neuruh.com/api/{current-truth,current-truth/proof,founder-gates,briefing,command-status,workers,timeline,governance,learning,continuity,semantic,now,…}` | Command's other read models |
| `https://neuruh.com/{command-*.js,laric-*.js,surfaces-menu.js,spatial-host/*,operating-model/*}` | Command's own assets, behind the same session |
| `https://neuruh.com/deedsonar/*` | 307 → `https://app.deedsonar.com/*` |

### Backend (never in a browser)
| URL | What |
|---|---|
| `https://origin.neuruh.com` | tunnel hostname; refuses everything unsigned (401), or at the Cloudflare edge with Access (403) |
| `http://127.0.0.1:8505` | Command's gateway-origin listener on the organism host |
| `http://127.0.0.1:8500` | Command itself; serves loopback Host headers only |

## Environment-variable contract

### Vercel project `neuruh-web` (Production + Preview)
| Variable | Required | Value |
|---|---|---|
| `NEURUH_OPERATOR_KEYS` | yes | `founder=scrypt$…` (`;`-separated for more operators). Hashes only — mint with `node gateway/tools/mint-operator-key.mjs founder`. |
| `NEURUH_SESSION_SECRET` | yes | ≥32 random bytes. Rotating it signs every operator out. |
| `NEURUH_ORIGIN_URL` | yes | `https://origin.neuruh.com` |
| `NEURUH_GATEWAY_ORIGIN_SECRET` | yes | ≥32 bytes, identical to the host's `~/.neuruh/gateway/origin-secret` |
| `NEURUH_CF_ACCESS_CLIENT_ID` | no | Cloudflare Access service token (edge gate) |
| `NEURUH_CF_ACCESS_CLIENT_SECRET` | no | the token's secret |
| `NEURUH_SESSION_TTL_S` | no | session lifetime, default `43200` (12h) |

### Organism host (Command launchd job `com.neuruh.command.server`)
| Variable | Required | Value |
|---|---|---|
| `NEURUH_GATEWAY_ORIGIN_PORT` | yes | `8505` — unset means the origin listener stays off |
| `NEURUH_GATEWAY_ORIGIN_SECRET_FILE` | yes | `~/.neuruh/gateway/origin-secret`, mode 0600 (a group/world-readable file is refused) |
| `NEURUH_GATEWAY_ORIGIN_LEDGER` | no | access ledger, default `~/.neuruh/gateway-origin/access.jsonl` |
| `NEURUH_GATEWAY_ORIGIN_SECRET` | no | the secret inline; prefer the file — plists are world-readable |

No secret is ever written into a launchd plist, into git, or into anything the
browser receives.

## Deployment

Order matters: the origin exists before the gateway is told where it is.

1. **Command** (organism host) — merge the cockpit branch, move the supervised
   checkout to the merged commit, then:
   `zsh deploy/gateway-origin/enable-command-origin.sh`
   It mints the secret, adds the two variables to the launchd job (bootout +
   bootstrap; kickstart does not re-read a plist), restores the previous plist
   if anything fails, and verifies `:8500` answers while `:8505` refuses
   unsigned requests with 401. It prints the value for `NEURUH_GATEWAY_ORIGIN_SECRET`.
2. **Tunnel** (organism host) — `cloudflared tunnel login` once (browser
   consent for the neuruh.com zone), then
   `zsh deploy/gateway-origin/install-origin-tunnel.sh --hostname origin.neuruh.com --port 8505`.
   It creates the tunnel, routes the hostname, writes the ingress config,
   supervises the connector with launchd, and refuses to call it done if the
   hostname answers an unsigned request with 200.
3. **Gateway env** — set the seven variables above on `neuruh-web`
   (`vercel env add … production` / `… preview`, scope `anchorpointpg`).
4. **Deploy** — `vercel deploy --prod --scope anchorpointpg` from a clean
   checkout of the merged branch (this project has no git integration; every
   release is a CLI deploy).
5. **Prove it** — run the smoke and the browser court below against
   `https://neuruh.com`.

Rollback: remove the two variables from the Command job and restart (the origin
listener simply does not start), and/or `vercel rollback` the deployment. The
public site, DeedSonar and the organism are unaffected either way.

## Live smoke and proof

```sh
# the boundary, the surface, and no loopback anywhere
NEURUH_OPERATOR_KEY=nko_founder_… node gateway/tools/boundary-smoke.mjs --base https://neuruh.com

# ...plus: each read model compared with the canonical file on the host
#    (run ON the organism host; it re-hashes the ranked universe itself)
NEURUH_OPERATOR_KEY=… node gateway/tools/boundary-smoke.mjs --base https://neuruh.com --canonical --receipt SMOKE.json

# what the browser actually does once the page runs
PLAYWRIGHT_MODULE=~/neuruh-repos/NeuruhAI/deedsonar/node_modules/playwright \
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
NEURUH_OPERATOR_KEY=… node gateway/tools/hosted-browser-court.mjs https://neuruh.com ./court
```

The `--canonical` phase is the proof that Command reads the live organism
through the gateway rather than a copy of it: the pointer must equal
`CURRENT.json`, the gates must equal the open gates in `FOUNDER_GATES.json`
plus the PR register, the mission count must land inside the window the Founder
Runtime store moved through during the call, the ranked universe is re-hashed
here and must equal the sha the gateway served, and the event cursor must be at
or past a ledger line written *before* the read.

## Local development only

- `gateway/tools/serve-local.mjs` — the same handler as a plain Node server.
  Use `https://gateway.localhost:<port>/command` with a self-signed pair so the
  `__Host-`/Secure session cookie behaves exactly as it does in production.
- A scratch Command (`COCKPIT_PORT=8591 NEURUH_GATEWAY_ORIGIN_PORT=8592 …
  node cockpit/server.js`) reads the same live organism files read-only.
- Neither is deployed, and neither is a second gateway: production runs the same
  `gateway/handler.mjs` as a Vercel Function.

## Dependency classification

| Dependency | Class | Where |
|---|---|---|
| neuruh.com site + Command shell + gateway function | **PUBLIC HOSTED** | Vercel `neuruh-web` (anchorpointpg) |
| app.deedsonar.com | **PUBLIC HOSTED** | Vercel `deedsonar` (anchorpointpg) |
| sign.deedsonar.com (DocuSeal) | **PUBLIC HOSTED** | Contabo, behind Caddy |
| origin.neuruh.com tunnel + connector | **PRIVATE HOSTED** | Cloudflare Tunnel ↔ organism host |
| Command `:8500` and its origin `:8505` | **PRIVATE HOSTED** | organism host, loopback bind |
| Governance, Founder Runtime, FR Dispatch, Workers, Switchboard, Sentinel, IAR, Git Custodian, LandOS, LandOS-Ingest, Recipe Engine, Lead Recipe OS, Mother, AXON, Presence, Galaxy | **PRIVATE HOSTED** | organism host, loopback bind, unchanged |
| Organism ledgers, `missions.sqlite`, CURRENT_TRUTH, factory runs, ranked universe | **MANAGED DATA** (host-custodied) | organism host filesystem + `/Volumes/NEURUH-HD` |
| Supabase `efxowqudmsfqjmbeidjc` (DeedSonar production) | **MANAGED DATA** | Supabase |
| Supabase `lvdimujkfheeyqchjzra` (legacy spine) | **MANAGED DATA** | Supabase |
| Vercel environment variables (operator hashes, secrets) | **MANAGED DATA** | Vercel |
| GitHub `NeuruhAI/*` | **MANAGED DATA** | GitHub |
| `gateway/tools/serve-local.mjs`, scratch Command instances, `next dev`, Playwright courts | **LOCAL DEVELOPMENT ONLY** | this machine |

## Boundary rules worth keeping

- `/api/*` on neuruh.com is the gateway. Adding a Command read route means
  adding it to `gateway/routes.mjs` **and** `cockpit/gateway-origin.js`; both
  refuse by default.
- Command's asset paths (`/command-*.js`, `/spatial-host/*`, `/operating-model/*`)
  are reserved on neuruh.com. `tests/gateway.test.mjs` fails if the public site
  ever takes one of those names.
- The signed contract is pinned by a test vector in both repos. Change the
  canonical string on one side and both suites fail.
- Loopback URLs are rewritten to `neuruh-private://<organ>` by the origin, and
  the gateway re-scans everything it returns and counts what it had to fix
  (`X-Neuruh-Gw-Scrubbed`); a non-zero count is an origin defect, not a pass.
