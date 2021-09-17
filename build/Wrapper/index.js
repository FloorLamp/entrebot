"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActor = exports.canisterId = void 0;
const agent_1 = require("@dfinity/agent");
const Wrapper_did_js_1 = require("./Wrapper.did.js");
exports.canisterId = "3db6u-aiaaa-aaaah-qbjbq-cai";
/**
 * @param {{agent: import("@dfinity/agent").HttpAgent}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./Wrapper.did.js")._SERVICE>}
 */
const createActor = (agent) => {
    // Fetch root key for certificate validation during development
    if (process.env.NEXT_PUBLIC_DFX_NETWORK === "local") {
        agent.fetchRootKey();
    }
    // Creates an actor with using the candid interface and the HttpAgent
    return agent_1.Actor.createActor(Wrapper_did_js_1.idlFactory, {
        agent,
        canisterId: exports.canisterId,
    });
};
exports.createActor = createActor;
