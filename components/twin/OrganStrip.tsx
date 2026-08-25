// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { ProofBadge } from "@/components/atlas/ProofBadge";
import { useTwin } from "@/components/twin/TwinProvider";
import { ORGAN_CLOTHS, clothLabel, clothNote, clothStatus } from "@/lib/twin/organ-cloth";
import { cn } from "@/lib/utils";

export function OrganStrip() {
    const { state, dispatch } = useTwin();
    return /*#__PURE__*/jsxs("div", {
        className: "border-t border-bone/10 bg-paper px-3 py-3 md:px-5",
        children: [
            /*#__PURE__*/jsxs("div", {
                className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/jsx("p", {
                        className: "max-w-xl text-sm text-bone-2",
                        children: "The artifact changes clothes. The thread does not. Morphing other organs is an illustration except where status says Live."
                    }),
                    /*#__PURE__*/jsx("div", {
                        className: "flex flex-wrap gap-2",
                        children: ORGAN_CLOTHS.map((cloth)=>/*#__PURE__*/jsxs("div", {
                                className: cn("flex min-h-11 items-center gap-2 border px-3 py-1.5", state.clothing === cloth ? "border-copper bg-ink" : "border-bone/15 bg-paper"),
                                children: [
                                    /*#__PURE__*/jsx("button", {
                                        type: "button",
                                        onClick: ()=>dispatch({
                                                type: "SET_CLOTHING",
                                                clothing: cloth
                                            }),
                                        className: "font-mono text-[11px] tracking-[0.14em] uppercase",
                                        children: clothLabel(cloth)
                                    }),
                                    /*#__PURE__*/jsx(ProofBadge, {
                                        status: clothStatus(cloth)
                                    })
                                ]
                            }, cloth))
                    })
                ]
            }),
            /*#__PURE__*/jsx("p", {
                className: "mt-2 font-mono text-[11px] text-bone-2",
                children: clothNote(state.clothing)
            })
        ]
    });
}
