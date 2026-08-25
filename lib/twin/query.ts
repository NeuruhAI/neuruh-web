// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { djb2 } from "@/lib/content/demo";
import { HARBOR_TRACT } from "@/lib/twin/property";

export const SEARCH_PROMPT = "5+ acres, trust or estate owned, 15+ years tenure, 2-5 years tax delinquent, >=65% estimated equity, not actively listed";
export const QUERY_SPEC = {
    recipe: "estate.off_market.high_equity",
    geography: "PENDER_TRACT_SYNTHETIC",
    prompt: SEARCH_PROMPT,
    synthetic: true,
    clauses: [
        {
            id: "acres",
            field: "acres",
            op: "gte",
            value: 5,
            label: "acres ≥ 5",
            defaultOn: true
        },
        {
            id: "vesting",
            field: "vesting",
            op: "in",
            value: [
                "trust",
                "estate"
            ],
            label: "vesting ∈ {trust, estate}",
            defaultOn: true
        },
        {
            id: "tenure",
            field: "tenure_years",
            op: "gte",
            value: 15,
            label: "tenure ≥ 15 years",
            defaultOn: true
        },
        {
            id: "delinquent",
            field: "tax_delinquent_years",
            op: "between",
            value: [
                2,
                5
            ],
            label: "tax delinquent 2–5 years",
            defaultOn: true
        },
        {
            id: "equity",
            field: "equity_ratio",
            op: "gte",
            value: 0.65,
            label: "equity ≥ 0.65 (estimated)",
            defaultOn: true
        },
        {
            id: "unlisted",
            field: "active_listing",
            op: "eq",
            value: false,
            label: "not actively listed",
            defaultOn: true
        }
    ]
};
export const UNIVERSE_STEPS = [
    {
        afterClause: "base",
        remaining: 14882
    },
    {
        afterClause: "acres",
        remaining: 4921
    },
    {
        afterClause: "vesting",
        remaining: 1706
    },
    {
        afterClause: "tenure",
        remaining: 613
    },
    {
        afterClause: "delinquent",
        remaining: 182
    },
    {
        afterClause: "equity",
        remaining: 46
    },
    {
        afterClause: "unlisted",
        remaining: 31
    }
];
export function compilePrompt(prompt) {
    const normalized = prompt.toLowerCase();
    const acres = /5\+\s*acres|acres\s*≥\s*5|acres >= 5/.test(normalized);
    const vesting = /trust|estate/.test(normalized);
    const tenure = /15\+?\s*years|tenure/.test(normalized);
    const delinquent = /delinquen/.test(normalized);
    const equity = /65%|0\.65|equity/.test(normalized);
    const unlisted = /not actively listed|no active listing|unlisted/.test(normalized);
    return {
        ...QUERY_SPEC,
        prompt,
        clauses: QUERY_SPEC.clauses.map((clause)=>{
            const on = clause.id === "acres" && acres || clause.id === "vesting" && vesting || clause.id === "tenure" && tenure || clause.id === "delinquent" && delinquent || clause.id === "equity" && equity || clause.id === "unlisted" && unlisted;
            return {
                ...clause,
                defaultOn: on
            };
        })
    };
}
export function specHash(enabled) {
    const body = QUERY_SPEC.clauses.filter((clause)=>enabled.has(clause.id)).map((clause)=>`${clause.field}:${clause.op}:${JSON.stringify(clause.value)}`).join("|");
    return `sha-syn-${djb2(body || "empty")}`;
}
export function universeRemaining(enabled) {
    let remaining = UNIVERSE_STEPS[0].remaining;
    for (const step of UNIVERSE_STEPS){
        if (step.afterClause === "base") {
            continue;
        }
        if (!enabled.has(step.afterClause)) {
            break;
        }
        remaining = step.remaining;
    }
    return remaining;
}
export function funnelIsOrderedPrefix(enabled) {
    let seenDisabled = false;
    for (const step of UNIVERSE_STEPS){
        if (step.afterClause === "base") {
            continue;
        }
        const on = enabled.has(step.afterClause);
        if (!on) {
            seenDisabled = true;
        } else if (seenDisabled) {
            return false;
        }
    }
    return true;
}
export function harborMatchesRecipe(enabled, delinquentYears) {
    for (const clause of QUERY_SPEC.clauses){
        if (!enabled.has(clause.id)) {
            continue;
        }
        switch(clause.id){
            case "acres":
                if ((HARBOR_TRACT.facts.find((fact)=>fact.id === "acres")?.numeric ?? 0) < 5) {
                    return false;
                }
                break;
            case "vesting":
                break;
            case "tenure":
                if ((HARBOR_TRACT.facts.find((fact)=>fact.id === "tenure")?.numeric ?? 0) < 15) {
                    return false;
                }
                break;
            case "delinquent":
                if (delinquentYears < 2 || delinquentYears > 5) {
                    return false;
                }
                break;
            case "equity":
                if ((HARBOR_TRACT.facts.find((fact)=>fact.id === "equity")?.numeric ?? 0) < 0.65) {
                    return false;
                }
                break;
            case "unlisted":
                break;
            default:
                break;
        }
    }
    return true;
}
export function formatQuerySpec(spec, enabled) {
    const clauses = spec.clauses.filter((clause)=>enabled.has(clause.id)).map((clause)=>`  - ${clause.field} ${clause.op} ${JSON.stringify(clause.value)}`).join("\n");
    return `QuerySpec\n  recipe: ${spec.recipe}\n  geography: ${spec.geography}\n  synthetic: true\n  clauses:\n${clauses}`;
}
