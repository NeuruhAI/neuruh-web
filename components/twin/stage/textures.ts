// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

function noise(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
}
function fbm(x, y) {
    return noise(x, y) * 0.5 + noise(x * 2.13, y * 2.07) * 0.3 + noise(x * 5.1, y * 4.9) * 0.2;
}
function fill(ctx, size, shade) {
    const data = ctx.createImageData(size, size);
    for(let y = 0; y < size; y += 1){
        for(let x = 0; x < size; x += 1){
            const n = fbm(x * 0.035, y * 0.035);
            const [r, g, b] = shade(x, y, n);
            const i = (y * size + x) * 4;
            data.data[i] = r;
            data.data[i + 1] = g;
            data.data[i + 2] = b;
            data.data[i + 3] = 255;
        }
    }
    ctx.putImageData(data, 0, 0);
}
function canvasTexture(size, paint) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("No 2d context");
    }
    paint(ctx);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.anisotropy = 8;
    return texture;
}
let cache = null;
export function stageTextures() {
    if (cache) {
        return cache;
    }
    cache = {
        grass: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (x, y, n)=>{
                const patch = noise(x * 0.02, y * 0.018);
                if (patch < 0.11) {
                    return [
                        118 + n * 28,
                        96 + n * 16,
                        62 + n * 10
                    ];
                }
                const blade = noise(x * 0.4, y * 0.9);
                return [
                    46 + n * 22 + blade * 10,
                    78 + n * 38 + blade * 14,
                    38 + n * 16
                ];
            });
        }),
        grassBump: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (_x, _y, n)=>{
                const g = 120 + n * 80;
                return [
                    g,
                    g,
                    g
                ];
            });
        }),
        soil: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (_x, _y, n)=>[
                    118 + n * 24,
                    92 + n * 16,
                    62 + n * 10
                ]);
        }),
        clapboard: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (x, y, n)=>{
                const board = Math.floor(y / 18);
                const groove = y % 18 < 2 ? 28 : 0;
                const stain = noise(board * 3.1, 0.2) * 14;
                return [
                    196 - groove - n * 16 - stain,
                    178 - groove - n * 14 - stain,
                    148 - groove - n * 10 - stain
                ];
            });
        }),
        clapboardBump: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (_x, y)=>{
                const g = y % 14 < 2 ? 40 : 180;
                return [
                    g,
                    g,
                    g
                ];
            });
        }),
        roof: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (x, y, n)=>{
                const row = Math.floor(y / 10);
                const offset = row % 2 === 0 ? 0 : 8;
                const col = Math.floor((x + offset) / 16);
                const gap = (x + offset) % 16 < 1 || y % 10 < 1 ? 22 : 0;
                const tile = noise(col, row) * 18;
                return [
                    92 + n * 12 - gap + tile,
                    78 + n * 10 - gap + tile * 0.6,
                    70 + n * 8 - gap
                ];
            });
        }),
        dirt: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (x, y, n)=>{
                const rut = Math.abs(Math.sin(x * 0.08)) < 0.15 ? 18 : 0;
                return [
                    124 + n * 22 - rut,
                    98 + n * 16 - rut,
                    68 + n * 12 - rut
                ];
            });
        }),
        bark: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (x, y, n)=>{
                const streak = noise(x * 0.9, y * 0.12) * 30;
                return [
                    78 + n * 16 + streak,
                    52 + n * 12,
                    36 + n * 8
                ];
            });
        }),
        stone: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (x, y, n)=>{
                const block = (Math.floor(x / 28) + Math.floor(y / 16)) % 2;
                return [
                    128 + n * 22 + block * 8,
                    118 + n * 16 + block * 6,
                    104 + n * 12
                ];
            });
        }),
        asphalt: canvasTexture(256, (ctx)=>{
            fill(ctx, 256, (_x, _y, n)=>{
                const g = 48 + n * 22;
                return [
                    g,
                    g,
                    g + 4
                ];
            });
        })
    };
    cache.grass.repeat.set(28, 24);
    cache.grassBump.repeat.set(28, 24);
    cache.soil.repeat.set(6, 6);
    cache.clapboard.repeat.set(2, 3);
    cache.clapboardBump.repeat.set(2, 3);
    cache.roof.repeat.set(3, 3);
    cache.dirt.repeat.set(8, 2);
    cache.bark.repeat.set(1, 3);
    cache.stone.repeat.set(2, 1);
    cache.asphalt.repeat.set(12, 1);
    return cache;
}
