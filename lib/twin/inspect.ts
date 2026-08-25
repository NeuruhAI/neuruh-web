// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { epistemicMeans } from "@/lib/twin/epistemic";
import { HARBOR_TRACT, sourceById } from "@/lib/twin/property";
import { assertNever } from "@/lib/status";

export function describeInspect(target) {
    switch(target.kind){
        case "source":
            {
                const source = sourceById(target.id);
                return {
                    title: source.name,
                    body: `${source.body}\n${source.hash}\nasOf ${source.asOf}\nreceived ${source.receivedAt}\n${epistemicMeans(source.epistemic)}`,
                    epi: source.epistemic
                };
            }
        case "fact":
            {
                const fact = HARBOR_TRACT.facts.find((item)=>item.id === target.id);
                if (!fact) {
                    return {
                        title: target.id,
                        body: "Fact not on this fixture.",
                        epi: null
                    };
                }
                return {
                    title: fact.label,
                    body: `${fact.value}\n${fact.note}\nsources ${fact.sourceIds.join(", ")}\n${epistemicMeans(fact.epistemic)}`,
                    epi: fact.epistemic
                };
            }
        case "signal":
            {
                const signal = HARBOR_TRACT.signals.find((item)=>item.id === target.id);
                if (!signal) {
                    return {
                        title: target.id,
                        body: "Signal not on this fixture.",
                        epi: null
                    };
                }
                return {
                    title: signal.label,
                    body: `structure: ${signal.structure}\nderived from fact ${signal.derivedFrom}\nindependence: ${signal.independence}\nevent ${signal.eventDate}\n${epistemicMeans(signal.epistemic)}`,
                    epi: signal.epistemic
                };
            }
        case "identifier":
            {
                const identifier = HARBOR_TRACT.identifiers.find((item)=>item.kind === target.id);
                if (!identifier) {
                    return {
                        title: target.id,
                        body: "Identifier not on this fixture.",
                        epi: null
                    };
                }
                return {
                    title: identifier.label,
                    body: `${identifier.value}\nsource ${identifier.sourceId}`,
                    epi: null
                };
            }
        case "clause":
            return {
                title: "Recipe clause",
                body: target.id,
                epi: null
            };
        case "receipt":
            return {
                title: "Receipt layer",
                body: target.id,
                epi: null
            };
        default:
            return assertNever(target.kind);
    }
}
