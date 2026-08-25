// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx } from "react/jsx-runtime";
import { CAMERA_DAMP, CAMERA_DAMP_REDUCED, MIN_CAMERA_HORIZ, MIN_CAMERA_Y, stageCamera } from "@/lib/twin/stage-camera";
import { damp } from "@/components/twin/stage/motion";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

export function CameraRig({ scene, exploded, spatial, reducedMotion }) {
    const cameraRef = useRef(null);
    const look = useRef(new Vector3(0.2, 0.25, 0.3));
    const scratch = useRef(new Vector3());
    useFrame((_, dt)=>{
            const camera = cameraRef.current;
            if (!camera || spatial) {
                return;
            }
            const pose = stageCamera(scene, exploded);
            const speed = reducedMotion ? CAMERA_DAMP_REDUCED : CAMERA_DAMP;
            camera.position.x = damp(camera.position.x, pose.position[0], dt, speed);
            camera.position.y = damp(camera.position.y, pose.position[1], dt, speed);
            camera.position.z = damp(camera.position.z, pose.position[2], dt, speed);
            camera.fov = damp(camera.fov, pose.fov, dt, speed);
            look.current.x = damp(look.current.x, pose.target[0], dt, speed);
            look.current.y = damp(look.current.y, pose.target[1], dt, speed);
            look.current.z = damp(look.current.z, pose.target[2], dt, speed);
            if (camera.position.y < MIN_CAMERA_Y) {
                camera.position.y = MIN_CAMERA_Y;
            }
            const horiz = Math.hypot(camera.position.x - look.current.x, camera.position.z - look.current.z);
            if (horiz < MIN_CAMERA_HORIZ) {
                camera.position.x = look.current.x + 0.9;
                camera.position.z = look.current.z + 0.9;
            }
            if (![
                camera.position.x,
                camera.position.y,
                camera.position.z,
                look.current.x,
                look.current.y,
                look.current.z
            ].every(Number.isFinite)) {
                camera.position.set(14.5, 7.6, 13.8);
                look.current.set(0.2, 0.25, 0.3);
            }
            camera.up.set(0, 1, 0);
            camera.lookAt(scratch.current.copy(look.current));
            camera.updateProjectionMatrix();
        });
    return /*#__PURE__*/jsx(PerspectiveCamera, {
        ref: cameraRef,
        makeDefault: true,
        position: [
            14.5,
            7.6,
            13.8
        ],
        fov: 44,
        near: 0.15,
        far: 120
    });
}
