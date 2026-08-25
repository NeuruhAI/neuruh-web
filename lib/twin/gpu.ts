// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */

/** Probe the GPU without keeping a second live context. */
export function gpuIsSoftware() {
    if (typeof document === "undefined") {
        return false;
    }
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl", {
            failIfMajorPerformanceCaveat: false
        });
        if (!gl) {
            return true;
        }
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? "") : "";
        const vendor = info ? String(gl.getParameter(info.UNMASKED_VENDOR_WEBGL) ?? "") : "";
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /swiftshader|llvmpipe|softpipe|microsoft basic render/i.test(`${renderer} ${vendor}`);
    } catch  {
        return false;
    }
}
