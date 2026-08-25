// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { djb2 } from "@/lib/content/demo";

function sourceHash(kind, asOf, body) {
    return `sha-syn-${djb2(`${kind}|${asOf}|${body}`)}`;
}
const SOURCES = [
    {
        id: "src-assessor",
        kind: "assessor",
        name: "County assessor roll",
        asOf: "2025-01-12",
        receivedAt: "2026-03-02T14:11:00Z",
        epistemic: "VERIFIED",
        hash: sourceHash("assessor", "2025-01-12", "acres=12.4;sqft=1840"),
        body: "ACRES 12.40 / IMP SQFT 1840 / LAND USE AGR / SYNTHETIC ROLL LINE",
        accepted: true
    },
    {
        id: "src-recorder",
        kind: "recorder",
        name: "Register of deeds",
        asOf: "1998-03-04",
        receivedAt: "2026-03-02T14:11:08Z",
        epistemic: "VERIFIED",
        hash: sourceHash("recorder", "1998-03-04", "HARBOR FAMILY TRUST 1998"),
        body: "WD BK SYN/4417 HARBOR FAMILY TRUST 1998 / TENURE ROOT EVENT",
        accepted: true
    },
    {
        id: "src-tax",
        kind: "tax",
        name: "Tax collector",
        asOf: "2026-02-01",
        receivedAt: "2026-03-02T14:12:01Z",
        epistemic: "VERIFIED",
        hash: sourceHash("tax", "2026-02-01", "delinquent=2023,2024,2025"),
        body: "DELINQUENT YRS 2023 2024 2025 / AMOUNT WITHHELD IN DEMO",
        accepted: true
    },
    {
        id: "src-gis",
        kind: "gis",
        name: "County GIS polygon",
        asOf: "2024-11-02",
        receivedAt: "2026-03-02T14:12:40Z",
        epistemic: "VERIFIED",
        hash: sourceHash("gis", "2024-11-02", "poly=harbor-tract"),
        body: "PARCEL POLY SYN-NC-4417 / FOOTPRINT SQFT 2100",
        accepted: true
    },
    {
        id: "src-fema",
        kind: "fema",
        name: "FEMA NFHL",
        asOf: "2022-06-18",
        receivedAt: "2026-03-02T14:13:02Z",
        epistemic: "STALE",
        hash: sourceHash("fema", "2022-06-18", "zone=undetermined"),
        body: "FLOOD ZONE UNDETERMINED — LAYER OLDER THAN FRESHNESS BUDGET",
        accepted: true
    },
    {
        id: "src-listing",
        kind: "listing",
        name: "Listing feed",
        asOf: "2026-08-01",
        receivedAt: "2026-08-01T09:00:00Z",
        epistemic: "VERIFIED",
        hash: sourceHash("listing", "2026-08-01", "active=false"),
        body: "NO ACTIVE LISTING FLAG IN SYNTHETIC FEED",
        accepted: true
    },
    {
        id: "src-probate",
        kind: "probate",
        name: "Probate index",
        asOf: "—",
        receivedAt: "2026-03-02T14:13:55Z",
        epistemic: "SOURCE_UNAVAILABLE",
        hash: sourceHash("probate", "none", "timeout"),
        body: "SOURCE ASKED. NO RECORD RETURNED. NOT PROVEN EMPTY.",
        accepted: false
    }
];
export const HARBOR_TRACT = {
    id: "syn-nc-4417",
    synthetic: true,
    displayName: "Harbor Church tract",
    county: "Pender Tract (synthetic)",
    identifiers: [
        {
            kind: "street",
            label: "Street address",
            value: "4417 Harbor Church Rd",
            sourceId: "src-assessor"
        },
        {
            kind: "normalized",
            label: "Normalized address",
            value: "4417 HARBOR CHURCH ROAD",
            sourceId: "src-assessor"
        },
        {
            kind: "apn",
            label: "APN",
            value: "SYN-NC-4417",
            sourceId: "src-assessor"
        },
        {
            kind: "local",
            label: "Local parcel id",
            value: "4417-00-15",
            sourceId: "src-gis"
        },
        {
            kind: "statePin",
            label: "State parcel id",
            value: "SYN-0374-88-1022",
            sourceId: "src-gis"
        },
        {
            kind: "fips",
            label: "County FIPS",
            value: "SYN-37-00",
            sourceId: "src-gis"
        }
    ],
    sources: SOURCES,
    facts: [
        {
            id: "acres",
            label: "Acres",
            value: "12.40",
            numeric: 12.4,
            epistemic: "VERIFIED",
            sourceIds: [
                "src-assessor",
                "src-gis"
            ],
            asOf: "2025-01-12",
            note: "Assessor and GIS agree on lot area."
        },
        {
            id: "vesting",
            label: "Vesting",
            value: "HARBOR FAMILY TRUST 1998",
            epistemic: "VERIFIED",
            sourceIds: [
                "src-recorder"
            ],
            asOf: "1998-03-04",
            note: "Root recorded instrument. Not a living-party identity."
        },
        {
            id: "tenure",
            label: "Tenure",
            value: "28 years",
            numeric: 28,
            epistemic: "VERIFIED",
            sourceIds: [
                "src-recorder"
            ],
            asOf: "1998-03-04",
            note: "Computed from deed date to demo as-of 2026-08-24."
        },
        {
            id: "tax",
            label: "Tax delinquency",
            value: "2023–2025",
            numeric: 3,
            epistemic: "VERIFIED",
            sourceIds: [
                "src-tax"
            ],
            asOf: "2026-02-01",
            note: "Dollar amount withheld in this synthetic fixture."
        },
        {
            id: "equity",
            label: "Equity ratio",
            value: "0.81",
            numeric: 0.81,
            epistemic: "ESTIMATED",
            sourceIds: [
                "src-assessor"
            ],
            asOf: "2025-01-12",
            note: "Modelled. Not an appraisal. Confidence medium."
        },
        {
            id: "listed",
            label: "Active listing",
            value: "false",
            epistemic: "VERIFIED",
            sourceIds: [
                "src-listing"
            ],
            asOf: "2026-08-01",
            note: "Absence of a listing flag in the feed — not a guarantee of off-market."
        },
        {
            id: "livingParty",
            label: "Living party",
            value: "unknown",
            epistemic: "UNKNOWN",
            sourceIds: [
                "src-probate"
            ],
            asOf: "—",
            note: "Probate index unavailable. Identity evaluation incomplete."
        },
        {
            id: "improvement",
            label: "Improvement",
            value: "farmhouse, sqft conflict",
            epistemic: "CONTRADICTORY",
            sourceIds: [
                "src-assessor",
                "src-gis"
            ],
            asOf: "2025-01-12",
            note: "Assessor 1,840 sqft vs GIS footprint 2,100 sqft. Both kept."
        }
    ],
    signals: [
        {
            id: "acres",
            label: "acres ≥ 5",
            structure: "foundation mass",
            derivedFrom: "acres",
            epistemic: "VERIFIED",
            passesDefaultRecipe: true,
            independence: "Assessor roll + GIS area",
            eventDate: "2025-01-12"
        },
        {
            id: "vesting",
            label: "vesting ∈ {trust, estate}",
            structure: "double wall",
            derivedFrom: "vesting",
            epistemic: "VERIFIED",
            passesDefaultRecipe: true,
            independence: "Recorded warranty deed 1998-03-04",
            eventDate: "1998-03-04"
        },
        {
            id: "tenure",
            label: "tenure ≥ 15 years",
            structure: "roof height",
            derivedFrom: "tenure",
            epistemic: "VERIFIED",
            passesDefaultRecipe: true,
            independence: "Root deed date, not a modeled age",
            eventDate: "1998-03-04"
        },
        {
            id: "delinquent",
            label: "tax delinquent 2–5 years",
            structure: "oxidation stain",
            derivedFrom: "tax",
            epistemic: "VERIFIED",
            passesDefaultRecipe: true,
            independence: "Tax collector as-of 2026-02-01",
            eventDate: "2026-02-01"
        },
        {
            id: "equity",
            label: "equity ≥ 0.65",
            structure: "window lights",
            derivedFrom: "equity",
            epistemic: "ESTIMATED",
            passesDefaultRecipe: true,
            independence: "Single AVM-style estimate — not independent of assessor",
            eventDate: "2025-01-12"
        },
        {
            id: "unlisted",
            label: "not actively listed",
            structure: "dark listing lamp",
            derivedFrom: "listed",
            epistemic: "VERIFIED",
            passesDefaultRecipe: true,
            independence: "Listing feed 2026-08-01",
            eventDate: "2026-08-01"
        },
        {
            id: "livingParty",
            label: "living party known",
            structure: "open doorway",
            derivedFrom: "livingParty",
            epistemic: "UNKNOWN",
            passesDefaultRecipe: false,
            independence: "No accepted source",
            eventDate: "—"
        }
    ],
    authority: {
        qualified: true,
        contactAuthorized: false,
        allowedActions: [
            "research enqueue",
            "map pin",
            "write receipt"
        ],
        haltedActions: [
            "call",
            "drip",
            "contract out"
        ],
        rule: "Qualification does not authorize contact.",
        liveEcho: "DeedSonar live desk copy: “Qualification does not authorize contact.” Callability is not assumed. Identity conflicts block outreach."
    },
    timeline: [
        {
            id: "T0",
            label: "Before threshold",
            asOf: "2025-01-15",
            delinquentYears: 1.9,
            recipeMatch: false,
            why: "Tax delinquency 1.9 years — below the 2-year clause. House stands incomplete at the stain layer."
        },
        {
            id: "T1",
            label: "Crossing",
            asOf: "2025-03-01",
            delinquentYears: 2.0,
            recipeMatch: true,
            why: "Anniversary event: delinquency crosses 2.00 years. The clause flips. Nothing else changed."
        },
        {
            id: "T2",
            label: "Now",
            asOf: "2026-08-24",
            delinquentYears: 3.0,
            recipeMatch: true,
            why: "Still inside the 2–5 year window. Match holds. Living party remains unknown."
        }
    ],
    queryHash: sourceHash("recipe", "2026-08-24", "estate.off_market.high_equity"),
    estateSnapshot: "SYN-ESTATE-PENDER-TRACT-2026-08",
    recipeVersion: "estate.off_market.high_equity@0.4-demo"
};
export function factById(id) {
    const fact = HARBOR_TRACT.facts.find((item)=>item.id === id);
    if (!fact) {
        throw new Error(`Missing fact ${id}`);
    }
    return fact;
}
export function sourceById(id) {
    const source = HARBOR_TRACT.sources.find((item)=>item.id === id);
    if (!source) {
        throw new Error(`Missing source ${id}`);
    }
    return source;
}
