"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActor = exports.canisterId = void 0;
const agent_1 = require("@dfinity/agent");
const Drip_did_js_1 = require("./Drip.did.js");
exports.canisterId = "d3ttm-qaaaa-aaaai-qam4a-cai";
/**
 * @param {{agent: import("@dfinity/agent").HttpAgent}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./Drip.did.js")._SERVICE>}
 */
const createActor = (agent) => {
    // Fetch root key for certificate validation during development
    if (process.env.NEXT_PUBLIC_DFX_NETWORK === "local") {
        agent.fetchRootKey();
    }
    // Creates an actor with using the candid interface and the HttpAgent
    return agent_1.Actor.createActor(Drip_did_js_1.idlFactory, {
        agent,
        canisterId: exports.canisterId,
    });
};
exports.createActor = createActor;
