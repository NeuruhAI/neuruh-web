// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { ExplodeGroup } from "@/components/twin/stage/ExplodeGroup";
import { LayerTab } from "@/components/twin/stage/LayerTab";
import { damp, pickCursor } from "@/components/twin/stage/motion";
import { RecipeCage } from "@/components/twin/stage/RecipeCage";
import { useTwin } from "@/components/twin/TwinProvider";
import { HARBOR_TRACT } from "@/lib/twin/property";
import { HOUSE, SOURCE_PADS } from "@/lib/twin/stage-geometry";
import { layerSpeed } from "@/lib/twin/stage-visual";
import { hasReached } from "@/lib/twin/stages";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function Evidence({ scene }) {
    const { state, dispatch, matched } = useTwin();
    const exploded = state.exploded || scene === "receipt";
    const observed = hasReached(scene, "observe");
    const custody = hasReached(scene, "custody");
    const identity = hasReached(scene, "identity");
    const fact = hasReached(scene, "fact");
    const decision = hasReached(scene, "decision");
    const authority = hasReached(scene, "authority");
    const scan = useRef(null);
    useFrame((clockState, dt)=>{
            if (!scan.current) {
                return;
            }
            if (!authority || exploded) {
                scan.current.position.y = damp(scan.current.position.y, 0.12, dt, 4);
                return;
            }
            scan.current.position.y = 0.1 + Math.sin(clockState.clock.elapsedTime * 1.05) * 0.12;
        });
    return /*#__PURE__*/jsxs("group", {
        children: [
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 1,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "RAW SOURCES",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "source",
                                    id: "src-recorder"
                                }
                            })
                    }),
                    HARBOR_TRACT.sources.map((source, index)=>{
                        const pad = SOURCE_PADS[index] ?? SOURCE_PADS[0];
                        return /*#__PURE__*/jsx(Packet, {
                            visible: observed,
                            x: pad.x,
                            z: pad.z,
                            held: custody && !source.accepted,
                            stamped: custody && source.accepted,
                            onClick: ()=>dispatch({
                                    type: "INSPECT",
                                    target: {
                                        kind: "source",
                                        id: source.id
                                    }
                                })
                        }, source.id);
                    })
                ]
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 2,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "EVIDENCE",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "identifier",
                                    id: "apn"
                                }
                            })
                    }),
                    HARBOR_TRACT.identifiers.map((identifier, index)=>/*#__PURE__*/jsx(Tag, {
                            index: index,
                            converged: identity,
                            onClick: ()=>dispatch({
                                    type: "INSPECT",
                                    target: {
                                        kind: "identifier",
                                        id: identifier.kind
                                    }
                                })
                        }, identifier.kind))
                ]
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 3,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "FACTS",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "fact",
                                    id: "acres"
                                }
                            })
                    }),
                    /*#__PURE__*/jsxs("group", {
                        visible: fact,
                        children: [
                            /*#__PURE__*/jsxs("mesh", {
                                position: [
                                    0,
                                    0.05,
                                    3.4
                                ],
                                children: [
                                    /*#__PURE__*/jsx("boxGeometry", {
                                        args: [
                                            8.4,
                                            0.016,
                                            0.02
                                        ]
                                    }),
                                    /*#__PURE__*/jsx("meshStandardMaterial", {
                                        color: "#2c5d86",
                                        metalness: 0.3,
                                        roughness: 0.4
                                    })
                                ]
                            }),
                            /*#__PURE__*/jsxs("mesh", {
                                position: [
                                    -4.2,
                                    0.045,
                                    0
                                ],
                                rotation: [
                                    0,
                                    0.18,
                                    0
                                ],
                                children: [
                                    /*#__PURE__*/jsx("boxGeometry", {
                                        args: [
                                            4.6,
                                            0.016,
                                            0.02
                                        ]
                                    }),
                                    /*#__PURE__*/jsx("meshStandardMaterial", {
                                        color: "#5a6570",
                                        metalness: 0.2,
                                        roughness: 0.45
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 5,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "RECIPE",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "clause",
                                    id: "estate.off_market.high_equity"
                                }
                            })
                    }),
                    /*#__PURE__*/jsx(RecipeCage, {
                        scene: scene
                    })
                ]
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 6,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "DECISION",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "receipt",
                                    id: "RESEARCH"
                                }
                            })
                    }),
                    /*#__PURE__*/jsxs("group", {
                        visible: decision,
                        children: [
                            /*#__PURE__*/jsxs("mesh", {
                                position: [
                                    HOUSE.x + 0.72,
                                    0.2,
                                    HOUSE.z
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/jsx("boxGeometry", {
                                        args: [
                                            0.22,
                                            0.36,
                                            0.18
                                        ]
                                    }),
                                    /*#__PURE__*/jsx("meshStandardMaterial", {
                                        color: "#dfe8f0",
                                        transparent: true,
                                        opacity: authority ? 0.55 : 0.28
                                    })
                                ]
                            }),
                            /*#__PURE__*/jsxs("mesh", {
                                position: [
                                    HOUSE.x - 0.72,
                                    0.2,
                                    HOUSE.z
                                ],
                                children: [
                                    /*#__PURE__*/jsx("boxGeometry", {
                                        args: [
                                            0.22,
                                            0.36,
                                            0.18
                                        ]
                                    }),
                                    /*#__PURE__*/jsx("meshStandardMaterial", {
                                        color: "#e8d4d0",
                                        transparent: true,
                                        opacity: authority ? 0.06 : 0.2
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 7,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "AUTHORITY",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "receipt",
                                    id: "gate"
                                }
                            })
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        ref: scan,
                        position: [
                            HOUSE.x,
                            0.12,
                            HOUSE.z
                        ],
                        visible: authority,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    HOUSE.width + 0.35,
                                    0.012,
                                    HOUSE.depth + 0.3
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#c9a227",
                                transparent: true,
                                opacity: 0.22
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 8,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "ACTION",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "receipt",
                                    id: "research enqueue"
                                }
                            })
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            HOUSE.x + 0.18,
                            0.08,
                            HOUSE.z + 0.12
                        ],
                        visible: hasReached(scene, "action"),
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("coneGeometry", {
                                args: [
                                    0.035,
                                    0.12,
                                    8
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#256e96",
                                metalness: 0.35,
                                roughness: 0.38
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/jsxs(ExplodeGroup, {
                index: 9,
                exploded: exploded,
                children: [
                    /*#__PURE__*/jsx(LayerTab, {
                        label: "OUTCOME",
                        exploded: exploded,
                        onInspect: ()=>dispatch({
                                type: "INSPECT",
                                target: {
                                    kind: "receipt",
                                    id: "historical CRM"
                                }
                            })
                    }),
                    /*#__PURE__*/jsx("group", {
                        visible: exploded || scene === "outcome",
                        children: /*#__PURE__*/jsxs("mesh", {
                            position: [
                                1.4,
                                0.06,
                                5.7
                            ],
                            rotation: [
                                -0.06,
                                0.2,
                                0
                            ],
                            castShadow: true,
                            children: [
                                /*#__PURE__*/jsx("boxGeometry", {
                                    args: [
                                        0.55,
                                        0.012,
                                        0.38
                                    ]
                                }),
                                /*#__PURE__*/jsx("meshStandardMaterial", {
                                    color: "#efe6d3",
                                    roughness: 0.75
                                })
                            ]
                        })
                    })
                ]
            }),
            matched && hasReached(scene, "signal") ? /*#__PURE__*/jsxs("mesh", {
                position: [
                    HOUSE.x,
                    0.04,
                    HOUSE.z
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/jsx("ringGeometry", {
                        args: [
                            0.85,
                            0.96,
                            28
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#b56a3a",
                        transparent: true,
                        opacity: 0.35
                    })
                ]
            }) : null
        ]
    });
}
function Packet({ visible, x, z, held, stamped, onClick }) {
    const ref = useRef(null);
    useFrame((_, dt)=>{
            const group = ref.current;
            if (!group) {
                return;
            }
            const targetY = visible ? 0.035 : 3.2;
            const targetX = visible ? x : x + 2;
            group.position.y = damp(group.position.y, targetY, dt, layerSpeed("data"));
            group.position.x = damp(group.position.x, targetX, dt, layerSpeed("data"));
            group.visible = visible || group.position.y < 2.8;
        });
    return /*#__PURE__*/jsxs("group", {
        ref: ref,
        position: [
            x + 3,
            3.4,
            z
        ],
        ...pickCursor(onClick),
        children: [
            /*#__PURE__*/jsxs("mesh", {
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("boxGeometry", {
                        args: [
                            0.16,
                            0.012,
                            0.11
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: held ? "#d9dde1" : "#efe6d3",
                        roughness: 0.72
                    })
                ]
            }),
            stamped ? /*#__PURE__*/jsxs("mesh", {
                position: [
                    0.04,
                    0.01,
                    0.02
                ],
                children: [
                    /*#__PURE__*/jsx("cylinderGeometry", {
                        args: [
                            0.018,
                            0.018,
                            0.008,
                            12
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#2c5d86"
                    })
                ]
            }) : null
        ]
    });
}
function Tag({ index, converged, onClick }) {
    const ref = useRef(null);
    const scattered = [
        [
            -4.2,
            1.4
        ],
        [
            4.4,
            1.6
        ],
        [
            -3.6,
            -2.6
        ],
        [
            4.1,
            -2.8
        ],
        [
            5.0,
            0.2
        ],
        [
            -4.8,
            -0.6
        ]
    ][index] ?? [
        -4,
        0
    ];
    useFrame((_, dt)=>{
            const group = ref.current;
            if (!group) {
                return;
            }
            const tx = converged ? HOUSE.x - 0.08 : scattered[0];
            const tz = converged ? HOUSE.z + 0.06 + index * 0.04 : scattered[1];
            const ty = converged ? 0.05 + index * 0.018 : 0.04;
            group.position.x = damp(group.position.x, tx, dt, layerSpeed("data"));
            group.position.z = damp(group.position.z, tz, dt, layerSpeed("data"));
            group.position.y = damp(group.position.y, ty, dt, layerSpeed("lock"));
        });
    return /*#__PURE__*/jsx("group", {
        ref: ref,
        position: [
            scattered[0],
            0.05,
            scattered[1]
        ],
        ...pickCursor(onClick),
        children: /*#__PURE__*/jsxs("mesh", {
            castShadow: true,
            children: [
                /*#__PURE__*/jsx("cylinderGeometry", {
                    args: [
                        0.035,
                        0.04,
                        0.02,
                        12
                    ]
                }),
                /*#__PURE__*/jsx("meshStandardMaterial", {
                    color: "#b08a4a",
                    metalness: 0.55,
                    roughness: 0.35
                })
            ]
        })
    });
}
