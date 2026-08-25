// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { damp, placeYCylinder } from "@/components/twin/stage/motion";
import { useTwin } from "@/components/twin/TwinProvider";
import { annotationById, authoredVisibleIds } from "@/lib/twin/annotations";
import { explodedLayerPose, layerSpeed } from "@/lib/twin/stage-visual";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export function Annotations() {
    const { state } = useTwin();
    const { size } = useThree();
    const exploded = state.exploded || state.scene === "receipt";
    const mobile = size.width < 720;
    if (mobile) {
        return null;
    }
    const ids = authoredVisibleIds(state.scene, exploded, state.inspect, state.mode);
    return /*#__PURE__*/jsx("group", {
        children: ids.map((id)=>{
            const spec = annotationById(id);
            const expanded = state.inspect?.kind === spec.inspect.kind && state.inspect?.id === spec.inspect.id;
            return /*#__PURE__*/jsx(AnnotationMark, {
                spec: spec,
                expanded: expanded,
                exploded: exploded
            }, id);
        })
    });
}
function AnnotationMark({ spec, expanded, exploded }) {
    const { dispatch } = useTwin();
    const group = useRef(null);
    const leader = useRef(null);
    useFrame(({ camera }, dt)=>{
            const node = group.current;
            if (!node) {
                return;
            }
            const pose = explodedLayerPose(spec.layerIndex, exploded);
            const ax = spec.anchor[0] + pose[0];
            const ay = spec.anchor[1] + pose[1];
            const az = spec.anchor[2] + pose[2];
            node.position.x = damp(node.position.x, ax, dt, layerSpeed("mass"));
            node.position.y = damp(node.position.y, ay, dt, layerSpeed("mass"));
            node.position.z = damp(node.position.z, az, dt, layerSpeed("mass"));
            const distance = camera.position.distanceTo(node.position);
            node.visible = distance >= 1.35 && distance <= 22;
            if (leader.current) {
                placeYCylinder(leader.current, [
                    0,
                    0.03,
                    0
                ], spec.labelOffset);
            }
        });
    return /*#__PURE__*/jsxs("group", {
        ref: group,
        position: [
            spec.anchor[0],
            spec.anchor[1],
            spec.anchor[2]
        ],
        children: [
            /*#__PURE__*/jsxs("mesh", {
                ref: leader,
                children: [
                    /*#__PURE__*/jsx("cylinderGeometry", {
                        args: [
                            0.006,
                            0.006,
                            1,
                            6
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#2c5d86",
                        metalness: 0.35,
                        roughness: 0.45,
                        transparent: true,
                        opacity: 0.5
                    })
                ]
            }),
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    0.02,
                    0
                ],
                children: [
                    /*#__PURE__*/jsx("sphereGeometry", {
                        args: [
                            0.02,
                            8,
                            8
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#2c5d86",
                        metalness: 0.4,
                        roughness: 0.4
                    })
                ]
            }),
            /*#__PURE__*/jsx(Html, {
                position: [
                    spec.labelOffset[0],
                    spec.labelOffset[1],
                    spec.labelOffset[2]
                ],
                center: true,
                zIndexRange: [
                    8,
                    0
                ],
                children: /*#__PURE__*/jsxs("button", {
                    type: "button",
                    className: "annot-chip",
                    onClick: ()=>dispatch({
                            type: "INSPECT",
                            target: spec.inspect
                        }),
                    children: [
                        /*#__PURE__*/jsx("span", {
                            className: "type-machine",
                            children: spec.whisper
                        }),
                        expanded ? /*#__PURE__*/jsx("span", {
                            className: "type-proof mt-0.5 block max-w-[11rem] normal-case tracking-normal",
                            children: spec.detail
                        }) : null
                    ]
                })
            })
        ]
    });
}
