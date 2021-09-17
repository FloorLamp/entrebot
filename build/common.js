"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drip = exports.wrapper = exports.defaultAgent = void 0;
const agent_1 = require("@dfinity/agent");
require("dotenv/config");
const node_fetch_1 = __importDefault(require("node-fetch"));
const Drip = __importStar(require("./Drip"));
const Wrapper = __importStar(require("./Wrapper"));
global.fetch = node_fetch_1.default;
exports.defaultAgent = new agent_1.HttpAgent({
    host: "https://ic0.app",
});
exports.wrapper = Wrapper.createActor(exports.defaultAgent);
exports.drip = Drip.createActor(exports.defaultAgent);
