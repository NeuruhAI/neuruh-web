// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { COMMERCIAL } from "@/lib/content/commercial";
import { PRIMITIVES } from "@/lib/content/primitives";
import { PRODUCTS } from "@/lib/content/products";
import { highestStatus } from "@/lib/status";

export const ATLAS = {
    name: "Neuruh",
    domain: "neuruh.com",
    title: "Neuruh — intelligence that can act",
    description: "Neuruh is intelligence infrastructure that can act. A living digital twin: watch a property constructed from source evidence through recipe, authority, action, and receipt.",
    thesis: "Intelligence that can act.",
    observedAt: "2026-08-24"
};
export const NAV = [
    {
        href: "/#loop",
        label: "Loop"
    },
    {
        href: "/#deedsonar",
        label: "DeedSonar"
    },
    {
        href: "/#infrastructure",
        label: "Infrastructure"
    },
    {
        href: "/products",
        label: "Organs"
    },
    {
        href: "/proof",
        label: "Proof"
    },
    {
        href: "/build",
        label: "Build"
    }
];
export function inventoryByStatus() {
    const buckets = {
        LIVE: [],
        PROVEN: [],
        BUILT: [],
        PROPOSED: []
    };
    for (const product of PRODUCTS){
        buckets[highestStatus(product.statusNotes)].push(product.name);
    }
    for (const primitive of PRIMITIVES){
        buckets[highestStatus(primitive.statusNotes)].push(primitive.name);
    }
    for (const commercial of COMMERCIAL){
        buckets[commercial.status].push(commercial.name);
    }
    return buckets;
}
