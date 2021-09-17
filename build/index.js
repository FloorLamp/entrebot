"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const cache_1 = require("./cache");
if (!process.env.API_KEY) {
    console.warn("API_KEY not set!");
    process.exit(1);
}
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
client.once("ready", async () => {
    console.log("Ready!");
    if (process.env.CHANNEL_ID) {
        const channel = await client.channels.fetch(process.env.CHANNEL_ID);
        setInterval(() => (0, cache_1.saveData)(channel), 30000);
        (0, cache_1.saveData)(channel);
    }
    else {
        console.warn("CHANNEL_ID not set!");
    }
});
client.login(process.env.API_KEY);
