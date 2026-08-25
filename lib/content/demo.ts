// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */

export const SYNTHETIC_DISCLAIMER = "SYNTHETIC. These parcels, owners, and APNs are fixtures for the atlas. They are not a live DeedSonar estate, not county records, and not an authorization to contact anyone.";
export const RECIPE_PROMPT = "5+ acres, estate/trust ownership, 15+ year tenure, tax delinquency, high equity, no active listing";
export const CONSTRAINTS = [
    {
        id: "acres",
        label: "acres ≥ 5",
        detail: "Lot size compiled from the synthetic cadastral layer.",
        stage: "source",
        defaultOn: true,
        test: (parcel)=>parcel.acres >= 5
    },
    {
        id: "vesting",
        label: "vesting ∈ {estate, trust}",
        detail: "Entity form, not a living-party identity. Qualification is not contact.",
        stage: "signal",
        defaultOn: true,
        test: (parcel)=>parcel.vesting === "estate" || parcel.vesting === "trust"
    },
    {
        id: "tenure",
        label: "tenure ≥ 15 years",
        detail: "Years the current vesting has held the tract in the fixture.",
        stage: "signal",
        defaultOn: true,
        test: (parcel)=>parcel.tenureYears >= 15
    },
    {
        id: "delinquent",
        label: "tax_delinquent = true",
        detail: "A typed delinquency signal. Amounts are withheld in this demo.",
        stage: "signal",
        defaultOn: true,
        test: (parcel)=>parcel.taxDelinquent
    },
    {
        id: "equity",
        label: "equity_ratio ≥ 0.65",
        detail: "Synthetic equity ratio. Not an appraisal.",
        stage: "recipe",
        defaultOn: true,
        test: (parcel)=>parcel.equityRatio >= 0.65
    },
    {
        id: "unlisted",
        label: "active_listing = false",
        detail: "No fixture flag for an active public listing.",
        stage: "recipe",
        defaultOn: true,
        test: (parcel)=>!parcel.listed
    }
];
export const PENDER_TRACT = [
    {
        id: "p01",
        apn: "SYN-NC-4417",
        acres: 12.4,
        vesting: "trust",
        owner: "HARBOR FAMILY TRUST 1998",
        tenureYears: 27,
        taxDelinquent: true,
        delinquentYears: [
            2023,
            2024,
            2025
        ],
        equityRatio: 0.81,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.42,
        lng: -77.64,
        path: "M 120 90 L 210 70 L 250 150 L 160 190 Z",
        notes: [
            "Creek easement along east line.",
            "No living-party evaluation in this fixture."
        ]
    },
    {
        id: "p02",
        apn: "SYN-NC-4488",
        acres: 6.1,
        vesting: "estate",
        owner: "ESTATE OF M. CALDWELL",
        tenureYears: 19,
        taxDelinquent: true,
        delinquentYears: [
            2024
        ],
        equityRatio: 0.72,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.4,
        lng: -77.61,
        path: "M 250 150 L 340 130 L 360 210 L 250 230 Z",
        notes: [
            "Identity conflict possible — estate caption only."
        ]
    },
    {
        id: "p03",
        apn: "SYN-NC-4502",
        acres: 18.8,
        vesting: "trust",
        owner: "PINE BARRENS IRREVOCABLE TRUST",
        tenureYears: 22,
        taxDelinquent: true,
        delinquentYears: [
            2022,
            2023,
            2024,
            2025
        ],
        equityRatio: 0.69,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.38,
        lng: -77.67,
        path: "M 70 200 L 160 190 L 180 310 L 60 320 Z",
        notes: [
            "Timber. Interior road not county-maintained."
        ]
    },
    {
        id: "p04",
        apn: "SYN-NC-4519",
        acres: 5.4,
        vesting: "trust",
        owner: "THE ROWAN REVOCABLE TRUST",
        tenureYears: 16,
        taxDelinquent: true,
        delinquentYears: [
            2025
        ],
        equityRatio: 0.77,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.41,
        lng: -77.58,
        path: "M 360 210 L 450 200 L 470 280 L 360 290 Z",
        notes: [
            "Fronts synthetic SR-1102."
        ]
    },
    {
        id: "p05",
        apn: "SYN-NC-4301",
        acres: 3.2,
        vesting: "trust",
        owner: "HARBOR FAMILY TRUST 1998",
        tenureYears: 27,
        taxDelinquent: true,
        delinquentYears: [
            2023,
            2024,
            2025
        ],
        equityRatio: 0.8,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.43,
        lng: -77.62,
        path: "M 210 70 L 280 50 L 300 110 L 250 150 Z",
        notes: [
            "Fails acres ≥ 5."
        ]
    },
    {
        id: "p06",
        apn: "SYN-NC-4608",
        acres: 9.7,
        vesting: "individual",
        owner: "L. HAYES",
        tenureYears: 31,
        taxDelinquent: true,
        delinquentYears: [
            2024,
            2025
        ],
        equityRatio: 0.74,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.37,
        lng: -77.6,
        path: "M 180 310 L 280 300 L 290 380 L 170 390 Z",
        notes: [
            "Fails vesting filter. Individual is not estate/trust."
        ]
    },
    {
        id: "p07",
        apn: "SYN-NC-4712",
        acres: 14.0,
        vesting: "llc",
        owner: "SALT MARSH HOLDINGS LLC",
        tenureYears: 8,
        taxDelinquent: false,
        delinquentYears: [],
        equityRatio: 0.41,
        listed: true,
        county: "Pender Tract (synthetic)",
        lat: 34.36,
        lng: -77.65,
        path: "M 300 300 L 400 290 L 420 370 L 310 380 Z",
        notes: [
            "Active listing flag. Tenure and equity also fail."
        ]
    },
    {
        id: "p08",
        apn: "SYN-NC-4815",
        acres: 7.6,
        vesting: "estate",
        owner: "ESTATE OF R. VICK",
        tenureYears: 12,
        taxDelinquent: true,
        delinquentYears: [
            2025
        ],
        equityRatio: 0.66,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.39,
        lng: -77.55,
        path: "M 470 280 L 560 270 L 570 350 L 470 360 Z",
        notes: [
            "Fails tenure ≥ 15."
        ]
    },
    {
        id: "p09",
        apn: "SYN-NC-4904",
        acres: 22.1,
        vesting: "trust",
        owner: "BLACKWATER LAND TRUST 2001",
        tenureYears: 24,
        taxDelinquent: false,
        delinquentYears: [],
        equityRatio: 0.88,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.44,
        lng: -77.7,
        path: "M 40 80 L 120 90 L 70 200 L 20 180 Z",
        notes: [
            "Clean taxes. Fails delinquency signal."
        ]
    },
    {
        id: "p10",
        apn: "SYN-NC-5011",
        acres: 11.3,
        vesting: "trust",
        owner: "CYPRESS BEND TRUST",
        tenureYears: 18,
        taxDelinquent: true,
        delinquentYears: [
            2023,
            2025
        ],
        equityRatio: 0.52,
        listed: false,
        county: "Pender Tract (synthetic)",
        lat: 34.35,
        lng: -77.58,
        path: "M 360 290 L 450 280 L 460 360 L 370 370 Z",
        notes: [
            "Fails equity_ratio ≥ 0.65."
        ]
    }
];
export function matchParcels(parcels, enabled) {
    const matched = [];
    const withheld = [];
    for (const parcel of parcels){
        const passes = CONSTRAINTS.filter((constraint)=>enabled.has(constraint.id)).every((constraint)=>constraint.test(parcel));
        if (passes) {
            matched.push(parcel);
        } else {
            withheld.push(parcel);
        }
    }
    return {
        matched,
        withheld
    };
}
export function failReasons(parcel, enabled) {
    return CONSTRAINTS.filter((constraint)=>enabled.has(constraint.id) && !constraint.test(parcel)).map((constraint)=>constraint.label);
}
export function recipeSource(enabled) {
    const body = CONSTRAINTS.filter((constraint)=>enabled.has(constraint.id)).map((constraint)=>`  ${constraint.label}`).join("\n");
    return `RECIPE estate.off_market.high_equity\n  geography = PENDER_TRACT_SYNTHETIC\n${body}`;
}
export function djb2(input) {
    let hash = 5381;
    for(let i = 0; i < input.length; i += 1){
        hash = hash * 33 ^ input.charCodeAt(i);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
}
