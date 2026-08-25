// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */

export const PRODUCTS = [
    {
        id: "neuruh",
        name: "Neuruh",
        mark: "NR",
        domain: "neuruh.com",
        tagline: "Intelligence infrastructure that can act.",
        thesis: "Neuruh is not a chatbot company and not a loose collection of vertical SaaS. It is one operating architecture: sources become signals, signals compile into recipes, recipes become decisions, decisions become actions, and actions emit receipts that the system can learn from.",
        loopStory: "The public site is the atlas of that organism. The verticals are organs. The primitives are shared tissue.",
        primitives: [
            "source-factory",
            "signal-layer",
            "recipe-engine",
            "axon",
            "mother",
            "agent-runtime",
            "governance",
            "proofos",
            "venture-factory"
        ],
        statusNotes: [
            {
                status: "LIVE",
                claim: "neuruh.com resolves on GoDaddy Website Builder as a Launching Soon placeholder.",
                source: "HTTPS GET neuruh.com, 2026-08-24. Server: DPS/2.0.0. NS: domaincontrol.com.",
                url: "https://neuruh.com",
                observedAt: "2026-08-24"
            },
            {
                status: "BUILT",
                claim: "This repository is the isolated public-web source. Production DNS still points at GoDaddy until cutover.",
                source: "Origin repo neuruh/tmp-b85916a10c0cf9a9; empty at start of this work."
            }
        ],
        commercial: [
            "build",
            "license",
            "white-label",
            "embed",
            "deploy"
        ]
    },
    {
        id: "deedsonar",
        name: "DeedSonar",
        mark: "DE",
        domain: "deedsonar.com",
        tagline: "The loop, aimed at land.",
        thesis: "DeedSonar is the first fully manifested organ: a login-gated operator desk for acquisition, disposition, and transaction management over a mapped estate. It is CRM, but CRM with coordinates, signals, and halt gates.",
        loopStory: "A recipe such as “5+ acres, estate/trust, 15+ year tenure, tax delinquent, high equity, no listing” is the kind of question the desk is built to hold. The public app does not currently offer anonymous search. Accounts are provisioned by an administrator.",
        primitives: [
            "source-factory",
            "signal-layer",
            "recipe-engine",
            "agent-runtime",
            "governance",
            "proofos"
        ],
        statusNotes: [
            {
                status: "LIVE",
                claim: "app.deedsonar.com is a running Next.js application on Vercel with Leaflet maps. Unauthenticated routes redirect to /login.",
                source: "HTTPS GET https://deedsonar.com → https://app.deedsonar.com/login, 2026-08-24.",
                url: "https://app.deedsonar.com/login",
                observedAt: "2026-08-24"
            },
            {
                status: "BUILT",
                claim: "Public JS describes DeskGrid modules: inbox, call queue, TCPA drips, contracts, tasks, pipeline, signals, AI approvals, map. Operator universes: current estate, all CRM, historical CRM. Geography copy includes North Carolina, South Carolina, Tennessee.",
                source: "app.deedsonar.com/_next/static/chunks/app/(app)/page-*.js"
            },
            {
                status: "PROVEN",
                claim: "The running login and compiled operator copy are inspectable. Deal outcomes, coverage counts, and conversion are not proven from the public surface.",
                source: "No unauthenticated /api/desk (401). No public metrics published."
            }
        ],
        liveSurfaces: [
            "Operator desk (DeskGrid)",
            "Map / pins",
            "Acquisition queues: current, qualified, research, CRM, unclaimed, conflict",
            "Inbox, calls, drips, contracts, tasks, pipeline",
            "Signals and AI approvals",
            "Import / Open Data Estate",
            "Dispositions and transactions"
        ],
        commercial: [
            "license",
            "white-label",
            "embed",
            "deploy"
        ]
    },
    {
        id: "findsellprofit",
        name: "FindSellProfit",
        mark: "FS",
        domain: "findsellprofit.com",
        tagline: "The loop, aimed at resale.",
        thesis: "FindSellProfit is a reseller swarm: source marketplaces and estate piles, signal mispricing, compile a flip recipe, act on a listing, keep a receipt of buy/sell/fees.",
        loopStory: "Same primitives as DeedSonar. Different matter: SKUs instead of parcels. The public site has shipped before and is currently dark.",
        primitives: [
            "source-factory",
            "signal-layer",
            "recipe-engine",
            "agent-runtime",
            "proofos"
        ],
        statusNotes: [
            {
                status: "BUILT",
                claim: "findsellprofit.com is a Vercel project. On 2026-08-24 it returned HTTP 402 DEPLOYMENT_DISABLED. Indexed pages describe an Autonomous Reseller Swarm and a documented flip dataset.",
                source: "HTTPS GET findsellprofit.com; crawler-indexed /terms and /data.",
                url: "https://findsellprofit.com",
                observedAt: "2026-08-24"
            }
        ],
        commercial: [
            "license",
            "embed",
            "deploy"
        ]
    },
    {
        id: "bookeit",
        name: "Bookeit",
        mark: "BK",
        domain: "bookeit.com",
        tagline: "The loop, aimed at time and gear.",
        thesis: "Bookeit is a booking organism for items, yards, events, and short-term services. Agents discover, schedule, and close peer-to-peer logistics. Founder copy positions it for acquisition, licensing, or white-label.",
        loopStory: "Inventory is the source. Availability is the signal. A vertical recipe (party gear, rec equipment, pop-up land) compiles into a bookable set. The receipt is the reservation.",
        primitives: [
            "source-factory",
            "signal-layer",
            "recipe-engine",
            "agent-runtime",
            "venture-factory"
        ],
        statusNotes: [
            {
                status: "BUILT",
                claim: "bookeit.com is a Vercel project. On 2026-08-24 it returned HTTP 402 DEPLOYMENT_DISABLED.",
                source: "HTTPS GET bookeit.com, x-vercel-error: DEPLOYMENT_DISABLED.",
                url: "https://bookeit.com",
                observedAt: "2026-08-24"
            },
            {
                status: "PROPOSED",
                claim: "Public founder copy uses conditional language (“could be”, “ready to build, hold or hand off”) and lists licensing / white-label as intended commercial paths.",
                source: "Jeramie Hicks LinkedIn experience: Founder — Bookeit.com.",
                url: "https://www.linkedin.com/in/jeramieshicks"
            }
        ],
        commercial: [
            "license",
            "white-label",
            "build"
        ]
    },
    {
        id: "curbclaim",
        name: "CurbClaim",
        mark: "CC",
        domain: "curbclaim.com",
        tagline: "The loop, aimed at the curb.",
        thesis: "CurbClaim is named as a vertical for claimable, street-visible, or abandoned-adjacent inventory — a sister motion to FindSellProfit and DeedSonar. The domain exists. The product does not.",
        loopStory: "If it ships, the recipe is local, time-bounded, and evidence-heavy: what was seen, when, and whether a claim is lawful. Until then it stays Proposed.",
        primitives: [
            "source-factory",
            "signal-layer",
            "governance",
            "proofos"
        ],
        statusNotes: [
            {
                status: "PROPOSED",
                claim: "curbclaim.com resolves to a GoDaddy for-sale lander. No product UI, no Vercel app, no public repository located.",
                source: "HTTPS GET curbclaim.com → /lander → forsale.godaddy.com, 2026-08-24.",
                url: "https://curbclaim.com",
                observedAt: "2026-08-24"
            }
        ],
        commercial: [
            "build"
        ]
    },
    {
        id: "proofos",
        name: "ProofOS",
        mark: "PF",
        tagline: "The notary of the organism.",
        thesis: "ProofOS is the proposed evidence and receipt substrate for every Neuruh action. It is not a claim that a public ProofOS product is running, and it is not the unrelated Aevion-ai/ProofOS project.",
        loopStory: "DeedSonar already talks like a notary: independent universes, fixtures excluded, coverage not proven empty, qualification ≠ contact. ProofOS is that ethic extracted into infrastructure.",
        primitives: [
            "governance",
            "proofos"
        ],
        statusNotes: [
            {
                status: "PROPOSED",
                claim: "No Neuruh-owned ProofOS deployment or repository was located.",
                source: "DNS and search, 2026-08-24. proofos.com is an unrelated brand-name listing."
            }
        ],
        commercial: [
            "license",
            "embed",
            "deploy"
        ]
    }
];
export function productById(id) {
    return PRODUCTS.find((product)=>product.id === id);
}
