// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { assertNever } from "@/lib/status";
import { hasReached } from "@/lib/twin/stages";

export const RECEIPT_STACK = [
    {
        id: "world",
        label: "WORLD",
        inspect: "world"
    },
    {
        id: "sources",
        label: "RAW SOURCES",
        inspect: "src-recorder"
    },
    {
        id: "evidence",
        label: "EVIDENCE",
        inspect: "src-tax"
    },
    {
        id: "facts",
        label: "FACTS",
        inspect: "acres"
    },
    {
        id: "signals",
        label: "SIGNALS",
        inspect: "delinquent"
    },
    {
        id: "recipe",
        label: "RECIPE",
        inspect: "estate.off_market.high_equity"
    },
    {
        id: "decision",
        label: "DECISION",
        inspect: "research"
    },
    {
        id: "authority",
        label: "AUTHORITY",
        inspect: "gate"
    },
    {
        id: "action",
        label: "ACTION",
        inspect: "research enqueue"
    },
    {
        id: "outcome",
        label: "OUTCOME",
        inspect: "historical CRM"
    }
];
export function explodedLayerPose(index, exploded) {
    if (!exploded) {
        return [
            0,
            0,
            0
        ];
    }
    if (index === 0) {
        return [
            0,
            0,
            0
        ];
    }
    const along = index - 4;
    return [
        along * 1.55,
        0.55 + index * 0.95,
        along * -1.15
    ];
}
export function explodedLayerY(index, exploded) {
    return explodedLayerPose(index, exploded)[1];
}
export function storyActions(scene) {
    return {
        inspect: hasReached(scene, "observe"),
        why: hasReached(scene, "signal"),
        explode: hasReached(scene, "recipe")
    };
}
export function layerSpeed(kind) {
    switch(kind){
        case "mass":
            return 1.62;
        case "data":
            return 6.8;
        case "lock":
            return 10.5;
        default:
            return assertNever(kind);
    }
}
