# ATTESTATION — neuruh.com site release court, 2026-09-16

Measured against the built candidate of branch `t03/public-convergence-20260916`. That branch is the default branch
merged with `main` (truth/estate-repair 2026-09-14), with the 2026-09-16 production-truth recourt and the issue #10 convergence
surfaces (`/solve`, `/problems` and its six failure modes, `/faq`) on top. The values were measured on this candidate, not carried
forward from an earlier one. A later source change requires re-running these gates.

| Gate | Value | How measured |
|---|---|---|
| Broken links | 0 | `scripts/verify-dead-links.mjs` over every prerendered page |
| Prerendered pages checked for links | 56 | same court |
| Internal references resolved | 3117 | same court |
| Serious accessibility violations | 0 | `scripts/a11y-spines.mjs`: axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa) over every sitemap route plus the 404 (54 routes), and `scripts/a11y-court.mjs` over the server build |
| Critical accessibility violations | 0 | same courts |
| Accessibility viewport widths audited | 2 | 1440×900 and 390×844 |
| Accessibility colour spines audited | 2 | obsidian (prefers-color-scheme: dark) and bone (prefers-color-scheme: light) |
| Secret-scan hits | 0 | gitleaks 8.30.1 `detect --no-git` over app, components, lib, the truth compiler, the served truth and these receipts |
| Private-path leaks | 0 | `scripts/verify-private-ip.mjs` over source and prerendered HTML, including the nine new routes |
| False live claims | 0 | no `data-truth-mode="LIVE"` in any prerendered document; no machine-state banner; snapshot `live_connectivity=false`, compiled at its verification instant |

The first bone-spine run found two contrast defects; both were fixed before these values were recorded:

- An unscoped polish rule painted every `<header>` dark, including the semantic page heroes.
- The Top 10 secondary buttons used a literal dark background.

Court date: 2026-09-16.
