// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { SCENE_SPECS, sceneIndex, scenePurposeLine } from "@/lib/twin/stages";
import { cn } from "@/lib/utils";
import { useTwin } from "@/components/twin/TwinProvider";

export function NeuruhThread({ className, compact = false }) {
    const { state, dispatch } = useTwin();
    const progress = sceneIndex(state.scene) / Math.max(1, SCENE_SPECS.length - 1);
    return /*#__PURE__*/jsxs("nav", {
        "aria-label": "Neuruh thread",
        className: cn("flex flex-col", compact && "lg:h-full", className),
        children: [
            compact ? null : /*#__PURE__*/jsx("p", {
                className: "type-kicker mb-3 text-copper",
                children: "Thread"
            }),
            /*#__PURE__*/jsxs("div", {
                className: cn("relative", compact ? "hidden flex-1 lg:block" : "flex-1"),
                children: [
                    /*#__PURE__*/jsx("span", {
                        "aria-hidden": "true",
                        className: "absolute top-2 bottom-2 left-[9px] w-px bg-bone/15"
                    }),
                    /*#__PURE__*/jsx("span", {
                        "aria-hidden": "true",
                        className: "absolute top-2 left-[9px] w-px origin-top bg-copper transition-transform duration-700",
                        style: {
                            height: `calc(${Math.max(progress, 0.04)} * (100% - 16px))`
                        }
                    }),
                    /*#__PURE__*/jsx("ol", {
                        className: "relative space-y-1",
                        children: SCENE_SPECS.map((scene)=>/*#__PURE__*/jsx(ThreadStep, {
                                id: scene.id,
                                act: scene.act,
                                verb: scene.verb,
                                active: scene.id === state.scene,
                                passed: sceneIndex(state.scene) > sceneIndex(scene.id),
                                compact: compact,
                                onSelect: ()=>dispatch({
                                        type: "GOTO",
                                        scene: scene.id
                                    })
                            }, scene.id))
                    })
                ]
            }),
            compact ? /*#__PURE__*/jsx("ol", {
                className: "flex gap-1 overflow-x-auto lg:hidden",
                children: SCENE_SPECS.map((scene)=>/*#__PURE__*/jsx(ThreadStep, {
                        id: scene.id,
                        act: scene.act,
                        verb: scene.verb,
                        active: scene.id === state.scene,
                        passed: sceneIndex(state.scene) > sceneIndex(scene.id),
                        compact: true,
                        onSelect: ()=>dispatch({
                                type: "GOTO",
                                scene: scene.id
                            })
                    }, `m-${scene.id}`))
            }) : null,
            compact ? null : /*#__PURE__*/jsx("p", {
                className: "mt-4 max-w-[16rem] text-xs leading-relaxed text-bone-2",
                children: scenePurposeLine(state.scene)
            })
        ]
    });
}
function ThreadStep({ id, act, verb, active, passed, compact, onSelect }) {
    return /*#__PURE__*/jsx("li", {
        className: compact ? "shrink-0" : undefined,
        children: /*#__PURE__*/jsxs("button", {
            type: "button",
            onClick: onSelect,
            "aria-current": active ? "step" : undefined,
            "aria-label": `${act} ${verb}`,
            title: `${act} — ${verb}`,
            "data-twin-stage": id,
            className: cn("flex min-h-11 min-w-11 items-center justify-center text-left lg:w-full lg:items-start lg:justify-start lg:gap-3 lg:py-1.5", active ? "text-bone" : passed ? "text-bone" : "text-bone-2"),
            children: [
                /*#__PURE__*/jsx("span", {
                    className: cn("size-5 shrink-0 rounded-full border lg:mt-1", active ? "border-copper bg-copper" : passed ? "border-copper/70 bg-paper" : "border-bone/25 bg-paper")
                }),
                compact ? null : /*#__PURE__*/jsxs("span", {
                    children: [
                        /*#__PURE__*/jsx("span", {
                            className: "block font-mono text-[10px] tracking-[0.16em] uppercase",
                            children: act
                        }),
                        /*#__PURE__*/jsx("span", {
                            className: "block text-[11px] leading-snug text-bone-2",
                            children: verb
                        })
                    ]
                })
            ]
        })
    });
}
