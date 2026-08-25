// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { assertNever } from "@/lib/status";

export const CAMERA_DAMP = 1.55;
export const CAMERA_DAMP_REDUCED = 22;
export const MIN_CAMERA_Y = 1.35;
export const MIN_CAMERA_HORIZ = 0.55;
export function cameraHorizontalSpan(pose) {
    return Math.hypot(pose.position[0] - pose.target[0], pose.position[2] - pose.target[2]);
}
export function cameraPoseIsStable(pose) {
    const finite = [
        ...pose.position,
        ...pose.target
    ].every(Number.isFinite);
    return finite && pose.position[1] >= MIN_CAMERA_Y && cameraHorizontalSpan(pose) >= MIN_CAMERA_HORIZ;
}
export function stageCamera(scene, exploded) {
    if (exploded) {
        return {
            position: [
                12.4,
                6.8,
                9.2
            ],
            target: [
                0.6,
                3.1,
                -0.4
            ],
            fov: 40
        };
    }
    switch(scene){
        case "world":
            return {
                position: [
                    14.5,
                    7.6,
                    13.8
                ],
                target: [
                    0.2,
                    0.25,
                    0.3
                ],
                fov: 44
            };
        case "observe":
            return {
                position: [
                    9.2,
                    3.8,
                    10.4
                ],
                target: [
                    -0.3,
                    0.2,
                    1.5
                ],
                fov: 38
            };
        case "custody":
            return {
                position: [
                    6.4,
                    2.45,
                    7.2
                ],
                target: [
                    -1,
                    0.16,
                    1.35
                ],
                fov: 34
            };
        case "identity":
            return {
                position: [
                    5.8,
                    2.7,
                    6.4
                ],
                target: [
                    0.45,
                    0.38,
                    -0.4
                ],
                fov: 34
            };
        case "fact":
            return {
                position: [
                    8.6,
                    7.1,
                    7.8
                ],
                target: [
                    0.25,
                    0.12,
                    0.1
                ],
                fov: 42
            };
        case "signal":
            return {
                position: [
                    4.7,
                    2.2,
                    5.1
                ],
                target: [
                    0.45,
                    0.42,
                    -0.35
                ],
                fov: 34
            };
        case "recipe":
            return {
                position: [
                    7.4,
                    4.1,
                    4.2
                ],
                target: [
                    0.45,
                    0.52,
                    -0.45
                ],
                fov: 34
            };
        case "decision":
            return {
                position: [
                    8.9,
                    3.15,
                    2.5
                ],
                target: [
                    0.4,
                    0.4,
                    -0.3
                ],
                fov: 40
            };
        case "authority":
            return {
                position: [
                    0.5,
                    1.9,
                    4.35
                ],
                target: [
                    0.45,
                    0.4,
                    -0.5
                ],
                fov: 32
            };
        case "action":
            return {
                position: [
                    5.3,
                    2.45,
                    5.5
                ],
                target: [
                    0.55,
                    0.36,
                    -0.25
                ],
                fov: 34
            };
        case "receipt":
            return {
                position: [
                    12.4,
                    6.8,
                    9.2
                ],
                target: [
                    0.6,
                    3.1,
                    -0.4
                ],
                fov: 40
            };
        case "outcome":
            return {
                position: [
                    11.2,
                    5.1,
                    10.2
                ],
                target: [
                    0.35,
                    0.32,
                    -0.25
                ],
                fov: 42
            };
        case "calibration":
            return {
                position: [
                    14.2,
                    7.3,
                    13.5
                ],
                target: [
                    0.15,
                    0.22,
                    0.25
                ],
                fov: 45
            };
        default:
            return assertNever(scene);
    }
}
