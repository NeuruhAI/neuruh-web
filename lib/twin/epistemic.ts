// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { assertNever } from "@/lib/status";

export const EPISTEMIC = [
    "VERIFIED",
    "ESTIMATED",
    "UNKNOWN",
    "STALE",
    "SOURCE_UNAVAILABLE",
    "CONTRADICTORY"
];
export function epistemicLabel(value) {
    switch(value){
        case "VERIFIED":
            return "Verified";
        case "ESTIMATED":
            return "Estimated";
        case "UNKNOWN":
            return "Unknown";
        case "STALE":
            return "Stale";
        case "SOURCE_UNAVAILABLE":
            return "Source unavailable";
        case "CONTRADICTORY":
            return "Contradictory";
        default:
            return assertNever(value);
    }
}
export function epistemicMeans(value) {
    switch(value){
        case "VERIFIED":
            return "A named source was accepted into custody and agrees with itself.";
        case "ESTIMATED":
            return "Derived, modeled, or inferred. Not a recorded instrument.";
        case "UNKNOWN":
            return "The field is in the schema. No accepted value is held.";
        case "STALE":
            return "A value exists, but its as-of date is older than the freshness budget.";
        case "SOURCE_UNAVAILABLE":
            return "The source was asked. Nothing came back. That is not proof of absence.";
        case "CONTRADICTORY":
            return "Two accepted sources disagree. The twin keeps both until resolved.";
        default:
            return assertNever(value);
    }
}
