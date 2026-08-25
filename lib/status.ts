// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */

export const EVIDENCE_STATUSES = [
    "BUILT",
    "PROVEN",
    "LIVE",
    "PROPOSED"
];
export function assertNever(value) {
    throw new Error(`Unhandled union member: ${JSON.stringify(value)}`);
}
export function statusLabel(status) {
    switch(status){
        case "BUILT":
            return "Built";
        case "PROVEN":
            return "Proven";
        case "LIVE":
            return "Live";
        case "PROPOSED":
            return "Proposed";
        default:
            return assertNever(status);
    }
}
export function statusDefinition(status) {
    switch(status){
        case "BUILT":
            return "Code, a deploy artifact, or a documented local system exists. It is not necessarily reachable as a public product.";
        case "PROVEN":
            return "Independent, inspectable evidence supports the claim. Existence of a login page is not proof of outcomes.";
        case "LIVE":
            return "A public URL currently serves the named capability. Login-gated still counts as live if the product is running.";
        case "PROPOSED":
            return "Named architecture or commercial intent. Not represented as running.";
        default:
            return assertNever(status);
    }
}
export function highestStatus(notes) {
    const rank = {
        PROPOSED: 0,
        BUILT: 1,
        PROVEN: 2,
        LIVE: 3
    };
    return notes.reduce((acc, note)=>{
        return rank[note.status] > rank[acc] ? note.status : acc;
    }, "PROPOSED");
}
export function isPubliclyLive(notes) {
    return notes.some((note)=>note.status === "LIVE");
}
