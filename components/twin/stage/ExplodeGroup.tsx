// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx } from "react/jsx-runtime";
import { damp } from "@/components/twin/stage/motion";
import { explodedLayerPose, layerSpeed } from "@/lib/twin/stage-visual";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function ExplodeGroup({ index, exploded, children }) {
    const ref = useRef(null);
    useFrame((_, dt)=>{
            const group = ref.current;
            if (!group) {
                return;
            }
            const pose = explodedLayerPose(index, exploded);
            group.position.x = damp(group.position.x, pose[0], dt, layerSpeed("mass"));
            group.position.y = damp(group.position.y, pose[1], dt, layerSpeed("mass"));
            group.position.z = damp(group.position.z, pose[2], dt, layerSpeed("mass"));
        });
    return /*#__PURE__*/jsx("group", {
        ref: ref,
        children: children
    });
}
