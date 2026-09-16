/**
 * The two pages the gateway itself renders: operator sign-in, and the honest
 * "origin offline" page. Self-contained (no external resources and no
 * scripts) so they satisfy the strict CSP the gateway sets on them.
 */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const STYLE = `
:root{--bg:#eef1f4;--panel:#fff;--ink:#0e1318;--soft:#5b6875;--line:#d4dbe2;--steel:#5b7ca3;--lake:#337fa5;--bad:#a4452c}
@media (prefers-color-scheme:dark){:root{--bg:#07090b;--panel:#10151a;--ink:#e6ebf0;--soft:#8d9aa7;--line:#243039;--steel:#7f9cc0;--lake:#5aa6cc;--bad:#e08a70}}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif}
main{min-height:100vh;display:grid;place-items:center;padding:24px 16px}
.card{width:min(440px,100%);background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:28px 24px;box-shadow:0 18px 50px rgba(0,0,0,.08)}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.14em;font-size:13px}
.brand i{width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 35%,var(--lake),var(--steel));display:inline-block}
.brand span{color:var(--soft);font-weight:600}
h1{font-size:20px;margin:18px 0 6px;font-weight:620}
p{color:var(--soft);margin:0 0 16px;font-size:14px}
label{display:block;font-size:12px;letter-spacing:.08em;color:var(--soft);margin-bottom:6px}
input[type=password]{width:100%;padding:12px;border:1px solid var(--line);border-radius:9px;background:transparent;color:var(--ink);font:14px ui-monospace,Menlo,monospace}
input:focus,button:focus,a:focus{outline:2px solid var(--lake);outline-offset:2px}
button,.btn{display:inline-block;margin-top:14px;min-height:44px;padding:11px 18px;border:0;border-radius:9px;background:var(--ink);color:var(--bg);font-weight:600;font-size:14px;cursor:pointer;text-decoration:none}
.err{color:var(--bad);font-size:13px;margin:10px 0 0}
.mono{font:12px/1.5 ui-monospace,Menlo,monospace;color:var(--soft);margin-top:18px;overflow-wrap:anywhere}
`

function shell(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title><style>${STYLE}</style></head>
<body><main><section class="card">${body}</section></main></body></html>`
}

export function loginPage({ next = '/command', error = null } = {}) {
  return shell('Neuruh Command · Sign in', `
<div class="brand"><i aria-hidden="true"></i>NEURUH <span>· COMMAND</span></div>
<h1>Operator sign-in</h1>
<p>Command is the operator surface of the Neuruh organism. It is read-only here: nothing is approved, executed or sent from this page.</p>
<form method="post" action="/api/auth/login">
  <input type="hidden" name="next" value="${esc(next)}">
  <label for="key">OPERATOR KEY</label>
  <input id="key" name="key" type="password" autocomplete="current-password" required minlength="40" spellcheck="false" autofocus>
  ${error ? `<p class="err" role="alert">${esc(error)}</p>` : ''}
  <button type="submit">Sign in</button>
</form>`)
}

export function originOfflinePage({ reason, checkedAt }) {
  return shell('Neuruh Command · Origin offline', `
<div class="brand"><i aria-hidden="true"></i>NEURUH <span>· COMMAND</span></div>
<h1>The organism origin is not reachable</h1>
<p>You are signed in. Command reads the organism live through the gateway's signed origin tunnel, and that origin is not answering right now. The gateway does not substitute cached or synthesized truth.</p>
<a class="btn" href="/command">Try again</a>
<form method="post" action="/api/auth/logout" style="display:inline"><button type="submit" style="margin-left:8px;background:transparent;color:var(--ink);border:1px solid var(--line)">Sign out</button></form>
<div class="mono">reason: ${esc(reason)}<br>checked: ${esc(checkedAt)}</div>`)
}
