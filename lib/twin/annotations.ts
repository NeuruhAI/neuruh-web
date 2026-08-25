// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { assertNever } from "@/lib/status";
import { HOUSE } from "@/lib/twin/stage-geometry";
import { hasReached } from "@/lib/twin/stages";

export const ANNOTATIONS = [
    {
        id: "parcel",
        level: 1,
        sceneFrom: "world",
        layerIndex: 0,
        whisper: "Pender County",
        detail: "Synthetic cadastral field · not a live estate",
        anchor: [
            -5.35,
            0.08,
            4.15
        ],
        labelOffset: [
            -1.2,
            0.55,
            0.45
        ],
        inspect: {
            kind: "receipt",
            id: "WORLD"
        }
    },
    {
        id: "custody",
        level: 1,
        sceneFrom: "custody",
        layerIndex: 1,
        whisper: "Hashed",
        detail: "Accepted plates stamped. Held plates remain visible.",
        anchor: [
            -2.2,
            0.08,
            1.6
        ],
        labelOffset: [
            -0.7,
            0.4,
            0.12
        ],
        inspect: {
            kind: "source",
            id: "src-recorder"
        }
    },
    {
        id: "monument",
        level: 1,
        sceneFrom: "identity",
        layerIndex: 2,
        whisper: "One tract",
        detail: "Street, APN, PIN, and FIPS converge on one monument.",
        anchor: [
            HOUSE.x,
            0.42,
            HOUSE.z
        ],
        labelOffset: [
            0.55,
            0.32,
            0.12
        ],
        inspect: {
            kind: "identifier",
            id: "apn"
        }
    },
    {
        id: "acres",
        level: 1,
        sceneFrom: "fact",
        layerIndex: 3,
        whisper: "12.4 AC",
        detail: "12.40 acres · assessor roll + GIS polygon · VERIFIED",
        anchor: [
            0,
            0.06,
            3.4
        ],
        labelOffset: [
            1.2,
            0.42,
            0.12
        ],
        inspect: {
            kind: "fact",
            id: "acres"
        }
    },
    {
        id: "trust",
        level: 1,
        sceneFrom: "fact",
        layerIndex: 4,
        whisper: "Trust",
        detail: "Harbor Family Trust 1998 · recorded warranty deed",
        anchor: [
            HOUSE.x,
            0.58,
            HOUSE.z
        ],
        labelOffset: [
            0.48,
            0.28,
            0.1
        ],
        inspect: {
            kind: "fact",
            id: "vesting"
        }
    },
    {
        id: "tenure",
        level: 1,
        sceneFrom: "fact",
        layerIndex: 3,
        whisper: "Held 28 yrs",
        detail: "Root deed 1998-03-04 · tenure computed to 2026-08-24",
        anchor: [
            -4.15,
            0.06,
            0.05
        ],
        labelOffset: [
            -0.9,
            0.4,
            0.1
        ],
        inspect: {
            kind: "fact",
            id: "tenure"
        }
    },
    {
        id: "recipe",
        level: 1,
        sceneFrom: "recipe",
        layerIndex: 5,
        whisper: "Compiled",
        detail: "QuerySpec is a deterministic constraint set, not a prompt.",
        anchor: [
            HOUSE.x,
            0.72,
            HOUSE.z
        ],
        labelOffset: [
            0.55,
            0.22,
            0.08
        ],
        inspect: {
            kind: "clause",
            id: "estate.off_market.high_equity"
        }
    },
    {
        id: "research",
        level: 1,
        sceneFrom: "decision",
        layerIndex: 6,
        whisper: "Research",
        detail: "Plausible future. Licensed only if authority agrees.",
        anchor: [
            HOUSE.x + 0.72,
            0.4,
            HOUSE.z
        ],
        labelOffset: [
            0.12,
            0.32,
            0.08
        ],
        inspect: {
            kind: "receipt",
            id: "RESEARCH"
        }
    },
    {
        id: "halt",
        level: 2,
        sceneFrom: "decision",
        layerIndex: 6,
        whisper: "Halted",
        detail: "Drip / call is imaginable. It is not licensed.",
        anchor: [
            HOUSE.x - 0.72,
            0.4,
            HOUSE.z
        ],
        labelOffset: [
            -0.12,
            0.32,
            0.08
        ],
        inspect: {
            kind: "receipt",
            id: "DRIP / CALL"
        }
    },
    {
        id: "halt-rule",
        level: 1,
        sceneFrom: "authority",
        layerIndex: 7,
        whisper: "No contact",
        detail: "Qualification is not permission to knock. Live DeedSonar rule.",
        anchor: [
            HOUSE.x,
            0.22,
            HOUSE.z + 0.22
        ],
        labelOffset: [
            0.45,
            0.28,
            0.12
        ],
        inspect: {
            kind: "receipt",
            id: "gate"
        }
    },
    {
        id: "enqueue",
        level: 1,
        sceneFrom: "action",
        layerIndex: 8,
        whisper: "Enqueued",
        detail: "Research · current estate · SYN-NC-4417. Call and drip remain halted.",
        anchor: [
            HOUSE.x + 0.2,
            0.16,
            HOUSE.z + 0.12
        ],
        labelOffset: [
            0.35,
            0.28,
            0.1
        ],
        inspect: {
            kind: "receipt",
            id: "research enqueue"
        }
    },
    {
        id: "filed",
        level: 1,
        sceneFrom: "outcome",
        layerIndex: 9,
        whisper: "Filed",
        detail: "Historical CRM is a separate universe from the current estate.",
        anchor: [
            1.4,
            0.08,
            5.7
        ],
        labelOffset: [
            0.55,
            0.28,
            0.08
        ],
        inspect: {
            kind: "receipt",
            id: "historical CRM"
        }
    },
    {
        id: "stain",
        level: 2,
        sceneFrom: "signal",
        layerIndex: 4,
        whisper: "Delinquent",
        detail: "Tax years 2023–2025 become the oxidation stain. Dollar amount withheld.",
        anchor: [
            HOUSE.x - 0.14,
            0.18,
            HOUSE.z + 0.2
        ],
        labelOffset: [
            -0.45,
            0.28,
            0.08
        ],
        inspect: {
            kind: "signal",
            id: "delinquent"
        }
    }
];
const BY_ID = new Map(ANNOTATIONS.map((item)=>[
        item.id,
        item
    ]));
export function annotationById(id) {
    const found = BY_ID.get(id);
    if (!found) {
        throw new Error(`Unknown annotation: ${id}`);
    }
    return found;
}
function capThree(ids) {
    return ids.slice(0, 3);
}
function idsForInspect(inspect) {
    switch(inspect.kind){
        case "fact":
            if (inspect.id === "acres") {
                return [
                    "acres"
                ];
            }
            if (inspect.id === "vesting") {
                return [
                    "trust"
                ];
            }
            if (inspect.id === "tenure") {
                return [
                    "tenure"
                ];
            }
            return [];
        case "signal":
            if (inspect.id === "delinquent") {
                return [
                    "stain"
                ];
            }
            return [];
        case "source":
            return [
                "custody"
            ];
        case "identifier":
            return inspect.id === "apn" ? [
                "monument"
            ] : [];
        case "clause":
            return [
                "recipe"
            ];
        case "receipt":
            if (inspect.id === "RESEARCH" || inspect.id === "research enqueue") {
                return [
                    "enqueue"
                ];
            }
            if (inspect.id === "DRIP / CALL" || inspect.id === "gate") {
                return [
                    "halt-rule"
                ];
            }
            if (inspect.id === "historical CRM") {
                return [
                    "filed"
                ];
            }
            if (inspect.id === "WORLD") {
                return [
                    "parcel"
                ];
            }
            return [];
        default:
            return assertNever(inspect.kind);
    }
}
function sceneBaseIds(scene, mode) {
    switch(scene){
        case "world":
            return [
                "parcel"
            ];
        case "observe":
            return [];
        case "custody":
            return [
                "custody"
            ];
        case "identity":
            return [
                "monument"
            ];
        case "fact":
            return [
                "acres",
                "tenure"
            ];
        case "signal":
            return [
                "trust"
            ];
        case "recipe":
            return [
                "recipe"
            ];
        case "decision":
            return mode === "reality" ? [
                "research",
                "halt"
            ] : [
                "research"
            ];
        case "authority":
            return [
                "halt-rule"
            ];
        case "action":
            return [
                "enqueue"
            ];
        case "receipt":
            return [];
        case "outcome":
            return [
                "filed"
            ];
        case "calibration":
            return [
                "parcel"
            ];
        default:
            return assertNever(scene);
    }
}
export function authoredVisibleIds(scene, exploded, inspect, mode) {
    if (exploded) {
        return inspect ? capThree(idsForInspect(inspect)) : [];
    }
    const reached = sceneBaseIds(scene, mode).filter((id)=>hasReached(scene, annotationById(id).sceneFrom));
    if (!inspect) {
        return capThree(reached);
    }
    const extra = idsForInspect(inspect).filter((id)=>{
        const spec = BY_ID.get(id);
        return spec ? hasReached(scene, spec.sceneFrom) : false;
    });
    return capThree([
        ...extra,
        ...reached.filter((id)=>!extra.includes(id))
    ]);
}
export function mobileAnnotationLine(scene, exploded, mode) {
    return authoredVisibleIds(scene, exploded, null, mode).map((id)=>annotationById(id).whisper).join(" · ");
}
export function visibleLevels(ids) {
    return ids.map((id)=>annotationById(id).level);
}
