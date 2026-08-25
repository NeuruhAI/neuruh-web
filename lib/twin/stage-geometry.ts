// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */

/** Synthetic Pender tract. 1 unit ≈ 90 ft. House is a farmhouse in a 12-acre field. */
export const PARCEL = [
    [
        -6.4,
        4.6
    ],
    [
        5.2,
        5.0
    ],
    [
        6.6,
        -1.1
    ],
    [
        3.4,
        -5.2
    ],
    [
        -4.6,
        -4.8
    ],
    [
        -7.0,
        0.4
    ]
];
export const HOUSE = {
    x: 0.45,
    z: -0.48,
    width: 1.22,
    depth: 0.88,
    wall: 0.36,
    roof: 0.26
};
export const PINES = [
    {
        x: -8.4,
        z: 5.2,
        s: 0.58
    },
    {
        x: -7.1,
        z: 6.4,
        s: 0.48
    },
    {
        x: -5.2,
        z: 6.8,
        s: 0.64
    },
    {
        x: -2.4,
        z: 7.1,
        s: 0.5
    },
    {
        x: 1.2,
        z: 7.0,
        s: 0.6
    },
    {
        x: 4.6,
        z: 6.3,
        s: 0.52
    },
    {
        x: 7.2,
        z: 4.4,
        s: 0.66
    },
    {
        x: 8.1,
        z: 1.6,
        s: 0.54
    },
    {
        x: 8.4,
        z: -1.8,
        s: 0.62
    },
    {
        x: 7.0,
        z: -4.6,
        s: 0.5
    },
    {
        x: 4.2,
        z: -6.6,
        s: 0.64
    },
    {
        x: 0.2,
        z: -7.2,
        s: 0.52
    },
    {
        x: -3.6,
        z: -6.8,
        s: 0.58
    },
    {
        x: -6.8,
        z: -5.2,
        s: 0.46
    },
    {
        x: -8.6,
        z: -2.2,
        s: 0.62
    },
    {
        x: -8.8,
        z: 1.4,
        s: 0.54
    }
];
export const OAKS = [
    {
        x: -4.8,
        z: 3.1,
        s: 0.42
    },
    {
        x: 5.1,
        z: -3.2,
        s: 0.5
    },
    {
        x: -6.4,
        z: -2.4,
        s: 0.38
    },
    {
        x: 3.8,
        z: 3.4,
        s: 0.44
    }
];
export const SOURCE_PADS = [
    {
        x: -2.2,
        z: 1.6
    },
    {
        x: -1.1,
        z: 2.05
    },
    {
        x: 0.2,
        z: 2.15
    },
    {
        x: 1.4,
        z: 1.55
    },
    {
        x: 2.1,
        z: 0.35
    },
    {
        x: -2.4,
        z: 0.4
    },
    {
        x: -1.4,
        z: -1.55
    }
];
export function insideParcel(x, z) {
    let inside = false;
    for(let i = 0, j = PARCEL.length - 1; i < PARCEL.length; j = i++){
        const xi = PARCEL[i][0];
        const zi = PARCEL[i][1];
        const xj = PARCEL[j][0];
        const zj = PARCEL[j][1];
        const intercept = zi > z !== zj > z && x < (xj - xi) * (z - zi) / (zj - zi + Number.EPSILON) + xi;
        if (intercept) {
            inside = !inside;
        }
    }
    return inside;
}
