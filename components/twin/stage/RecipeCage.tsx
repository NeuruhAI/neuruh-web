// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useTwin } from "@/components/twin/TwinProvider";
import { QUERY_SPEC } from "@/lib/twin/query";
import { HOUSE } from "@/lib/twin/stage-geometry";

export function RecipeCage({ scene }) {
    const { enabled, state } = useTwin();
    const exploded = state.exploded || scene === "receipt";
    if (scene !== "recipe" && !exploded) {
        return null;
    }
    const { x, z, width, depth, wall, roof } = HOUSE;
    return /*#__PURE__*/jsxs("group", {
        position: [
            x,
            wall / 2 + 0.05,
            z
        ],
        children: [
            /*#__PURE__*/jsxs("mesh", {
                children: [
                    /*#__PURE__*/jsx("boxGeometry", {
                        args: [
                            width + 0.18,
                            wall + roof + 0.12,
                            depth + 0.18
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#2c5d86",
                        wireframe: true,
                        transparent: true,
                        opacity: 0.35
                    })
                ]
            }),
            QUERY_SPEC.clauses.map((clause, index)=>{
                const on = enabled.has(clause.id);
                const angle = index / QUERY_SPEC.clauses.length * Math.PI * 2;
                return /*#__PURE__*/jsxs("mesh", {
                    position: [
                        Math.cos(angle) * (width * 0.7),
                        0.04 + index * 0.02,
                        Math.sin(angle) * (depth * 0.7)
                    ],
                    children: [
                        /*#__PURE__*/jsx("boxGeometry", {
                            args: [
                                0.04,
                                0.016,
                                0.04
                            ]
                        }),
                        /*#__PURE__*/jsx("meshStandardMaterial", {
                            color: on ? "#2c5d86" : "#b8c0c8",
                            emissive: on ? "#2c5d86" : "#000000",
                            emissiveIntensity: on ? 0.2 : 0
                        })
                    ]
                }, clause.id);
            })
        ]
    });
}
