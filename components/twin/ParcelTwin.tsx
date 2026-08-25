// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { ActionDeskCard } from "@/components/twin/ActionDeskCard";
import { useTwin } from "@/components/twin/TwinProvider";
import { mobileAnnotationLine } from "@/lib/twin/annotations";
import { HARBOR_TRACT } from "@/lib/twin/property";
import { RECEIPT_STACK } from "@/lib/twin/stage-visual";
import { scenePurposeLine } from "@/lib/twin/stages";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const StageCanvas = dynamic(() => import("@/components/twin/stage/StageCanvas").then((mod) => mod.StageCanvas), {
    ssr: false,
    loading: () => jsx(StageWell, {}),
});
export function ParcelTwin({ className }) {
    const { state } = useTwin();
    return /*#__PURE__*/jsxs("div", {
        className: cn("relative isolate h-full min-h-0 w-full overflow-hidden bg-[#9eb6c8]", className),
        children: [
            /*#__PURE__*/jsx(StageCanvas, {}),
            /*#__PURE__*/jsx(StoryCaption, {}),
            /*#__PURE__*/jsx(ActionDeskCard, {}),
            state.mode === "reality" ? /*#__PURE__*/jsx(RealityStamp, {}) : null,
            /*#__PURE__*/jsx(ReceiptCompanion, {}),
            state.inspect ? /*#__PURE__*/jsxs("p", {
                className: "sr-only",
                children: [
                    "Inspecting ",
                    state.inspect.kind,
                    " ",
                    state.inspect.id
                ]
            }) : null
        ]
    });
}
function StoryCaption() {
    const { state } = useTwin();
    const exploded = state.exploded || state.scene === "receipt";
    const line = mobileAnnotationLine(state.scene, exploded, state.mode);
    return /*#__PURE__*/jsxs("div", {
        className: "pointer-events-none absolute bottom-3 left-3 z-10 max-w-[16rem]",
        children: [
            /*#__PURE__*/jsx("p", {
                className: "type-machine twin-whisper text-[10px] text-bone/55",
                children: "SYN-NC-4417 · SYNTHETIC · NOT A LIVE ESTATE"
            }),
            /*#__PURE__*/jsx("p", {
                className: "type-whisper twin-whisper mt-1 text-bone/70 md:hidden",
                children: scenePurposeLine(state.scene)
            }),
            line ? /*#__PURE__*/jsx("p", {
                className: "type-proof twin-whisper mt-1 text-copper/85 md:hidden",
                children: line
            }) : null
        ]
    });
}
function RealityStamp() {
    const { state } = useTwin();
    const point = HARBOR_TRACT.timeline[state.timeIndex];
    return /*#__PURE__*/jsxs("p", {
        className: "pointer-events-none absolute right-3 top-3 z-10 max-w-[14rem] text-right font-mono text-[10px] leading-relaxed tracking-[0.12em] text-bone/55 twin-whisper",
        children: [
            point.id,
            " · ",
            point.asOf
        ]
    });
}
function ReceiptCompanion() {
    const { state, dispatch } = useTwin();
    if (!(state.exploded || state.scene === "receipt")) {
        return null;
    }
    return /*#__PURE__*/jsxs("details", {
        className: "absolute bottom-16 right-3 z-10 w-[min(100%-1.5rem,12rem)] md:hidden",
        children: [
            /*#__PURE__*/jsx("summary", {
                className: "min-h-11 cursor-pointer px-1 py-2 font-mono text-[10px] tracking-[0.14em] text-bone/40 uppercase",
                children: "Layers"
            }),
            /*#__PURE__*/jsx("ol", {
                className: "flex max-h-48 flex-col gap-1 overflow-y-auto border border-bone/10 bg-paper/85 p-2",
                children: RECEIPT_STACK.map((layer)=>/*#__PURE__*/jsx("li", {
                        children: /*#__PURE__*/jsx("button", {
                            type: "button",
                            className: "min-h-11 w-full px-2 text-left font-mono text-[10px] tracking-[0.14em] text-bone",
                            onClick: ()=>dispatch({
                                    type: "INSPECT",
                                    target: {
                                        kind: "receipt",
                                        id: layer.label
                                    }
                                }),
                            children: layer.label
                        })
                    }, layer.id))
            })
        ]
    });
}
function StageWell() {
    return /*#__PURE__*/jsx("div", {
        className: "flex h-full min-h-[200px] items-center justify-center bg-[#9eb6c8] font-mono text-[11px] tracking-[0.16em] text-bone-2 uppercase",
        children: "Compiling Harbor Church tract"
    });
}
