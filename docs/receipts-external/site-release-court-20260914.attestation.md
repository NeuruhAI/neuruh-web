# ATTESTATION — neuruh.com site release court, 2026-09-14

Measured against the static export of branch `truth/estate-repair-20260914` (neuruh-run-20260914, Phase 5), not carried
forward from an earlier candidate. A later source change requires re-running these gates.

| Gate | Value | How measured |
|---|---|---|
| Broken links | 0 | `scripts/verify-dead-links.mjs` over every prerendered page: every in-site href/src resolves to a real route or public file |
| Prerendered pages checked for links | 35 | same court |
| Internal references resolved | 1617 | same court |
| Serious accessibility violations | 0 | `scripts/a11y-spines.mjs`: axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa) over 29 routes |
| Critical accessibility violations | 0 | same court |
| Accessibility viewport widths audited | 2 | 1440×900 and 390×844 |
| Accessibility colour spines audited | 2 | obsidian (prefers-color-scheme: dark) and bone (prefers-color-scheme: light), toggle boot proven by the computed `data-spine` |
| Secret-scan hits | 0 | gitleaks 8.x `detect --no-git` over app, components and lib |
| Private-path leaks | 0 | `scripts/verify-private-ip.mjs` |
| False live claims | 0 | no `data-truth-mode="LIVE"` in any prerendered document; machine-state banner absent from every footer |

Log: neuruh-run-20260914/evidence-index/a11y-root-20260914.log. Court date: 2026-09-14.
