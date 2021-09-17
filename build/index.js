"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const cache_1 = require("./cache");
const commands_1 = require("./commands");
if (!process.env.API_KEY) {
    console.warn("API_KEY not set!");
    process.exit(1);
}
if (!process.env.CHANNEL_ID) {
    console.warn("CHANNEL_ID not set!");
    process.exit(1);
}
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
client.once("ready", async () => {
    console.log("Ready!");
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    const tasks = async () => {
        (0, cache_1.saveTransactions)(channel);
        const listings = await (0, cache_1.saveListings)();
        client.user?.setUsername(`Floor ${(0, commands_1.floorPrice)()} ICP`);
        client.user?.setActivity(`${listings} Drip listed`, { type: "WATCHING" });
    };
    setInterval(tasks, 30000);
    tasks();
});
client.login(process.env.API_KEY);
