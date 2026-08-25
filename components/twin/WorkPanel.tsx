// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { ProofBadge } from "@/components/atlas/ProofBadge";
import { useTwin } from "@/components/twin/TwinProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HARBOR_TRACT, sourceById } from "@/lib/twin/property";
import { QUERY_SPEC, SEARCH_PROMPT, formatQuerySpec, funnelIsOrderedPrefix } from "@/lib/twin/query";
import { epistemicLabel, epistemicMeans } from "@/lib/twin/epistemic";
import { assertNever } from "@/lib/status";
import { scenePurposeLine } from "@/lib/twin/stages";
import { cn } from "@/lib/utils";

function EpistemicMark({ value }) {
    return /*#__PURE__*/jsx("span", {
        className: cn("font-mono text-[10px] tracking-[0.12em] uppercase", value === "VERIFIED" && "text-live", value === "ESTIMATED" && "text-signal", value === "UNKNOWN" && "text-bone/45", value === "STALE" && "text-amber-700", value === "SOURCE_UNAVAILABLE" && "text-bone/40", value === "CONTRADICTORY" && "text-danger"),
        children: epistemicLabel(value)
    });
}
export function WorkPanel() {
    const { state } = useTwin();
    return /*#__PURE__*/jsxs("div", {
        className: "flex h-full min-h-0 flex-col border-l border-bone/10 bg-paper",
        children: [
            /*#__PURE__*/jsxs("div", {
                className: "border-b border-bone/10 px-4 py-3",
                children: [
                    /*#__PURE__*/jsx("p", {
                        className: "type-kicker text-copper",
                        children: state.scene
                    }),
                    /*#__PURE__*/jsx("h2", {
                        className: "font-heading text-2xl leading-tight text-bone",
                        children: scenePurposeLine(state.scene)
                    })
                ]
            }),
            /*#__PURE__*/jsxs("div", {
                className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
                children: [
                    /*#__PURE__*/jsx(SceneWork, {
                        scene: state.scene
                    }),
                    state.mode === "reality" ? /*#__PURE__*/jsx(RealityNotes, {}) : null
                ]
            }),
            state.inspect ? /*#__PURE__*/jsx(Inspector, {}) : null
        ]
    });
}
function SceneWork({ scene }) {
    switch(scene){
        case "world":
            return /*#__PURE__*/jsx(WorldWork, {});
        case "observe":
            return /*#__PURE__*/jsx(ObserveWork, {});
        case "custody":
            return /*#__PURE__*/jsx(CustodyWork, {});
        case "identity":
            return /*#__PURE__*/jsx(IdentityWork, {});
        case "fact":
            return /*#__PURE__*/jsx(FactWork, {});
        case "signal":
            return /*#__PURE__*/jsx(SignalWork, {});
        case "recipe":
            return /*#__PURE__*/jsx(RecipeWork, {});
        case "decision":
            return /*#__PURE__*/jsx(DecisionWork, {});
        case "authority":
            return /*#__PURE__*/jsx(AuthorityWork, {});
        case "action":
            return /*#__PURE__*/jsx(ActionWork, {});
        case "receipt":
            return /*#__PURE__*/jsx(ReceiptWork, {});
        case "outcome":
            return /*#__PURE__*/jsx(OutcomeWork, {});
        case "calibration":
            return /*#__PURE__*/jsx(CalibrationWork, {});
        default:
            return assertNever(scene);
    }
}
function WorldWork() {
    return /*#__PURE__*/jsxs("div", {
        className: "space-y-4 text-sm leading-relaxed text-bone/75",
        children: [
            /*#__PURE__*/jsx("p", {
                children: "Pender Tract is a synthetic cadastral field. No recipe has been asked. The polygon is ground, not a lead."
            }),
            /*#__PURE__*/jsxs("dl", {
                className: "grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[12px] text-bone/80",
                children: [
                    /*#__PURE__*/jsx("dt", {
                        className: "text-bone/45",
                        children: "geography"
                    }),
                    /*#__PURE__*/jsx("dd", {
                        children: "PENDER_TRACT_SYNTHETIC"
                    }),
                    /*#__PURE__*/jsx("dt", {
                        className: "text-bone/45",
                        children: "estate snapshot"
                    }),
                    /*#__PURE__*/jsx("dd", {
                        children: HARBOR_TRACT.estateSnapshot
                    }),
                    /*#__PURE__*/jsx("dt", {
                        className: "text-bone/45",
                        children: "query"
                    }),
                    /*#__PURE__*/jsx("dd", {
                        children: "none"
                    }),
                    /*#__PURE__*/jsx("dt", {
                        className: "text-bone/45",
                        children: "structure"
                    }),
                    /*#__PURE__*/jsx("dd", {
                        children: "unbuilt"
                    })
                ]
            })
        ]
    });
}
function ObserveWork() {
    const { dispatch } = useTwin();
    return /*#__PURE__*/jsx("ol", {
        className: "space-y-2",
        children: HARBOR_TRACT.sources.map((source)=>/*#__PURE__*/jsx("li", {
                children: /*#__PURE__*/jsxs("button", {
                    type: "button",
                    onClick: ()=>dispatch({
                            type: "INSPECT",
                            target: {
                                kind: "source",
                                id: source.id
                            }
                        }),
                    className: "flex w-full min-h-11 items-start justify-between gap-3 border border-bone/10 bg-ink px-3 py-2 text-left",
                    children: [
                        /*#__PURE__*/jsxs("span", {
                            children: [
                                /*#__PURE__*/jsx("span", {
                                    className: "block font-mono text-[10px] tracking-[0.14em] text-copper uppercase",
                                    children: source.kind
                                }),
                                /*#__PURE__*/jsx("span", {
                                    className: "text-sm text-bone",
                                    children: source.name
                                })
                            ]
                        }),
                        /*#__PURE__*/jsx(EpistemicMark, {
                            value: source.epistemic
                        })
                    ]
                })
            }, source.id))
    });
}
function CustodyWork() {
    return /*#__PURE__*/jsxs("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/jsx("p", {
                className: "text-sm text-bone/70",
                children: "Each arrival is hashed. Unavailable is kept. Nothing is silently dropped."
            }),
            /*#__PURE__*/jsx("ul", {
                className: "space-y-2 font-mono text-[11px]",
                children: HARBOR_TRACT.sources.map((source)=>/*#__PURE__*/jsxs("li", {
                        className: "border border-bone/10 px-3 py-2",
                        children: [
                            /*#__PURE__*/jsxs("div", {
                                className: "flex justify-between gap-2 text-bone/50",
                                children: [
                                    /*#__PURE__*/jsx("span", {
                                        children: source.kind
                                    }),
                                    /*#__PURE__*/jsx("span", {
                                        children: source.accepted ? "ACCEPTED" : "HELD"
                                    })
                                ]
                            }),
                            /*#__PURE__*/jsx("p", {
                                className: "mt-1 break-all text-copper",
                                children: source.hash
                            }),
                            /*#__PURE__*/jsx("p", {
                                className: "text-bone/45",
                                children: source.receivedAt
                            })
                        ]
                    }, source.id))
            })
        ]
    });
}
function IdentityWork() {
    const { dispatch } = useTwin();
    return /*#__PURE__*/jsxs("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/jsx("p", {
                className: "text-sm text-bone/70",
                children: "Six observations of one tract. They move, visibly, to a single monument."
            }),
            /*#__PURE__*/jsx("ul", {
                className: "space-y-2",
                children: HARBOR_TRACT.identifiers.map((identifier)=>/*#__PURE__*/jsx("li", {
                        children: /*#__PURE__*/jsxs("button", {
                            type: "button",
                            className: "flex w-full min-h-11 items-baseline justify-between gap-3 border-b border-bone/10 py-2 text-left",
                            onClick: ()=>dispatch({
                                    type: "INSPECT",
                                    target: {
                                        kind: "identifier",
                                        id: identifier.kind
                                    }
                                }),
                            children: [
                                /*#__PURE__*/jsx("span", {
                                    className: "font-mono text-[10px] tracking-[0.14em] text-bone/45 uppercase",
                                    children: identifier.label
                                }),
                                /*#__PURE__*/jsx("span", {
                                    className: "font-mono text-[12px] text-bone",
                                    children: identifier.value
                                })
                            ]
                        })
                    }, identifier.kind))
            })
        ]
    });
}
function FactWork() {
    const { dispatch } = useTwin();
    return /*#__PURE__*/jsx("ul", {
        className: "space-y-2",
        children: HARBOR_TRACT.facts.map((fact)=>/*#__PURE__*/jsx("li", {
                children: /*#__PURE__*/jsxs("button", {
                    type: "button",
                    onClick: ()=>dispatch({
                            type: "INSPECT",
                            target: {
                                kind: "fact",
                                id: fact.id
                            }
                        }),
                    className: "w-full min-h-11 border border-bone/10 px-3 py-2 text-left",
                    children: [
                        /*#__PURE__*/jsxs("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/jsx("span", {
                                    className: "text-sm text-bone",
                                    children: fact.label
                                }),
                                /*#__PURE__*/jsx(EpistemicMark, {
                                    value: fact.epistemic
                                })
                            ]
                        }),
                        /*#__PURE__*/jsx("p", {
                            className: "font-mono text-[13px] text-copper",
                            children: fact.value
                        }),
                        /*#__PURE__*/jsx("p", {
                            className: "text-[12px] text-bone/50",
                            children: fact.note
                        })
                    ]
                })
            }, fact.id))
    });
}
function SignalWork() {
    const { dispatch } = useTwin();
    return /*#__PURE__*/jsx("ul", {
        className: "space-y-2",
        children: HARBOR_TRACT.signals.map((signal)=>/*#__PURE__*/jsx("li", {
                children: /*#__PURE__*/jsxs("button", {
                    type: "button",
                    onClick: ()=>dispatch({
                            type: "INSPECT",
                            target: {
                                kind: "signal",
                                id: signal.id
                            }
                        }),
                    className: "w-full min-h-11 border border-bone/10 px-3 py-2 text-left",
                    children: [
                        /*#__PURE__*/jsxs("div", {
                            className: "flex justify-between gap-2",
                            children: [
                                /*#__PURE__*/jsx("span", {
                                    className: "font-mono text-[12px] text-bone",
                                    children: signal.label
                                }),
                                /*#__PURE__*/jsx(EpistemicMark, {
                                    value: signal.epistemic
                                })
                            ]
                        }),
                        /*#__PURE__*/jsxs("p", {
                            className: "text-[12px] text-bone/55",
                            children: [
                                "becomes ",
                                /*#__PURE__*/jsx("span", {
                                    className: "text-copper",
                                    children: signal.structure
                                })
                            ]
                        })
                    ]
                })
            }, signal.id))
    });
}
function RecipeWork() {
    const { state, dispatch, enabled, remaining, hash } = useTwin();
    const ordered = funnelIsOrderedPrefix(enabled);
    return /*#__PURE__*/jsxs("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/jsxs("label", {
                className: "block",
                children: [
                    /*#__PURE__*/jsx("span", {
                        className: "type-kicker text-copper",
                        children: "Search"
                    }),
                    /*#__PURE__*/jsx(Input, {
                        value: state.prompt,
                        onChange: (event)=>dispatch({
                                type: "SET_PROMPT",
                                prompt: event.target.value
                            }),
                        className: "mt-2 min-h-11 rounded-sm border-bone/20 bg-ink font-mono text-[12px]"
                    })
                ]
            }),
            /*#__PURE__*/jsxs("p", {
                className: "text-[11px] text-bone/40",
                children: [
                    "Interpreter is deterministic. Default prompt: ",
                    SEARCH_PROMPT
                ]
            }),
            /*#__PURE__*/jsx("pre", {
                className: "overflow-x-auto border border-bone/10 bg-ink p-3 font-mono text-[11px] leading-relaxed text-bone/80",
                children: formatQuerySpec(QUERY_SPEC, enabled)
            }),
            /*#__PURE__*/jsx("ul", {
                className: "space-y-1",
                children: QUERY_SPEC.clauses.map((clause)=>/*#__PURE__*/jsx("li", {
                        children: /*#__PURE__*/jsxs("label", {
                            className: "flex min-h-11 items-center gap-3 text-sm",
                            children: [
                                /*#__PURE__*/jsx("input", {
                                    type: "checkbox",
                                    checked: enabled.has(clause.id),
                                    onChange: ()=>dispatch({
                                            type: "TOGGLE_CLAUSE",
                                            id: clause.id
                                        }),
                                    className: "size-4 accent-copper"
                                }),
                                /*#__PURE__*/jsx("span", {
                                    children: clause.label
                                })
                            ]
                        })
                    }, clause.id))
            }),
            /*#__PURE__*/jsxs("div", {
                children: [
                    /*#__PURE__*/jsx("p", {
                        className: "font-heading text-4xl tabular-nums text-bone",
                        children: remaining.toLocaleString()
                    }),
                    /*#__PURE__*/jsxs("p", {
                        className: "font-mono text-[11px] text-bone/45",
                        children: [
                            "SYNTHETIC DEMO COUNTS · not production coverage",
                            ordered ? "" : " · funnel is ordered; unordered recount is not modeled"
                        ]
                    }),
                    /*#__PURE__*/jsx("p", {
                        className: "mt-2 break-all font-mono text-[11px] text-copper",
                        children: hash
                    })
                ]
            })
        ]
    });
}
function DecisionWork() {
    return /*#__PURE__*/jsxs("ul", {
        className: "space-y-2 text-sm",
        children: [
            /*#__PURE__*/jsxs("li", {
                className: "border border-bone/10 px-3 py-3",
                children: [
                    /*#__PURE__*/jsx("p", {
                        className: "font-mono text-[10px] tracking-[0.14em] text-copper uppercase",
                        children: "Future A"
                    }),
                    /*#__PURE__*/jsx("p", {
                        className: "text-bone",
                        children: "Research enqueue. Allowed if authority agrees."
                    })
                ]
            }),
            /*#__PURE__*/jsxs("li", {
                className: "border border-bone/10 px-3 py-3 opacity-70",
                children: [
                    /*#__PURE__*/jsx("p", {
                        className: "font-mono text-[10px] tracking-[0.14em] text-bone/50 uppercase",
                        children: "Future B"
                    }),
                    /*#__PURE__*/jsx("p", {
                        className: "text-bone/80",
                        children: "Drip / call. Plausible. Not licensed."
                    })
                ]
            }),
            /*#__PURE__*/jsxs("li", {
                className: "border border-bone/10 px-3 py-3 opacity-70",
                children: [
                    /*#__PURE__*/jsx("p", {
                        className: "font-mono text-[10px] tracking-[0.14em] text-bone/50 uppercase",
                        children: "Future C"
                    }),
                    /*#__PURE__*/jsx("p", {
                        className: "text-bone/80",
                        children: "Contract out. Plausible. Not licensed."
                    })
                ]
            })
        ]
    });
}
function AuthorityWork() {
    const authority = HARBOR_TRACT.authority;
    return /*#__PURE__*/jsxs("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/jsx("p", {
                className: "text-sm text-bone/75",
                children: authority.rule
            }),
            /*#__PURE__*/jsxs("dl", {
                className: "space-y-2 font-mono text-[12px]",
                children: [
                    /*#__PURE__*/jsxs("div", {
                        className: "flex justify-between border-b border-bone/10 py-2",
                        children: [
                            /*#__PURE__*/jsx("dt", {
                                className: "text-bone/45",
                                children: "qualified"
                            }),
                            /*#__PURE__*/jsx("dd", {
                                className: "text-live",
                                children: String(authority.qualified)
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("div", {
                        className: "flex justify-between border-b border-bone/10 py-2",
                        children: [
                            /*#__PURE__*/jsx("dt", {
                                className: "text-bone/45",
                                children: "contact authorized"
                            }),
                            /*#__PURE__*/jsx("dd", {
                                className: "text-danger",
                                children: String(authority.contactAuthorized)
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/jsxs("div", {
                children: [
                    /*#__PURE__*/jsx("p", {
                        className: "type-kicker mb-2 text-copper",
                        children: "Allowed"
                    }),
                    /*#__PURE__*/jsx("p", {
                        className: "text-sm text-bone",
                        children: authority.allowedActions.join(" · ")
                    })
                ]
            }),
            /*#__PURE__*/jsxs("div", {
                children: [
                    /*#__PURE__*/jsx("p", {
                        className: "type-kicker mb-2 text-danger",
                        children: "Halted"
                    }),
                    /*#__PURE__*/jsx("p", {
                        className: "text-sm text-bone",
                        children: authority.haltedActions.join(" · ")
                    })
                ]
            }),
            /*#__PURE__*/jsx("p", {
                className: "text-[12px] leading-relaxed text-bone/50",
                children: authority.liveEcho
            })
        ]
    });
}
function ActionWork() {
    return /*#__PURE__*/jsxs("div", {
        "data-surface": "desk",
        className: "space-y-3 rounded-sm p-3",
        children: [
            /*#__PURE__*/jsx("p", {
                className: "type-kicker text-[color:var(--primary)]",
                children: "Operator desk · production-faithful"
            }),
            /*#__PURE__*/jsx("p", {
                className: "text-sm text-[color:var(--foreground)]",
                children: "Not a live session. Reconstruction of DeedSonar desk language: research queue, map pin, no drip."
            }),
            /*#__PURE__*/jsxs("div", {
                className: "grid gap-2",
                children: [
                    /*#__PURE__*/jsxs("div", {
                        className: "border border-[color:var(--border)] bg-[color:var(--card)] p-3",
                        children: [
                            /*#__PURE__*/jsx("p", {
                                className: "text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]",
                                children: "Queue"
                            }),
                            /*#__PURE__*/jsx("p", {
                                className: "text-sm font-medium",
                                children: "Research · current estate"
                            }),
                            /*#__PURE__*/jsx("p", {
                                className: "font-mono text-[12px]",
                                children: "SYN-NC-4417 · Harbor Family Trust 1998"
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("div", {
                        className: "border border-[color:var(--border)] bg-[color:var(--card)] p-3",
                        children: [
                            /*#__PURE__*/jsx("p", {
                                className: "text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]",
                                children: "Task"
                            }),
                            /*#__PURE__*/jsx("p", {
                                className: "text-sm",
                                children: "Continue public enrichment. Living party unknown."
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("div", {
                        className: "border border-[color:var(--border)] bg-[color:var(--card)] p-3 opacity-50",
                        children: [
                            /*#__PURE__*/jsx("p", {
                                className: "text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]",
                                children: "Drips due"
                            }),
                            /*#__PURE__*/jsx("p", {
                                className: "text-sm",
                                children: "Halted — contact not authorized."
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
function ReceiptWork() {
    const { hash } = useTwin();
    return /*#__PURE__*/jsxs("div", {
        "data-surface": "receipt",
        className: "-mx-4 -mb-4 min-h-full px-4 py-4",
        children: [
            /*#__PURE__*/jsx("p", {
                className: "type-kicker",
                children: "Receipt · SYNTHETIC"
            }),
            /*#__PURE__*/jsx("h3", {
                className: "font-heading text-3xl text-ink",
                children: "Harbor Church tract"
            }),
            /*#__PURE__*/jsxs("dl", {
                className: "mt-4 space-y-2 font-mono text-[12px] text-ink",
                children: [
                    /*#__PURE__*/jsxs("div", {
                        className: "flex justify-between gap-3 border-b border-ink/15 py-1",
                        children: [
                            /*#__PURE__*/jsx("dt", {
                                children: "query hash"
                            }),
                            /*#__PURE__*/jsx("dd", {
                                className: "break-all",
                                children: hash
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("div", {
                        className: "flex justify-between gap-3 border-b border-ink/15 py-1",
                        children: [
                            /*#__PURE__*/jsx("dt", {
                                children: "recipe"
                            }),
                            /*#__PURE__*/jsx("dd", {
                                children: HARBOR_TRACT.recipeVersion
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("div", {
                        className: "flex justify-between gap-3 border-b border-ink/15 py-1",
                        children: [
                            /*#__PURE__*/jsx("dt", {
                                children: "estate snapshot"
                            }),
                            /*#__PURE__*/jsx("dd", {
                                children: HARBOR_TRACT.estateSnapshot
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("div", {
                        className: "flex justify-between gap-3 border-b border-ink/15 py-1",
                        children: [
                            /*#__PURE__*/jsx("dt", {
                                children: "authority"
                            }),
                            /*#__PURE__*/jsx("dd", {
                                children: "qualified / not contactable"
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("div", {
                        className: "flex justify-between gap-3 border-b border-ink/15 py-1",
                        children: [
                            /*#__PURE__*/jsx("dt", {
                                children: "action"
                            }),
                            /*#__PURE__*/jsx("dd", {
                                children: "research enqueue"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/jsx("p", {
                className: "mt-4 text-[12px] leading-relaxed text-ink/70",
                children: "Click layers on the twin to inspect source, fact, and signal. This receipt is a fixture, not a live ProofOS emission."
            })
        ]
    });
}
function OutcomeWork() {
    return /*#__PURE__*/jsx("p", {
        className: "text-sm leading-relaxed text-bone/75",
        children: "The research task files to historical CRM. Current estate remains its own universe. That separation is live language inside DeedSonar, reconstructed here."
    });
}
function CalibrationWork() {
    return /*#__PURE__*/jsx("p", {
        className: "text-sm leading-relaxed text-bone/75",
        children: "The labeled fixture returns down the thread. Learning is a receipt, not a silent weight update. Source Factory as a named product remains Proposed."
    });
}
function RealityNotes() {
    return /*#__PURE__*/jsxs("aside", {
        className: "mt-6 space-y-3 border-t border-bone/10 pt-4",
        children: [
            /*#__PURE__*/jsx("p", {
                className: "type-kicker text-signal",
                children: "Reality mode"
            }),
            /*#__PURE__*/jsxs("ul", {
                className: "space-y-2 text-[12px] leading-relaxed text-bone/65",
                children: [
                    /*#__PURE__*/jsxs("li", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/jsx("span", {
                                children: "DeedSonar operator desk"
                            }),
                            /*#__PURE__*/jsx(ProofBadge, {
                                status: "LIVE"
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("li", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/jsx("span", {
                                children: "Qualification ≠ contact (product copy)"
                            }),
                            /*#__PURE__*/jsx(ProofBadge, {
                                status: "LIVE"
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("li", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/jsx("span", {
                                children: "This parcel / these counts"
                            }),
                            /*#__PURE__*/jsx(ProofBadge, {
                                status: "PROPOSED"
                            })
                        ]
                    }),
                    /*#__PURE__*/jsxs("li", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/jsx("span", {
                                children: "ProofOS public runtime"
                            }),
                            /*#__PURE__*/jsx(ProofBadge, {
                                status: "PROPOSED"
                            })
                        ]
                    }),
                    /*#__PURE__*/jsx("li", {
                        children: /*#__PURE__*/jsx("a", {
                            href: "https://app.deedsonar.com/login",
                            className: "text-copper underline-offset-2 hover:underline",
                            children: "app.deedsonar.com/login"
                        })
                    })
                ]
            })
        ]
    });
}
function Inspector() {
    const { state, dispatch } = useTwin();
    const target = state.inspect;
    if (!target) {
        return null;
    }
    let title = target.id;
    let body = "";
    let epi = null;
    switch(target.kind){
        case "source":
            {
                const source = sourceById(target.id);
                title = source.name;
                body = `${source.body}\n${source.hash}\nasOf ${source.asOf}\nreceived ${source.receivedAt}\n${epistemicMeans(source.epistemic)}`;
                epi = source.epistemic;
                break;
            }
        case "fact":
            {
                const fact = HARBOR_TRACT.facts.find((item)=>item.id === target.id);
                if (fact) {
                    title = fact.label;
                    body = `${fact.value}\n${fact.note}\nsources ${fact.sourceIds.join(", ")}\n${epistemicMeans(fact.epistemic)}`;
                    epi = fact.epistemic;
                }
                break;
            }
        case "signal":
            {
                const signal = HARBOR_TRACT.signals.find((item)=>item.id === target.id);
                if (signal) {
                    title = signal.label;
                    body = `structure: ${signal.structure}\nderived from fact ${signal.derivedFrom}\nindependence: ${signal.independence}\nevent ${signal.eventDate}\n${epistemicMeans(signal.epistemic)}`;
                    epi = signal.epistemic;
                }
                break;
            }
        case "identifier":
            {
                const identifier = HARBOR_TRACT.identifiers.find((item)=>item.kind === target.id);
                if (identifier) {
                    title = identifier.label;
                    body = `${identifier.value}\nsource ${identifier.sourceId}`;
                }
                break;
            }
        case "clause":
        case "receipt":
            title = target.kind;
            body = target.id;
            break;
        default:
            return assertNever(target.kind);
    }
    return /*#__PURE__*/jsxs("div", {
        className: "border-t border-copper/40 bg-ink-2 p-4",
        children: [
            /*#__PURE__*/jsxs("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/jsxs("div", {
                        children: [
                            /*#__PURE__*/jsx("p", {
                                className: "type-kicker text-copper",
                                children: target.kind
                            }),
                            /*#__PURE__*/jsx("h3", {
                                className: "text-lg text-bone",
                                children: title
                            })
                        ]
                    }),
                    /*#__PURE__*/jsx(Button, {
                        type: "button",
                        size: "sm",
                        variant: "ghost",
                        onClick: ()=>dispatch({
                                type: "INSPECT",
                                target: null
                            }),
                        children: "Close"
                    })
                ]
            }),
            epi ? /*#__PURE__*/jsx("div", {
                className: "mt-2",
                children: /*#__PURE__*/jsx(EpistemicMark, {
                    value: epi
                })
            }) : null,
            /*#__PURE__*/jsx("pre", {
                className: "mt-3 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-bone/70",
                children: body
            })
        ]
    });
}
