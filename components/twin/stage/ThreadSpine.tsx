// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { damp, placeYCylinder } from "@/components/twin/stage/motion";
import { RECEIPT_STACK, explodedLayerPose, layerSpeed } from "@/lib/twin/stage-visual";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function ThreadSpine({ exploded }) {
    const points = useRef(RECEIPT_STACK.map(()=>[
                0,
                0.05,
                0
            ]));
    const joints = useRef([]);
    const bones = useRef([]);
    useFrame((_, dt)=>{
            RECEIPT_STACK.forEach((_, index)=>{
                    const target = explodedLayerPose(index, exploded);
                    const point = points.current[index];
                    point[0] = damp(point[0], target[0], dt, layerSpeed("mass"));
                    point[1] = damp(point[1], exploded ? target[1] + 0.05 : 0.05, dt, layerSpeed("mass"));
                    point[2] = damp(point[2], target[2], dt, layerSpeed("mass"));
                    joints.current[index]?.position.set(point[0], point[1], point[2]);
                    const joint = joints.current[index];
                    if (joint) {
                        joint.visible = exploded;
                    }
                });
            for(let index = 0; index < RECEIPT_STACK.length - 1; index += 1){
                const bone = bones.current[index];
                if (!bone) {
                    continue;
                }
                bone.visible = exploded;
                placeYCylinder(bone, points.current[index], points.current[index + 1]);
            }
        });
    return /*#__PURE__*/jsxs("group", {
        children: [
            /*#__PURE__*/jsxs("mesh", {
                position: [
                    0,
                    0.05,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/jsx("cylinderGeometry", {
                        args: [
                            0.012,
                            0.014,
                            0.1,
                            8
                        ]
                    }),
                    /*#__PURE__*/jsx("meshStandardMaterial", {
                        color: "#2c5d86",
                        metalness: 0.48,
                        roughness: 0.32
                    })
                ]
            }),
            RECEIPT_STACK.map((layer, index)=>/*#__PURE__*/jsxs("mesh", {
                    ref: (node)=>{
                        joints.current[index] = node;
                    },
                    visible: false,
                    children: [
                        /*#__PURE__*/jsx("sphereGeometry", {
                            args: [
                                0.028,
                                10,
                                10
                            ]
                        }),
                        /*#__PURE__*/jsx("meshStandardMaterial", {
                            color: "#2c5d86",
                            metalness: 0.55,
                            roughness: 0.3
                        })
                    ]
                }, layer.id)),
            RECEIPT_STACK.slice(0, -1).map((layer, index)=>/*#__PURE__*/jsxs("mesh", {
                    ref: (node)=>{
                        bones.current[index] = node;
                    },
                    visible: false,
                    children: [
                        /*#__PURE__*/jsx("cylinderGeometry", {
                            args: [
                                0.01,
                                0.01,
                                1,
                                8
                            ]
                        }),
                        /*#__PURE__*/jsx("meshStandardMaterial", {
                            color: "#2c5d86",
                            metalness: 0.5,
                            roughness: 0.34
                        })
                    ]
                }, `${layer.id}-bone`))
        ]
    });
}
