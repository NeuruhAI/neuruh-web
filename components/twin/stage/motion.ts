// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { Vector3 } from "three";

export function damp(current, target, dt, speed) {
    return current + (target - current) * (1 - Math.exp(-speed * dt));
}
export function placeYCylinder(mesh, a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    const len = Math.hypot(dx, dy, dz) || 0.0001;
    mesh.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), new Vector3(dx / len, dy / len, dz / len));
    mesh.scale.set(1, len, 1);
}
export function pickCursor(onClick) {
    return {
        onClick: (event)=>{
            event.stopPropagation();
            onClick();
        },
        onPointerOver: (event)=>{
            event.stopPropagation();
            document.body.style.cursor = "pointer";
        },
        onPointerOut: ()=>{
            document.body.style.cursor = "auto";
        }
    };
}
