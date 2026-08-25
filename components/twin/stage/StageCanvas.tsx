// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { HarborScene } from "@/components/twin/stage/HarborScene";
import { useTwin } from "@/components/twin/TwinProvider";
import { gpuIsSoftware } from "@/lib/twin/gpu";
import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useCallback, useMemo, useState } from "react";
import { ACESFilmicToneMapping, PCFShadowMap } from "three";

class StageFault extends Component {
    state = {
        message: null
    };
    static getDerivedStateFromError(error) {
        return {
            message: error.message
        };
    }
    render() {
        if (this.state.message) {
            return /*#__PURE__*/jsx("div", {
                className: "flex h-full min-h-[200px] items-center justify-center bg-[#9eb6c8] p-6 text-center",
                children: /*#__PURE__*/jsxs("p", {
                    className: "max-w-md font-mono text-sm text-bone",
                    children: [
                        "The tract failed to draw. ",
                        this.state.message
                    ]
                })
            });
        }
        return this.props.children;
    }
}
export function StageCanvas() {
    const { dispatch } = useTwin();
    const software = useMemo(()=>gpuIsSoftware(), []);
    const [epoch, setEpoch] = useState(0);
    const [fault, setFault] = useState(null);
    const [ready, setReady] = useState(false);
    const onCreated = useCallback(({ gl })=>{
            gl.setClearColor("#9eb6c8", 1);
            gl.toneMappingExposure = 1.05;
            gl.shadowMap.enabled = !software;
            gl.shadowMap.type = PCFShadowMap;
            gl.debug.checkShaderErrors = true;
            gl.debug.onShaderError = ()=>{
                    setFault("A material shader failed to compile.");
                };
            const onLost = (event)=>{
                    event.preventDefault();
                    setFault("The GPU stopped drawing the tract.");
                };
            gl.domElement.addEventListener("webglcontextlost", onLost);
            requestAnimationFrame(()=>setReady(true));
        }, [
        software
    ]);
    if (fault) {
        return /*#__PURE__*/jsxs("div", {
            className: "flex h-full min-h-[200px] flex-col items-center justify-center gap-3 bg-[#9eb6c8] p-6 text-center",
            "data-tract-ready": "false",
            "data-tract-gpu": "lost",
            children: [
                /*#__PURE__*/jsx("p", {
                    className: "max-w-md font-mono text-sm text-bone",
                    children: fault
                }),
                /*#__PURE__*/jsx("button", {
                    type: "button",
                    className: "min-h-11 border border-bone/20 bg-paper px-3 font-mono text-[11px] tracking-[0.14em] uppercase",
                    onClick: ()=>{
                        setFault(null);
                        setReady(false);
                        setEpoch((value)=>value + 1);
                    },
                    children: "Redraw the tract"
                })
            ]
        });
    }
    return /*#__PURE__*/jsx("div", {
        className: "h-full min-h-0 w-full",
        "data-tract-ready": ready ? "true" : "false",
        "data-tract-gpu": software ? "software" : "ok",
        children: /*#__PURE__*/jsx(StageFault, {
            children: /*#__PURE__*/jsx(Canvas, {
                shadows: software ? false : {
                    enabled: true,
                    type: PCFShadowMap
                },
                dpr: software ? 1 : [
                    1,
                    1.2
                ],
                camera: {
                    position: [
                        14.5,
                        7.6,
                        13.8
                    ],
                    fov: 44,
                    near: 0.15,
                    far: 120
                },
                gl: {
                    antialias: !software,
                    toneMapping: ACESFilmicToneMapping,
                    powerPreference: "default",
                    alpha: false,
                    failIfMajorPerformanceCaveat: false
                },
                onPointerMissed: ()=>dispatch({
                        type: "INSPECT",
                        target: null
                    }),
                onCreated: onCreated,
                children: /*#__PURE__*/jsx(Suspense, {
                    fallback: null,
                    children: /*#__PURE__*/jsx(HarborScene, {})
                })
            }, epoch)
        })
    });
}
