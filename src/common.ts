import { HttpAgent } from "@dfinity/agent";
import "dotenv/config";
import fetch from "node-fetch";
import dataAny from "./cache/data.json";
import * as Drip from "./Drip";
import { LootData } from "./Drip/Drip.did";
import * as Wrapper from "./Wrapper";
(global as any).fetch = fetch;

export const defaultAgent = new HttpAgent({
  host: "https://ic0.app",
});

export const wrapper = Wrapper.createActor(defaultAgent);
export const drip = Drip.createActor(defaultAgent);

export const dataJson = dataAny as Record<string, LootData[]>;
