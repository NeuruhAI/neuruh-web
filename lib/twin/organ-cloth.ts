// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { assertNever } from "@/lib/status";

export const ORGAN_CLOTHS = [
    "deedsonar",
    "findsellprofit",
    "bookeit",
    "proofos"
];
export function clothLabel(cloth) {
    switch(cloth){
        case "deedsonar":
            return "DeedSonar";
        case "findsellprofit":
            return "FindSellProfit";
        case "bookeit":
            return "Bookeit";
        case "proofos":
            return "ProofOS";
        default:
            return assertNever(cloth);
    }
}
export function clothStatus(cloth) {
    switch(cloth){
        case "deedsonar":
            return "LIVE";
        case "findsellprofit":
            return "BUILT";
        case "bookeit":
            return "BUILT";
        case "proofos":
            return "PROPOSED";
        default:
            return assertNever(cloth);
    }
}
export function clothNote(cloth) {
    switch(cloth){
        case "deedsonar":
            return "Live organ. Login-gated desk. This parcel is still synthetic.";
        case "findsellprofit":
            return "Built, deploy currently disabled. Clothing is an illustration, not a shared event bus.";
        case "bookeit":
            return "Built, deploy currently disabled. Clothing is an illustration, not a shared event bus.";
        case "proofos":
            return "Proposed as a named product. Not a live public runtime.";
        default:
            return assertNever(cloth);
    }
}
