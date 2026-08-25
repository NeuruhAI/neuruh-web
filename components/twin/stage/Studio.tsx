// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Sky } from "@react-three/drei";

const SUN = [
    14,
    16,
    9
];
export function Studio() {
    return /*#__PURE__*/jsxs(Fragment, {
        children: [
            /*#__PURE__*/jsx("color", {
                attach: "background",
                args: [
                    "#9eb6c8"
                ]
            }),
            /*#__PURE__*/jsx("fog", {
                attach: "fog",
                args: [
                    "#b7c6d4",
                    28,
                    78
                ]
            }),
            /*#__PURE__*/jsx(Sky, {
                sunPosition: SUN,
                turbidity: 6,
                rayleigh: 0.5,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.75
            }),
            /*#__PURE__*/jsx("hemisphereLight", {
                args: [
                    "#d5e4f2",
                    "#5d6b4c",
                    0.48
                ]
            }),
            /*#__PURE__*/jsx("directionalLight", {
                castShadow: true,
                position: SUN,
                intensity: 1.7,
                color: "#fff1d6",
                "shadow-mapSize-width": 512,
                "shadow-mapSize-height": 512,
                "shadow-bias": -0.0003,
                "shadow-normalBias": 0.05,
                "shadow-camera-near": 4,
                "shadow-camera-far": 42,
                "shadow-camera-left": -14,
                "shadow-camera-right": 14,
                "shadow-camera-top": 14,
                "shadow-camera-bottom": -14
            }),
            /*#__PURE__*/jsx("directionalLight", {
                position: [
                    -10,
                    6,
                    -6
                ],
                intensity: 0.28,
                color: "#8fa8c4"
            })
        ]
    });
}
