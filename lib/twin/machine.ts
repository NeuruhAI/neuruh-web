// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { QUERY_SPEC, compilePrompt } from "@/lib/twin/query";
import { SCENES, nextScene, prevScene, sceneSpec } from "@/lib/twin/stages";

export const DEFAULT_CLAUSES = QUERY_SPEC.clauses.filter((clause)=>clause.defaultOn).map((clause)=>clause.id);
export const INITIAL_STATE = {
    scene: "world",
    playing: true,
    mode: "story",
    spatial: false,
    exploded: false,
    timeIndex: 2,
    enabledClauses: DEFAULT_CLAUSES,
    inspect: null,
    prompt: QUERY_SPEC.prompt,
    clothing: "deedsonar"
};
export function twinReducer(state, action) {
    switch(action.type){
        case "PLAY":
            return {
                ...state,
                playing: true
            };
        case "PAUSE":
            return {
                ...state,
                playing: false
            };
        case "TOGGLE_PLAY":
            return {
                ...state,
                playing: !state.playing
            };
        case "NEXT":
            {
                const next = nextScene(state.scene);
                if (!next) {
                    return {
                        ...state,
                        playing: false,
                        exploded: true
                    };
                }
                return {
                    ...state,
                    scene: next,
                    exploded: next === "receipt",
                    playing: sceneSpec(next).durationMs > 0 && state.playing
                };
            }
        case "PREV":
            {
                const prev = prevScene(state.scene);
                if (!prev) {
                    return state;
                }
                return {
                    ...state,
                    scene: prev,
                    exploded: prev === "receipt",
                    playing: false
                };
            }
        case "GOTO":
            return {
                ...state,
                scene: action.scene,
                exploded: action.scene === "receipt",
                playing: false
            };
        case "SET_MODE":
            return {
                ...state,
                mode: action.mode,
                playing: action.mode === "story" ? state.playing : false
            };
        case "TOGGLE_MODE":
            return twinReducer(state, {
                type: "SET_MODE",
                mode: state.mode === "story" ? "reality" : "story"
            });
        case "TOGGLE_SPATIAL":
            return {
                ...state,
                spatial: !state.spatial,
                playing: false
            };
        case "SET_EXPLODED":
            return {
                ...state,
                exploded: action.exploded,
                playing: false
            };
        case "SET_TIME":
            return {
                ...state,
                timeIndex: action.timeIndex,
                playing: false
            };
        case "TOGGLE_CLAUSE":
            {
                const has = state.enabledClauses.includes(action.id);
                const enabledClauses = has ? state.enabledClauses.filter((id)=>id !== action.id) : [
                    ...state.enabledClauses,
                    action.id
                ];
                return {
                    ...state,
                    enabledClauses,
                    playing: false
                };
            }
        case "SET_PROMPT":
            {
                const compiled = compilePrompt(action.prompt);
                return {
                    ...state,
                    prompt: action.prompt,
                    enabledClauses: compiled.clauses.filter((clause)=>clause.defaultOn).map((clause)=>clause.id),
                    playing: false
                };
            }
        case "INSPECT":
            return {
                ...state,
                inspect: action.target,
                playing: action.target ? false : state.playing
            };
        case "SET_CLOTHING":
            return {
                ...state,
                clothing: action.clothing,
                playing: false
            };
        case "TICK":
            {
                if (!state.playing) {
                    return state;
                }
                if (sceneSpec(state.scene).durationMs === 0) {
                    return {
                        ...state,
                        playing: false,
                        exploded: true
                    };
                }
                return twinReducer(state, {
                    type: "NEXT"
                });
            }
        default:
            {
                const unreachable = action;
                throw new Error(`Unhandled twin action: ${JSON.stringify(unreachable)}`);
            }
    }
}
export function sceneFromProgress(progress) {
    const index = Math.min(SCENES.length - 1, Math.max(0, Math.round(progress * (SCENES.length - 1))));
    return SCENES[index];
}
