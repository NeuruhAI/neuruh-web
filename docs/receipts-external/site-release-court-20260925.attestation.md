# ATTESTATION — neuruh.com site release court, 2026-09-25

Measured against the built candidate of branch `fix/buyer-experience-20260925` (default branch `7d0e703` plus the
2026-09-25 buyer-experience pass). The values were measured on this candidate, not carried forward from an earlier one.
A later source change requires re-running these gates.

What changed on the public surface: the homepage hero leads with a concrete outcome and the offer ladder; the $499 offer is
renamed Property Intelligence Dossier (slug `/products/top10/property-intelligence-dossier`, old slug 308-redirected; no
Stripe link changed); product pages lead with what the buyer gets, and the commercial ladder moved from product pages to
`/proof#commercial-ladder`, dated to the 2026-09-14 Top 10 commercial court; `/solve` hands the typed target to `/contact`
in the URL fragment (never sent to the server) with an email and a Cal.com booking path; `/work-with-neuruh` no longer
repeats the offer cards; the public phone number is removed from `/contact` and the JSON-LD (founder ruling, 2026-09-25);
the meta description is 145 characters; the Open Graph image is served from a stable `/og.png`; `/proof` no longer
renders the superseded 2026-08-23 test-count court line (founder ruling, 2026-09-25; the figure stays in the snapshot
data as HISTORICAL).

The first bone-spine run found one contrast defect, fixed before these values were recorded: the BLOCKED rung label
on the `/proof` commercial ladder (#f0a3a3 on #faf9f6, 1.9:1). On product pages it had been inside a closed
disclosure; on `/proof` it is visible. Bone now uses #a13b3b.

| Gate | Value | How measured |
|---|---|---|
| Broken links | 0 | `scripts/verify-dead-links.mjs` over every prerendered page |
| Prerendered pages checked for links | 56 | same court |
| Internal references resolved | 3138 | same court |
| Serious accessibility violations | 0 | `scripts/a11y-spines.mjs`: axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa) over every sitemap route plus the 404 (54 routes) |
| Critical accessibility violations | 0 | same court |
| Accessibility viewport widths audited | 2 | 1440×900 and 390×844 |
| Accessibility colour spines audited | 2 | obsidian (prefers-color-scheme: dark) and bone (prefers-color-scheme: light) |
| Secret-scan hits | 0 | gitleaks 8.30.1 `detect --no-git` over app, components, lib, the truth compiler, the served truth and these receipts |
| Private-path leaks | 0 | `scripts/verify-private-ip.mjs` over source and prerendered HTML |
| False live claims | 0 | no `data-truth-mode="LIVE"` in any prerendered document; release court: no machine-state banner on commercial routes |

Also run on this candidate: `npm run verify` (public-truth determinism, served-truth parity, typecheck, 73 unit tests,
provenance 68 artifacts, boundaries, private-IP before and after build, checkout-link court: three existing cashiers
live HTTP 200, 27 artifact tests) and `scripts/release-court.mjs` (PASS).

Not re-measured here: the dataset verification instant stays 2026-09-16. This court re-dates only the release-court
object; every production figure on /proof keeps the date it was verified.

Court date: 2026-09-25.
