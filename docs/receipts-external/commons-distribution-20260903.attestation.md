# ATTESTATION — Public commons and distribution re-verification, 2026-09-03

Public-safe extract of `NEURUH_PUBLIC_DISTRIBUTION_RELEASE3_20260903`. Every number below was
re-derived on 2026-09-03 by running the work, not by carrying a previous figure forward.

## Test totals

All 33 Python packages were cloned at the tag the Commons index advertises and their own suites
were run. These packages use a `src/` layout, so the suite is run with the package importable
(`PYTHONPATH=src python -m unittest discover -s tests`).

| Fact | Value |
|---|---|
| Python packages re-run at their advertised tag | 33 |
| Packages whose actual test count matched the advertised count | 32 |
| Tests across those 32 packages | 1,246 |
| `neuruh-sovereign-agent-starter` at `v0.1.9-alpha` | 90 |
| Total passing Python tests | 1,336 |
| `notion-auto-exporter` Node tests | 16 |
| **Total passing tests across the commons** | **1,352** |

The one mismatch was the Commons index itself: it advertised the starter at `v0.1.1-alpha` /
23 PASS. The current release is `v0.1.9-alpha` / 90 PASS. Corrected in
`NeuruhAI/public-commons`.

## Distribution surfaces

Verified from a fresh `git clone` of the public repository on a clean interpreter.

| Surface | State | Evidence |
|---|---|---|
| Clean-room `pip install .` | WORKS | Resolves all six pinned dependencies from their immutable tags |
| Generic stdio MCP client | WORKS | `initialize` → `tools/list` → `tools/call` completes over MCP newline-delimited framing |
| MCP tools exposed | 3 | `context_pack`, `cheap_route`, `proof_card` |
| Claude Code plugin install | INSTALLABLE | `/plugin marketplace add` + `/plugin install` registers 4 skills and 1 MCP server |
| Claude Code MCP tools without a prior `pip install` | 0 TOOLS | The plugin install does not install the Python package, so the server exits at import |
| xAI / Grok marketplace | SUBMITTED, AWAITING EXTERNAL REVIEW | `xai-org/plugin-marketplace#503`, open, 3/3 checks pass, not accepted and not live |
| PyPI | BLOCKED ON PACKAGE STRUCTURE | The six dependencies are `git+https` direct URLs, which PyPI rejects in distribution metadata |

## Release pointer

Every published release of `neuruh-sovereign-agent-starter` is an alpha. `v0.1.1-alpha` alone had
been marked as a stable release, so GitHub showed it as **Latest** — steering readers at the one
release whose stdio MCP server framed JSON-RPC LSP-style and which therefore no MCP client can
talk to. All releases are now marked pre-release, and the releases page shows `v0.1.9-alpha` first
with no misleading Latest badge.

Live surfaces: https://github.com/NeuruhAI · https://github.com/NeuruhAI/public-commons
