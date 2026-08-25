// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { damp } from "@/components/twin/stage/motion";
import { stageTextures } from "@/components/twin/stage/textures";
import { useTwin } from "@/components/twin/TwinProvider";
import { HOUSE } from "@/lib/twin/stage-geometry";
import { layerSpeed } from "@/lib/twin/stage-visual";
import { hasReached } from "@/lib/twin/stages";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function Layer({ visible, explodeY, exploded, speed, children }) {
    const ref = useRef(null);
    useFrame((_, dt)=>{
            const group = ref.current;
            if (!group) {
                return;
            }
            const targetY = exploded ? explodeY : 0;
            const targetScale = visible ? 1 : 0.001;
            group.position.y = damp(group.position.y, targetY, dt, speed);
            const next = damp(group.scale.x, targetScale, dt, speed);
            group.scale.setScalar(Math.max(0.001, next));
            group.visible = group.scale.x > 0.02;
        });
    return /*#__PURE__*/jsx("group", {
        ref: ref,
        scale: visible ? 1 : 0.001,
        children: children
    });
}
function Window({ position, rotationY = 0, lit }) {
    return /*#__PURE__*/jsxs("group", {
        position: position,
        rotation: [
            0,
            rotationY,
            0
        ],
        children: [
            /*#__PURE__*/jsxs("mesh", {
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("boxGeometry", {
                        args: [
                            0.16,
                            0.18,
                            0.022
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#3a322c",
                        roughness: 0.7
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    0,
                    0.012
                ],
                children: [
                    /*#__PURE__*/jsx("planeGeometry", {
                        args: [
                            0.12,
                            0.14
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#9ec0d0",
                        roughness: 0.12,
                        metalness: 0.18,
                        emissive: lit ? "#f3e0b0" : "#000000",
                        emissiveIntensity: lit ? 0.12 : 0
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    0,
                    0.012
                ],
                children: [
                    /*#__PURE__*/jsx("boxGeometry", {
                        args: [
                            0.006,
                            0.078,
                            0.004
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#d9d0c2"
                    })
                ]
            })
        ]
    });
}
export function House({ scene }) {
    const { matched, delinquentYears, state } = useTwin();
    const textures = useMemo(()=>stageTextures(), []);
    const exploded = state.exploded || scene === "receipt";
    const stain = matched && delinquentYears >= 2;
    const { x, z, width, depth, wall, roof } = HOUSE;
    const risen = hasReached(scene, "signal");
    const blocked = hasReached(scene, "signal");
    const foundation = 0.05;
    const wallY = foundation + wall / 2;
    const roofY = foundation + wall;
    return /*#__PURE__*/jsxs("group", {
        position: [
            x,
            0,
            z
        ],
        children: [
            /*#__PURE__*/jsx(Layer, {
                visible: risen,
                explodeY: 0.08,
                exploded: exploded,
                speed: layerSpeed("mass"),
                children: /*#__PURE__*/jsxs("mesh", {
                    position: [
                        0,
                        foundation / 2,
                        0
                    ],
                    castShadow: true,
                    receiveShadow: true,
                    children: [
                        /*#__PURE__*/jsx("boxGeometry", {
                            args: [
                                width + 0.04,
                                foundation,
                                depth + 0.04
                            ]
                        }),
                        /*#__PURE__*/jsx("meshStandardMaterial", {
                            map: textures.stone,
                            roughness: 0.9
                        })
                    ]
                })
            }),
            /*#__PURE__*/jsxs(Layer, {
                visible: risen,
                explodeY: 0.2,
                exploded: exploded,
                speed: layerSpeed("mass"),
                children: [
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            0,
                            wallY,
                            0
                        ],
                        castShadow: true,
                        receiveShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    width,
                                    wall,
                                    depth
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                map: textures.clapboard,
                                bumpMap: textures.clapboardBump,
                                bumpScale: 0.14,
                                roughness: 0.78
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            width / 2 + 0.006,
                            wallY,
                            0
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.014,
                                    wall + 0.01,
                                    depth + 0.012
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#d8cbb8",
                                roughness: 0.75
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            -width / 2 - 0.006,
                            wallY,
                            0
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.014,
                                    wall + 0.01,
                                    depth + 0.012
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#d8cbb8",
                                roughness: 0.75
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            0,
                            foundation + 0.02,
                            depth / 2 + 0.09
                        ],
                        receiveShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    width * 0.62,
                                    0.025,
                                    0.2
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#b7aa96",
                                roughness: 0.84
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            -width * 0.2,
                            foundation + 0.09,
                            depth / 2 + 0.14
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.02,
                                    0.16,
                                    0.02
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#6a5a48",
                                roughness: 0.8
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            width * 0.2,
                            foundation + 0.09,
                            depth / 2 + 0.14
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.02,
                                    0.16,
                                    0.02
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#6a5a48",
                                roughness: 0.8
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            0,
                            foundation + 0.175,
                            depth / 2 + 0.14
                        ],
                        rotation: [
                            0.18,
                            0,
                            0
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    width * 0.66,
                                    0.018,
                                    0.22
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                map: textures.roof,
                                roughness: 0.82
                            })
                        ]
                    }),
                    /*#__PURE__*/jsx(Window, {
                        position: [
                            -width * 0.28,
                            wallY + 0.02,
                            depth / 2 + 0.01
                        ],
                        lit: risen
                    }),
                    /*#__PURE__*/jsx(Window, {
                        position: [
                            width * 0.28,
                            wallY + 0.02,
                            depth / 2 + 0.01
                        ],
                        lit: risen
                    }),
                    /*#__PURE__*/jsx(Window, {
                        position: [
                            width / 2 + 0.01,
                            wallY + 0.02,
                            0.08
                        ],
                        rotationY: Math.PI / 2,
                        lit: risen
                    }),
                    stain ? /*#__PURE__*/jsxs("mesh", {
                        position: [
                            -width * 0.28,
                            wallY - 0.04,
                            depth / 2 + 0.012
                        ],
                        children: [
                            /*#__PURE__*/jsx("planeGeometry", {
                                args: [
                                    0.22,
                                    0.18
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#8a5a38",
                                transparent: true,
                                opacity: 0.55
                            })
                        ]
                    }) : null,
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            0,
                            foundation + 0.11,
                            depth / 2 + 0.012
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.14,
                                    0.22,
                                    0.03
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#2a2420",
                                roughness: 0.72
                            })
                        ]
                    }),
                    blocked ? /*#__PURE__*/jsxs("mesh", {
                        position: [
                            0,
                            foundation + 0.14,
                            depth / 2 + 0.03
                        ],
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.16,
                                    0.022,
                                    0.016
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#b42318",
                                metalness: 0.25,
                                roughness: 0.4
                            })
                        ]
                    }) : null,
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            width / 2 + 0.03,
                            foundation + 0.12,
                            -0.08
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("cylinderGeometry", {
                                args: [
                                    0.012,
                                    0.014,
                                    0.24,
                                    8
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#3a3a3a",
                                metalness: 0.45,
                                roughness: 0.4
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            width / 2 + 0.03,
                            foundation + 0.25,
                            -0.08
                        ],
                        children: [
                            /*#__PURE__*/jsx("sphereGeometry", {
                                args: [
                                    0.028,
                                    12,
                                    12
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#14181c",
                                roughness: 0.32
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            width * 0.22,
                            roofY + 0.08,
                            -depth / 2 + 0.05
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.07,
                                    0.16,
                                    0.07
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                map: textures.stone,
                                roughness: 0.82
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/jsxs(Layer, {
                visible: risen,
                explodeY: 0.34,
                exploded: exploded,
                speed: layerSpeed("mass"),
                children: [
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            -width * 0.18,
                            roofY + roof * 0.38,
                            0
                        ],
                        rotation: [
                            0,
                            0,
                            0.5
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    width * 0.72,
                                    0.028,
                                    depth + 0.08
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                map: textures.roof,
                                roughness: 0.84
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            width * 0.18,
                            roofY + roof * 0.38,
                            0
                        ],
                        rotation: [
                            0,
                            0,
                            -0.5
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    width * 0.72,
                                    0.028,
                                    depth + 0.08
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                map: textures.roof,
                                roughness: 0.84
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            0,
                            roofY + roof * 0.7,
                            0
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.02,
                                    0.02,
                                    depth + 0.1
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#c4b8ac",
                                roughness: 0.55
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
