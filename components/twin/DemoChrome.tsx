// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useTwin } from "@/components/twin/TwinProvider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HARBOR_TRACT } from "@/lib/twin/property";
import { QUERY_SPEC } from "@/lib/twin/query";
import { storyActions } from "@/lib/twin/stage-visual";
import { SCENES, sceneIndex, scenePurposeLine, sceneSpec } from "@/lib/twin/stages";
import { ChevronLeft, ChevronRight, Eye, FileSearch, Hash, Pause, Play, RotateCcw } from "lucide-react";

export function DemoChrome() {
    const { state, dispatch, remaining, hash, reducedMotion } = useTwin();
    const index = sceneIndex(state.scene);
    const actions = storyActions(state.scene);
    const reality = state.mode === "reality";
    const stage = sceneSpec(state.scene);
    return /*#__PURE__*/jsxs("div", {
        className: reality ? "border-t border-bone/10 bg-paper/90 px-3 py-2 md:px-5" : "border-t border-bone/10 bg-paper/55 px-3 py-1.5 backdrop-blur-sm md:px-4",
        children: [
            /*#__PURE__*/jsxs("div", {
                className: "flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between",
                children: [
                    /*#__PURE__*/jsxs("div", {
                        className: "flex min-w-0 flex-wrap items-center gap-2",
                        children: [
                            /*#__PURE__*/jsxs(Button, {
                                type: "button",
                                size: "sm",
                                variant: "outline",
                                className: "min-h-11 rounded-sm border-bone/20",
                                onClick: ()=>dispatch({
                                        type: "TOGGLE_PLAY"
                                    }),
                                disabled: reducedMotion,
                                "data-twin-control": "play",
                                children: [
                                    state.playing ? /*#__PURE__*/jsx(Pause, {}) : /*#__PURE__*/jsx(Play, {}),
                                    state.playing ? "Pause" : "Continue"
                                ]
                            }),
                            /*#__PURE__*/jsx(Button, {
                                type: "button",
                                size: "sm",
                                variant: "outline",
                                className: "min-h-11 min-w-11 rounded-sm border-bone/20",
                                "aria-label": "Previous stage",
                                "data-twin-control": "prev",
                                disabled: index <= 0,
                                onClick: ()=>dispatch({
                                        type: "PREV"
                                    }),
                                children: /*#__PURE__*/jsx(ChevronLeft, {})
                            }),
                            /*#__PURE__*/jsx(Button, {
                                type: "button",
                                size: "sm",
                                variant: "outline",
                                className: "min-h-11 min-w-11 rounded-sm border-bone/20",
                                "aria-label": "Next stage",
                                "data-twin-control": "next",
                                disabled: index >= SCENES.length - 1,
                                onClick: ()=>dispatch({
                                        type: "NEXT"
                                    }),
                                children: /*#__PURE__*/jsx(ChevronRight, {})
                            }),
                            /*#__PURE__*/jsxs("label", {
                                className: "flex min-h-11 min-w-[10rem] flex-1 items-center gap-3",
                                children: [
                                    /*#__PURE__*/jsx("span", {
                                        className: "sr-only",
                                        children: "Scene scrubber"
                                    }),
                                    /*#__PURE__*/jsx("input", {
                                        type: "range",
                                        min: 0,
                                        max: SCENES.length - 1,
                                        value: index,
                                        onChange: (event)=>dispatch({
                                                type: "GOTO",
                                                scene: SCENES[Number(event.target.value)]
                                            }),
                                        "data-twin-control": "scrub",
                                        "aria-valuetext": stage.act,
                                        className: "h-2 w-full cursor-pointer appearance-none bg-bone/15 accent-copper"
                                    })
                                ]
                            }),
                            /*#__PURE__*/jsxs("p", {
                                className: "font-heading text-lg leading-none text-bone",
                                children: [
                                    stage.act,
                                    /*#__PURE__*/jsx("span", {
                                        className: "ml-2 font-mono text-[11px] tracking-[0.16em] text-copper uppercase",
                                        children: stage.verb
                                    })
                                ]
                            }),
                            reality ? null : /*#__PURE__*/jsx("p", {
                                className: "type-whisper hidden max-w-xs truncate lg:block",
                                children: scenePurposeLine(state.scene)
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("div", {
                        className: "flex flex-wrap items-center gap-1.5",
                        children: [
                            reality ? /*#__PURE__*/jsxs(Button, {
                                type: "button",
                                size: "sm",
                                variant: state.spatial ? "default" : "outline",
                                className: "min-h-11 rounded-sm",
                                onClick: ()=>dispatch({
                                        type: "TOGGLE_SPATIAL"
                                    }),
                                children: [
                                    /*#__PURE__*/jsx(RotateCcw, {}),
                                    "Rotate"
                                ]
                            }) : null,
                            reality || actions.inspect ? /*#__PURE__*/jsxs(ChromeAction, {
                                label: "Inspect",
                                onClick: ()=>dispatch({
                                        type: "INSPECT",
                                        target: {
                                            kind: "source",
                                            id: "src-recorder"
                                        }
                                    }),
                                children: [
                                    /*#__PURE__*/jsx(FileSearch, {}),
                                    reality ? "Inspect" : null
                                ]
                            }) : null,
                            reality || actions.why ? /*#__PURE__*/jsxs(ChromeAction, {
                                label: "Show why",
                                onClick: ()=>dispatch({
                                        type: "INSPECT",
                                        target: {
                                            kind: "signal",
                                            id: "delinquent"
                                        }
                                    }),
                                children: [
                                    /*#__PURE__*/jsx(Eye, {}),
                                    reality ? "Show why" : null
                                ]
                            }) : null,
                            reality || actions.explode ? /*#__PURE__*/jsxs(ChromeAction, {
                                label: "Explode proof",
                                pressed: state.exploded || state.scene === "receipt",
                                onClick: ()=>{
                                    dispatch({
                                        type: "GOTO",
                                        scene: "receipt"
                                    });
                                    dispatch({
                                        type: "SET_EXPLODED",
                                        exploded: true
                                    });
                                },
                                children: [
                                    /*#__PURE__*/jsx(Hash, {}),
                                    reality ? "Explode proof" : null
                                ]
                            }) : null,
                            reality ? /*#__PURE__*/jsxs(Fragment, {
                                children: [
                                    /*#__PURE__*/jsx(Button, {
                                        type: "button",
                                        size: "sm",
                                        variant: "outline",
                                        className: "min-h-11 rounded-sm",
                                        onClick: ()=>dispatch({
                                                type: "SET_MODE",
                                                mode: "story"
                                            }),
                                        children: "Story"
                                    }),
                                    /*#__PURE__*/jsx(Button, {
                                        type: "button",
                                        size: "sm",
                                        variant: "default",
                                        className: "min-h-11 rounded-sm",
                                        children: "Reality"
                                    })
                                ]
                            }) : /*#__PURE__*/jsx("button", {
                                type: "button",
                                className: "type-whisper min-h-11 px-2 text-bone/55 hover:text-bone",
                                onClick: ()=>dispatch({
                                        type: "SET_MODE",
                                        mode: "reality"
                                    }),
                                children: "Reality"
                            })
                        ]
                    })
                ]
            }),
            reality ? /*#__PURE__*/jsxs("div", {
                className: "mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/jsx("div", {
                        className: "flex gap-1",
                        role: "group",
                        "aria-label": "Time",
                        children: HARBOR_TRACT.timeline.map((point, timeIndex)=>/*#__PURE__*/jsx(Button, {
                                type: "button",
                                size: "xs",
                                variant: state.timeIndex === timeIndex ? "default" : "outline",
                                className: "rounded-sm",
                                onClick: ()=>dispatch({
                                        type: "SET_TIME",
                                        timeIndex: timeIndex
                                    }),
                                children: point.id
                            }, point.id))
                    }),
                    /*#__PURE__*/jsxs("p", {
                        className: "font-mono text-[11px] text-bone-2",
                        children: [
                            "SYNTHETIC UNIVERSE ",
                            remaining.toLocaleString(),
                            " · ",
                            hash
                        ]
                    }),
                    /*#__PURE__*/jsxs("p", {
                        className: "hidden font-mono text-[11px] text-bone/45 md:block",
                        children: [
                            "Space pause · arrows scrub · R story/reality · ",
                            SCENES[sceneIndex(state.scene)],
                            " · ",
                            QUERY_SPEC.recipe
                        ]
                    })
                ]
            }) : null
        ]
    });
}
function ChromeAction({ label, onClick, pressed, children }) {
    return /*#__PURE__*/jsxs(Tooltip, {
        children: [
            /*#__PURE__*/jsx(TooltipTrigger, {
                asChild: true,
                children: /*#__PURE__*/jsx(Button, {
                    type: "button",
                    size: "sm",
                    variant: pressed ? "default" : "outline",
                    className: "min-h-11 min-w-11 rounded-sm",
                    "aria-label": label,
                    onClick: onClick,
                    children: children
                })
            }),
            /*#__PURE__*/jsx(TooltipContent, {
                children: label
            })
        ]
    });
}
