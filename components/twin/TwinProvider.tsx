// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { HARBOR_TRACT } from "@/lib/twin/property";
import { harborMatchesRecipe, specHash, universeRemaining } from "@/lib/twin/query";
import { INITIAL_STATE, twinReducer } from "@/lib/twin/machine";
import { sceneSpec } from "@/lib/twin/stages";

const TwinContext = /*#__PURE__*/ createContext(null);
export function TwinProvider({ children }) {
    const [state, dispatch] = useReducer(twinReducer, INITIAL_STATE);
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(()=>{
            const media = window.matchMedia("(prefers-reduced-motion: reduce)");
            const update = ()=>setReducedMotion(media.matches);
            update();
            media.addEventListener("change", update);
            return ()=>media.removeEventListener("change", update);
        }, []);
    useEffect(()=>{
            if (reducedMotion) {
                dispatch({
                    type: "PAUSE"
                });
            }
        }, [
        reducedMotion
    ]);
    useEffect(()=>{
            if (!state.playing || reducedMotion) {
                return;
            }
            const duration = sceneSpec(state.scene).durationMs;
            if (duration === 0) {
                dispatch({
                    type: "PAUSE"
                });
                return;
            }
            const timer = window.setTimeout(()=>dispatch({
                        type: "TICK"
                    }), duration);
            return ()=>window.clearTimeout(timer);
        }, [
        state.playing,
        state.scene,
        reducedMotion
    ]);
    const enabled = useMemo(()=>new Set(state.enabledClauses), [
        state.enabledClauses
    ]);
    const remaining = universeRemaining(enabled);
    const hash = specHash(enabled);
    const delinquentYears = HARBOR_TRACT.timeline[state.timeIndex].delinquentYears;
    const matched = harborMatchesRecipe(enabled, delinquentYears);
    const value = useMemo(()=>({
                state,
                dispatch,
                enabled,
                remaining,
                hash,
                reducedMotion,
                delinquentYears,
                matched
            }), [
        state,
        enabled,
        remaining,
        hash,
        reducedMotion,
        delinquentYears,
        matched
    ]);
    return /*#__PURE__*/jsx(TwinContext.Provider, {
        value: value,
        children: children
    });
}
export function useTwin() {
    const value = useContext(TwinContext);
    if (!value) {
        throw new Error("useTwin must be used within TwinProvider");
    }
    return value;
}
