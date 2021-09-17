import { HttpAgent } from "@dfinity/agent";
import "dotenv/config";
import fetch from "node-fetch";
import * as Drip from "./Drip";
import * as Wrapper from "./Wrapper";
(global as any).fetch = fetch;

export const defaultAgent = new HttpAgent({
  host: "https://ic0.app",
});

export const wrapper = Wrapper.createActor(defaultAgent);
export const drip = Drip.createActor(defaultAgent);
