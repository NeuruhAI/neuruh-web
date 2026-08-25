// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { stageTextures } from "@/components/twin/stage/textures";
import { HOUSE, OAKS, PARCEL, PINES, insideParcel } from "@/lib/twin/stage-geometry";
import { hasReached } from "@/lib/twin/stages";
import { useMemo } from "react";
import { PlaneGeometry } from "three";

function groundGeometry() {
    const geometry = new PlaneGeometry(72, 60, 40, 32);
    geometry.rotateX(-Math.PI / 2);
    const pos = geometry.attributes.position;
    for(let i = 0; i < pos.count; i += 1){
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const swell = 0.42 * Math.sin(x * 0.11) * Math.cos(z * 0.09) + 0.16 * Math.sin(x * 0.37 + z * 0.22) + 0.05 * Math.sin(x * 1.4) * Math.sin(z * 1.15);
        const parcel = insideParcel(x, z);
        pos.setY(i, parcel ? 0.02 + swell * 0.12 : swell);
    }
    geometry.computeVertexNormals();
    return geometry;
}
function Pine({ x, z, s, i }) {
    const textures = stageTextures();
    const foliage = i % 3 === 0 ? "#2f4a32" : i % 3 === 1 ? "#3d5c3c" : "#29422d";
    const crown = i % 3 === 0 ? "#4a6746" : i % 3 === 1 ? "#355838" : "#3f5e3c";
    return /*#__PURE__*/jsxs("group", {
        position: [
            x,
            0,
            z
        ],
        rotation: [
            0,
            i * 0.73,
            (i % 5 - 2) * 0.025
        ],
        scale: s,
        children: [
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    0.42,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("cylinderGeometry", {
                        args: [
                            0.04,
                            0.07,
                            0.84,
                            6
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        map: textures.bark,
                        roughness: 0.92
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0.04,
                    0.92,
                    -0.03
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("coneGeometry", {
                        args: [
                            0.42,
                            0.72,
                            7
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: foliage,
                        roughness: 0.88
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    -0.03,
                    1.32,
                    0.04
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("coneGeometry", {
                        args: [
                            0.28,
                            0.62,
                            7
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: crown,
                        roughness: 0.86
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0.02,
                    1.62,
                    -0.02
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("coneGeometry", {
                        args: [
                            0.16,
                            0.42,
                            6
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: foliage,
                        roughness: 0.85
                    })
                ]
            })
        ]
    });
}
function Oak({ x, z, s }) {
    const textures = stageTextures();
    return /*#__PURE__*/jsxs("group", {
        position: [
            x,
            0,
            z
        ],
        scale: s,
        children: [
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    0.42,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("cylinderGeometry", {
                        args: [
                            0.05,
                            0.08,
                            0.84,
                            7
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        map: textures.bark,
                        roughness: 0.92
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    1.05,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("sphereGeometry", {
                        args: [
                            0.48,
                            10,
                            8
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#3a5536",
                        roughness: 0.9
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0.22,
                    1.18,
                    0.12
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("sphereGeometry", {
                        args: [
                            0.32,
                            8,
                            7
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#4a6744",
                        roughness: 0.88
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    -0.18,
                    1.22,
                    -0.1
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("sphereGeometry", {
                        args: [
                            0.28,
                            8,
                            7
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#314a30",
                        roughness: 0.9
                    })
                ]
            })
        ]
    });
}
function ParcelEdge({ a, b, identified }) {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const len = Math.hypot(dx, dz);
    const mid = [
        (a[0] + b[0]) / 2,
        0.045,
        (a[1] + b[1]) / 2
    ];
    const rot = Math.atan2(dx, dz);
    return /*#__PURE__*/jsxs("mesh", {
        position: mid,
        rotation: [
            0,
            rot,
            0
        ],
        castShadow: true,
        children: [
            /*#__PURE__*/jsx("boxGeometry", {
                args: [
                    identified ? 0.028 : 0.018,
                    0.03,
                    len
                ]
            }),
            /*#__PURE__*/jsx("meshStandardMaterial", {
                color: identified ? "#6a6258" : "#8a8478",
                metalness: 0,
                roughness: 0.86,
                transparent: true,
                opacity: identified ? 0.88 : 0.42
            })
        ]
    });
}
function Fence() {
    const start = PARCEL[3];
    const end = PARCEL[4];
    const posts = 9;
    return /*#__PURE__*/jsx("group", {
        children: Array.from({
            length: posts
        }, (_, index)=>{
            const t = index / (posts - 1);
            const x = start[0] + (end[0] - start[0]) * t;
            const z = start[1] + (end[1] - start[1]) * t;
            return /*#__PURE__*/jsxs("group", {
                position: [
                    x,
                    0,
                    z
                ],
                children: [
                    /*#__PURE__*/jsxs("mesh", {
                        position: [
                            0,
                            0.12,
                            0
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.018,
                                    0.24,
                                    0.018
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#6a5a48",
                                roughness: 0.86
                            })
                        ]
                    }),
                    index < posts - 1 ? /*#__PURE__*/jsxs("mesh", {
                        position: [
                            (end[0] - start[0]) / (2 * (posts - 1)),
                            0.16,
                            (end[1] - start[1]) / (2 * (posts - 1))
                        ],
                        rotation: [
                            0,
                            Math.atan2(end[0] - start[0], end[1] - start[1]),
                            0
                        ],
                        children: [
                            /*#__PURE__*/jsx("boxGeometry", {
                                args: [
                                    0.012,
                                    0.012,
                                    Math.hypot(end[0] - start[0], end[1] - start[1]) / (posts - 1)
                                ]
                            }),
                            /*#__PURE__*/jsx("meshStandardMaterial", {
                                color: "#7a6a56",
                                roughness: 0.8
                            })
                        ]
                    }) : null
                ]
            }, index);
        })
    });
}
export function Terrain({ scene }) {
    const textures = useMemo(()=>stageTextures(), []);
    const ground = useMemo(()=>groundGeometry(), []);
    const world = hasReached(scene, "world");
    const identified = hasReached(scene, "identity");
    return /*#__PURE__*/jsxs("group", {
        visible: world,
        children: [
            /*#__PURE__*/jsx("mesh", {
                geometry: ground,
                receiveShadow: true,
                children: /*#__PURE__*/jsx("meshStandardMaterial", {
                    map: textures.grass,
                    bumpMap: textures.grassBump,
                    bumpScale: 0.28,
                    roughness: 0.92,
                    color: "#8f9d74"
                })
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    0.04,
                    6.55
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0.04
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/jsx("planeGeometry", {
                        args: [
                            28,
                            0.72
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        map: textures.asphalt,
                        roughness: 0.86,
                        color: "#4a4e52"
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0.12,
                    0.055,
                    2.15
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0.18
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/jsx("planeGeometry", {
                        args: [
                            1.05,
                            5.4
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        map: textures.dirt,
                        roughness: 1,
                        color: "#b79a78"
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    HOUSE.x,
                    0.05,
                    HOUSE.z + 0.55
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/jsx("circleGeometry", {
                        args: [
                            0.42,
                            16
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        map: textures.dirt,
                        roughness: 1,
                        color: "#c4a888"
                    })
                ]
            }),
            PARCEL.map((point, index)=>/*#__PURE__*/jsx(ParcelEdge, {
                    a: point,
                    b: PARCEL[(index + 1) % PARCEL.length],
                    identified: identified
                }, index)),
            /*#__PURE__*/jsx(Fence, {}),
            PINES.map((pine, index)=>/*#__PURE__*/jsx(Pine, {
                    ...pine,
                    i: index
                }, `${pine.x}-${pine.z}`)),
            OAKS.map((oak)=>/*#__PURE__*/jsx(Oak, {
                    ...oak
                }, `${oak.x}-${oak.z}`)),
            PARCEL.map(([x, z], index)=>/*#__PURE__*/jsxs("group", {
                    position: [
                        x,
                        0,
                        z
                    ],
                    children: [
                        /*#__PURE__*/jsxs("mesh", {
                            position: [
                                0,
                                0.09,
                                0
                            ],
                            castShadow: true,
                            children: [
                                /*#__PURE__*/jsx("cylinderGeometry", {
                                    args: [
                                        0.02,
                                        0.022,
                                        0.18,
                                        8
                                    ]
                                }),
                                /*#__PURE__*/jsx("meshStandardMaterial", {
                                    color: "#c5ccd2",
                                    metalness: 0.5,
                                    roughness: 0.32
                                })
                            ]
                        }),
                        /*#__PURE__*/jsxs("mesh", {
                            position: [
                                0.045,
                                0.16,
                                0
                            ],
                            rotation: [
                                0,
                                0,
                                0.35
                            ],
                            castShadow: true,
                            children: [
                                /*#__PURE__*/jsx("planeGeometry", {
                                    args: [
                                        0.08,
                                        0.1
                                    ]
                                }),
                                /*#__PURE__*/jsx("meshStandardMaterial", {
                                    color: "#c45a38",
                                    roughness: 0.55
                                })
                            ]
                        })
                    ]
                }, `pin-${index}`))
        ]
    });
}
