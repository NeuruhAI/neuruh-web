// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */

export const LOOP_STAGES = [
    {
        id: "source",
        label: "Source",
        verb: "Ingest",
        summary: "County rolls, recorded instruments, marketplace listings, booking inventories, and operator files enter as named sources — not anonymous scrapes."
    },
    {
        id: "signal",
        label: "Signal",
        verb: "Detect",
        summary: "A signal is a typed observation: tax delinquency, trust vesting, tenure, equity, a listing gap, a TCPA window. It is counted, not assumed."
    },
    {
        id: "recipe",
        label: "Recipe",
        verb: "Compile",
        summary: "A recipe is a reusable constraint set. It compiles a question into a candidate universe. Qualification is not permission to contact."
    },
    {
        id: "decision",
        label: "Decision",
        verb: "Judge",
        summary: "Agents and operators score, rank, and halt. Identity conflicts, DNC, and missing living-party evidence block action by construction."
    },
    {
        id: "action",
        label: "Action",
        verb: "Execute",
        summary: "Calls, drips, contracts, bookings, claims, and dispatches leave the desk only when the recipe and the governance gate both pass."
    },
    {
        id: "receipt",
        label: "Receipt",
        verb: "Record",
        summary: "Every material step should emit a lineage: what was asked, what matched, what was withheld, and why. Empty is not proven empty."
    },
    {
        id: "outcome",
        label: "Outcome",
        verb: "Close",
        summary: "Title, sale, booking, or a documented no-contact. Outcomes live in a separate universe from the candidate estate so history cannot contaminate the current batch."
    },
    {
        id: "learning",
        label: "Learning",
        verb: "Return",
        summary: "Closed outcomes feed Source Factory and Recipe Engine as labeled fixtures — never as silent weight updates with no receipt."
    }
];
export const LOOP_THESIS = "Intelligence that cannot act is a briefing. Intelligence that acts without a receipt is a liability. Neuruh is the loop between those two failures.";
