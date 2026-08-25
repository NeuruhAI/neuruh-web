// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { assertNever, statusDefinition, statusLabel } from "@/lib/status";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function tone(status) {
    switch(status){
        case "LIVE":
            return "border-[color:var(--live)] bg-[color:var(--live)]/15 font-medium text-[color:var(--live)]";
        case "PROVEN":
            return "border-[color:var(--proven)] bg-[color:var(--proven)]/15 font-medium text-[color:var(--proven)]";
        case "BUILT":
            return "border-[color:var(--built)] bg-[color:var(--built)]/15 font-medium text-[color:var(--built)]";
        case "PROPOSED":
            return "border-[color:var(--proposed)] bg-[color:var(--proposed)]/20 font-medium text-[color:var(--proposed)]";
        default:
            return assertNever(status);
    }
}
export function ProofBadge({ status, className }) {
    return /*#__PURE__*/jsxs(Tooltip, {
        children: [
            /*#__PURE__*/jsx(TooltipTrigger, {
                className: cn("type-kicker inline-flex items-center rounded-[2px] border px-1.5 py-0.5", tone(status), className),
                children: statusLabel(status)
            }),
            /*#__PURE__*/jsx(TooltipContent, {
                className: "max-w-xs",
                children: statusDefinition(status)
            })
        ]
    });
}
