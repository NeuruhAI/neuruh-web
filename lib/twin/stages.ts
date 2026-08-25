// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
import { assertNever } from "@/lib/status";

export const SCENES = [
    "world",
    "observe",
    "custody",
    "identity",
    "fact",
    "signal",
    "recipe",
    "decision",
    "authority",
    "action",
    "receipt",
    "outcome",
    "calibration"
];
export const SCENE_SPECS = [
    {
        id: "world",
        act: "World",
        verb: "Exist",
        purpose: "Show matter before intelligence. A tract is already there.",
        understanding: "Neuruh does not invent land. It takes custody of a world that predates the query.",
        transformation: "Bare terrain and a parcel polygon appear. No house, no facts.",
        durationMs: 3500,
        inVerticalSlice: true
    },
    {
        id: "observe",
        act: "Observe",
        verb: "Arrive",
        purpose: "Source evidence enters from named institutions.",
        understanding: "Assessor, recorder, tax, GIS, FEMA, listing, probate are separate arrivals — not one scrape.",
        transformation: "Source plates travel the Neuruh Thread onto the parcel.",
        durationMs: 4500,
        inVerticalSlice: true
    },
    {
        id: "custody",
        act: "Custody",
        verb: "Accept",
        purpose: "Each arrival is hashed, timestamped, and accepted or held.",
        understanding: "Custody is a verb. Unavailable and contradictory sources stay visible.",
        transformation: "Accepted plates receive a stamp. Held plates remain translucent.",
        durationMs: 2200,
        inVerticalSlice: true
    },
    {
        id: "identity",
        act: "Identity",
        verb: "Converge",
        purpose: "Messy identifiers resolve to one canonical property.",
        understanding: "Address, APN, local id, state PIN, FIPS are observations of one thing.",
        transformation: "Divergent labels physically travel to a single monument.",
        durationMs: 4000,
        inVerticalSlice: true
    },
    {
        id: "fact",
        act: "Fact",
        verb: "Attach",
        purpose: "Known factual layers bind to the canonical identity.",
        understanding: "Facts carry epistemic state. Not every field is magically known.",
        transformation: "Fact plates seat onto the tract: acres, vesting, tenure, tax, listing.",
        durationMs: 2500,
        inVerticalSlice: true
    },
    {
        id: "signal",
        act: "Signal",
        verb: "Raise",
        purpose: "Facts become structural components of the twin.",
        understanding: "A signal is cheaper than a lead and stricter than a vibe.",
        transformation: "Foundation, walls, roof, stain, vacancy assemble from signals.",
        durationMs: 4500,
        inVerticalSlice: true
    },
    {
        id: "recipe",
        act: "Recipe",
        verb: "Compile",
        purpose: "A compiled QuerySpec wraps the twin. Clauses light as satisfied.",
        understanding: "A recipe is a deterministic constraint set, not a prompt.",
        transformation: "Blueprint overlays the house. Universe count narrows as clauses compile.",
        durationMs: 3800,
        inVerticalSlice: true
    },
    {
        id: "decision",
        act: "Decision",
        verb: "Fork",
        purpose: "Plausible futures appear. Only one is licensed by authority.",
        understanding: "The system can imagine research, outreach, or halt. Imagination is not permission.",
        transformation: "Translucent alternate volumes appear beside the twin.",
        durationMs: 1800,
        inVerticalSlice: true
    },
    {
        id: "authority",
        act: "Authority",
        verb: "Gate",
        purpose: "Preflight scans the plan. Qualification is not contact.",
        understanding: "DeedSonar’s live rule: qualification does not authorize contact.",
        transformation: "A scan plane reads the twin. Outreach futures dim. Research remains.",
        durationMs: 2800,
        inVerticalSlice: true
    },
    {
        id: "action",
        act: "Action",
        verb: "Execute",
        purpose: "Approved work runs in a production-faithful operator desk.",
        understanding: "The action is research enqueue — not a drip, not a call.",
        transformation: "DOM desk executes: pin, queue, task. The twin holds still.",
        durationMs: 2200,
        inVerticalSlice: true
    },
    {
        id: "receipt",
        act: "Receipt",
        verb: "Explode",
        purpose: "The finished twin becomes an inspectable causal artifact.",
        understanding: "Every source, fact, signal, gate, hash, and timestamp remains attached.",
        transformation: "Layers separate in space. The thread remains the spine.",
        durationMs: 0,
        inVerticalSlice: true
    },
    {
        id: "outcome",
        act: "Outcome",
        verb: "Resolve",
        purpose: "The workflow records a result in a separate universe from the estate.",
        understanding: "DeedSonar treats current estate, CRM, and historical as independent universes.",
        transformation: "A receipt copy files into historical. The estate twin stays current.",
        durationMs: 3200,
        inVerticalSlice: false
    },
    {
        id: "calibration",
        act: "Calibration",
        verb: "Return",
        purpose: "Outcome evidence re-enters the organism as a labeled fixture.",
        understanding: "Learning is not a silent weight update. It is a returned receipt.",
        transformation: "A pulse travels back down the thread into Source Factory.",
        durationMs: 3200,
        inVerticalSlice: false
    }
];
export function sceneSpec(id) {
    const found = SCENE_SPECS.find((scene)=>scene.id === id);
    if (!found) {
        throw new Error(`Unknown scene: ${id}`);
    }
    return found;
}
export function sceneIndex(id) {
    return SCENES.indexOf(id);
}
export function hasReached(current, target) {
    return sceneIndex(current) >= sceneIndex(target);
}
export function nextScene(id) {
    const index = sceneIndex(id);
    if (index < 0 || index >= SCENES.length - 1) {
        return null;
    }
    return SCENES[index + 1];
}
export function prevScene(id) {
    const index = sceneIndex(id);
    if (index <= 0) {
        return null;
    }
    return SCENES[index - 1];
}
export function sliceDurationMs() {
    return SCENE_SPECS.filter((scene)=>scene.inVerticalSlice).reduce((sum, scene)=>sum + scene.durationMs, 0);
}
export function sliceScenes() {
    return SCENE_SPECS.filter((scene)=>scene.inVerticalSlice);
}
export function threadProgress(id) {
    return sceneIndex(id) / (SCENES.length - 1);
}
export function scenePurposeLine(id) {
    switch(id){
        case "world":
            return "The tract exists before we look.";
        case "observe":
            return "Named sources arrive. Nothing is merged yet.";
        case "custody":
            return "Accepted, held, or marked unavailable — never silently dropped.";
        case "identity":
            return "Many names, one monument.";
        case "fact":
            return "Facts attach with their doubt intact.";
        case "signal":
            return "The house is the data, standing up.";
        case "recipe":
            return "A question compiles. The universe shrinks.";
        case "decision":
            return "Futures appear. None have authority yet.";
        case "authority":
            return "Qualification is not permission to knock.";
        case "action":
            return "Research executes. Outreach does not.";
        case "receipt":
            return "The twin is now evidence. Open it.";
        case "outcome":
            return "The result files separately from the estate.";
        case "calibration":
            return "The organism takes the receipt back in.";
        default:
            return assertNever(id);
    }
}
