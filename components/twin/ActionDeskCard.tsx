// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useTwin } from "@/components/twin/TwinProvider";

export function ActionDeskCard() {
    const { state, hash, dispatch } = useTwin();
    if (state.scene !== "action") {
        return null;
    }
    return /*#__PURE__*/jsx("aside", {
        "data-surface": "desk",
        className: "absolute right-3 top-3 z-10 w-[13.5rem] border border-[color:var(--border)] bg-[color:var(--card)]/92 p-2 shadow-desk",
        children: /*#__PURE__*/jsxs("button", {
            type: "button",
            className: "w-full text-left",
            onClick: ()=>dispatch({
                    type: "INSPECT",
                    target: {
                        kind: "receipt",
                        id: "research enqueue"
                    }
                }),
            children: [
                /*#__PURE__*/jsx("p", {
                    className: "font-mono text-[9px] tracking-[0.14em] text-[color:var(--muted-foreground)] uppercase",
                    children: "DeedSonar desk"
                }),
                /*#__PURE__*/jsx("p", {
                    className: "mt-1 text-[11px] font-medium text-[#21272d]",
                    children: "SYN-NC-4417 · research"
                }),
                /*#__PURE__*/jsx("p", {
                    className: "font-mono text-[9px] text-[#256e96]",
                    children: "Enqueued · current estate"
                }),
                /*#__PURE__*/jsx("p", {
                    className: "mt-1 font-mono text-[9px] tracking-[0.12em] text-[#b42318] uppercase",
                    children: "Halted · call · drip"
                }),
                /*#__PURE__*/jsx("p", {
                    className: "mt-1 truncate font-mono text-[8px] text-[color:var(--muted-foreground)]",
                    children: hash
                })
            ]
        })
    });
}
