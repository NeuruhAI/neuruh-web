// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { describeInspect } from "@/lib/twin/inspect";
import { useTwin } from "@/components/twin/TwinProvider";
import { Button } from "@/components/ui/button";
import { epistemicLabel } from "@/lib/twin/epistemic";

export function InspectDock() {
    const { state, dispatch } = useTwin();
    if (!state.inspect) {
        return null;
    }
    const copy = describeInspect(state.inspect);
    return /*#__PURE__*/jsxs("aside", {
        className: "absolute inset-x-3 bottom-3 z-20 border border-bone/15 bg-paper/95 p-4 shadow-lift backdrop-blur-md md:inset-x-auto md:right-4 md:bottom-16 md:w-[min(100%-2rem,22rem)]",
        children: [
            /*#__PURE__*/jsxs("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/jsxs("div", {
                        children: [
                            /*#__PURE__*/jsx("p", {
                                className: "type-kicker text-copper",
                                children: state.inspect.kind
                            }),
                            /*#__PURE__*/jsx("h3", {
                                className: "font-heading text-2xl leading-none text-bone",
                                children: copy.title
                            })
                        ]
                    }),
                    /*#__PURE__*/jsx(Button, {
                        type: "button",
                        size: "sm",
                        variant: "ghost",
                        onClick: ()=>dispatch({
                                type: "INSPECT",
                                target: null
                            }),
                        children: "Close"
                    })
                ]
            }),
            copy.epi ? /*#__PURE__*/jsx("p", {
                className: "mt-2 font-mono text-[10px] tracking-[0.12em] text-bone-2 uppercase",
                children: epistemicLabel(copy.epi)
            }) : null,
            /*#__PURE__*/jsx("pre", {
                className: "mt-3 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-bone/75",
                children: copy.body
            })
        ]
    });
}
