// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { Html } from "@react-three/drei";
import { useState } from "react";

export function LayerTab({ label, exploded, onInspect }) {
    const [hovered, setHovered] = useState(false);
    if (!exploded) {
        return null;
    }
    return /*#__PURE__*/jsxs("group", {
        position: [
            0.42,
            0.08,
            0.12
        ],
        onClick: (event)=>{
            event.stopPropagation();
            onInspect();
        },
        onPointerOver: (event)=>{
            event.stopPropagation();
            document.body.style.cursor = "pointer";
            setHovered(true);
        },
        onPointerOut: ()=>{
            document.body.style.cursor = "auto";
            setHovered(false);
        },
        children: [
            /*#__PURE__*/jsxs("mesh", {
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("boxGeometry", {
                        args: [
                            0.2,
                            0.016,
                            0.1
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#8a97a3",
                        metalness: 0.64,
                        roughness: 0.26
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    0.012,
                    0
                ],
                children: [
                    /*#__PURE__*/jsx("boxGeometry", {
                        args: [
                            0.15,
                            0.006,
                            0.06
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#d5dde4",
                        metalness: 0.18,
                        roughness: 0.48
                    })
                ]
            }),
            hovered ? /*#__PURE__*/jsx(Html, {
                position: [
                    0.28,
                    0.12,
                    0
                ],
                center: true,
                style: {
                    pointerEvents: "none"
                },
                children: /*#__PURE__*/jsx("span", {
                    className: "type-machine twin-whisper text-bone/80",
                    children: label
                })
            }) : null
        ]
    });
}
