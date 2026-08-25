// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Annotations } from "@/components/twin/stage/Annotations";
import { CameraRig } from "@/components/twin/stage/CameraRig";
import { Evidence } from "@/components/twin/stage/Evidence";
import { ExplodeGroup } from "@/components/twin/stage/ExplodeGroup";
import { House } from "@/components/twin/stage/House";
import { LayerTab } from "@/components/twin/stage/LayerTab";
import { Studio } from "@/components/twin/stage/Studio";
import { Terrain } from "@/components/twin/stage/Terrain";
import { ThreadSpine } from "@/components/twin/stage/ThreadSpine";
import { useTwin } from "@/components/twin/TwinProvider";
import { assertNever } from "@/lib/status";
import { HOUSE } from "@/lib/twin/stage-geometry";
import { OrbitControls } from "@react-three/drei";

export function HarborScene() {
    const { state, reducedMotion, dispatch } = useTwin();
    const exploded = state.exploded || state.scene === "receipt";
    return /*#__PURE__*/jsxs(Fragment, {
        children: [
            /*#__PURE__*/jsx(Studio, {}),
            /*#__PURE__*/jsx(CameraRig, {
                scene: state.scene,
                exploded: exploded,
                spatial: state.spatial,
                reducedMotion: reducedMotion
            }),
            /*#__PURE__*/jsx(OrbitControls, {
                enabled: state.spatial,
                enablePan: false,
                minDistance: 1.8,
                maxDistance: 36,
                maxPolarAngle: 1.35,
                enableDamping: !reducedMotion
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 0,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "WORLD",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "receipt",
                                    id: "WORLD"
                                }
                            })
                    }),
                    /*#__PURE__*/jsx(Terrain, {
                        scene: state.scene
                    })
                ]
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 4,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "SIGNALS",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "signal",
                                    id: "delinquent"
                                }
                            })
                    }),
                    /*#__PURE__*/jsx(House, {
                        scene: state.scene
                    }),
                    /*#__PURE__*/jsx(Clothing, {})
                ]
            }),
            /*#__PURE__*/jsx(Evidence, {
                scene: state.scene
            }),
            /*#__PURE__*/jsx(ThreadSpine, {
                exploded: exploded
            }),
            /*#__PURE__*/jsx(Annotations, {})
        ]
    });
}
function Clothing() {
    const { state } = useTwin();
    const { x, z, width, depth, wall, roof } = HOUSE;
    switch(state.clothing){
        case "deedsonar":
            return null;
        case "findsellprofit":
            return /*#__PURE__*/jsx("group", {
                position: [
                    x,
                    wall * 0.7,
                    z
                ],
                children: /*#__PURE__*/jsxs("mesh", {
                    castShadow: true,
                    children: [
                        /*#__PURE__*/jsx("boxGeometry", {
                            args: [
                                width + 0.28,
                                wall + roof,
                                depth + 0.24
                            ]
                        }),
                        /*#__PURE__*/jsx("meshStandardMaterial", {
                            color: "#c4b8a4",
                            transparent: true,
                            opacity: 0.32
                        })
                    ]
                })
            });
        case "bookeit":
            return /*#__PURE__*/jsx("group", {
                position: [
                    x,
                    wall + 0.08,
                    z
                ],
                children: /*#__PURE__*/jsxs("mesh", {
                    rotation: [
                        Math.PI / 2,
                        0,
                        0
                    ],
                    children: [
                        /*#__PURE__*/jsx("torusGeometry", {
                            args: [
                                width * 0.7,
                                0.018,
                                8,
                                32
                            ]
                        }),
                        /*#__PURE__*/jsx("meshStandardMaterial", {
                            color: "#2c5d86"
                        })
                    ]
                })
            });
        case "proofos":
            return /*#__PURE__*/jsx("group", {
                position: [
                    x,
                    wall + roof,
                    z
                ],
                children: Array.from({
                    length: 5
                }, (_, index)=>/*#__PURE__*/jsxs("mesh", {
                        position: [
                            index * 0.02 - 0.04,
                            index * 0.03,
                            0
                        ],
                        rotation: [
                            0.06,
                            0.08 * index,
                            0
                        ],
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    width * 0.9,
                                    0.012,
                                    depth * 0.9
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#efe6d3"
                            })
                        ]
                    }, index))
            });
        default:
            return assertNever(state.clothing);
    }
}
