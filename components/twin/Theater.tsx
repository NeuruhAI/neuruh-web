// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { DemoChrome } from "@/components/twin/DemoChrome";
import { InspectDock } from "@/components/twin/InspectDock";
import { NeuruhThread } from "@/components/twin/NeuruhThread";
import { OrganStrip } from "@/components/twin/OrganStrip";
import { ParcelTwin } from "@/components/twin/ParcelTwin";
import { TwinProvider, useTwin } from "@/components/twin/TwinProvider";
import { WorkPanel } from "@/components/twin/WorkPanel";
import { HARBOR_TRACT } from "@/lib/twin/property";
import { SCENES, scenePurposeLine } from "@/lib/twin/stages";
import { useEffect } from "react";

export function Theater() {
    return /*#__PURE__*/jsx(TwinProvider, {
        children: /*#__PURE__*/jsx(TheaterFrame, {})
    });
}
function TheaterFrame() {
    const { state, dispatch } = useTwin();
    const reality = state.mode === "reality";
    useEffect(()=>{
            const onKey = (event)=>{
                    const target = event.target;
                    if (target && [
                        "INPUT",
                        "TEXTAREA"
                    ].includes(target.tagName)) {
                        return;
                    }
                    switch(event.key){
                        case " ":
                            event.preventDefault();
                            dispatch({
                                type: "TOGGLE_PLAY"
                            });
                            break;
                        case "ArrowRight":
                            dispatch({
                                type: "NEXT"
                            });
                            break;
                        case "ArrowLeft":
                            dispatch({
                                type: "PREV"
                            });
                            break;
                        case "r":
                        case "R":
                            dispatch({
                                type: "TOGGLE_MODE"
                            });
                            break;
                        case "Escape":
                            dispatch({
                                type: "INSPECT",
                                target: null
                            });
                            break;
                        default:
                            break;
                    }
                };
            window.addEventListener("keydown", onKey);
            return ()=>window.removeEventListener("keydown", onKey);
        }, [
        dispatch
    ]);
    return /*#__PURE__*/jsxs("div", {
        className: "relative flex h-[calc(100svh-3.5rem)] min-h-0 flex-col bg-[#9eb6c8]",
        "data-twin-scene": state.scene,
        "data-twin-playing": state.playing ? "true" : "false",
        "data-twin-mode": state.mode,
        children: [
            reality ? /*#__PURE__*/jsxs("div", {
                className: "grid min-h-0 flex-1 lg:grid-cols-[4.75rem_minmax(0,1fr)_minmax(18rem,22rem)]",
                children: [
                    /*#__PURE__*/jsx("div", {
                        className: "hidden border-r border-bone/10 p-2 lg:block",
                        children: /*#__PURE__*/jsx(NeuruhThread, {
                            compact: true,
                            className: "h-full"
                        })
                    }),
                    /*#__PURE__*/jsx(ParcelTwin, {
                        className: "min-h-0"
                    }),
                    /*#__PURE__*/jsx(WorkPanel, {})
                ]
            }) : /*#__PURE__*/jsxs("div", {
                className: "relative min-h-0 flex-1",
                children: [
                    /*#__PURE__*/jsx(ParcelTwin, {
                        className: "absolute inset-0 min-h-0"
                    }),
                    /*#__PURE__*/jsx(NeuruhThread, {
                        compact: true,
                        className: "pointer-events-auto absolute bottom-3 left-2 top-14 z-10 hidden w-11 opacity-70 transition-opacity hover:opacity-100 lg:flex"
                    }),
                    /*#__PURE__*/jsx(MonumentLine, {}),
                    /*#__PURE__*/jsx(InspectDock, {})
                ]
            }),
            reality ? /*#__PURE__*/jsx("div", {
                className: "border-t border-bone/10 p-3 lg:hidden",
                children: /*#__PURE__*/jsx(NeuruhThread, {
                    compact: true
                })
            }) : null,
            /*#__PURE__*/jsx(DemoChrome, {}),
            reality ? /*#__PURE__*/jsx(OrganStrip, {}) : null,
            /*#__PURE__*/jsxs("span", {
                className: "sr-only",
                "aria-live": "polite",
                children: [
                    "Scene ",
                    state.scene,
                    " of ",
                    SCENES.length,
                    ". ",
                    HARBOR_TRACT.timeline[state.timeIndex].why,
                    ".",
                    " ",
                    scenePurposeLine(state.scene)
                ]
            })
        ]
    });
}
function MonumentLine() {
    const { state } = useTwin();
    if (state.scene !== "world" || state.inspect) {
        return /*#__PURE__*/jsx("h1", {
            className: "sr-only",
            children: "Intelligence that can act."
        });
    }
    return /*#__PURE__*/jsx("div", {
        className: "monument-enter pointer-events-none absolute left-1/2 top-3 z-10 w-[min(100%-2rem,28rem)] -translate-x-1/2 text-center",
        children: /*#__PURE__*/jsx("p", {
            className: "twin-whisper font-heading text-3xl leading-none text-bone/70 sm:text-4xl",
            children: "Intelligence that can act."
        })
    });
}
