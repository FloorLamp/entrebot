import { Client, Intents, TextChannel } from "discord.js";
import "dotenv/config";
import { saveData } from "./cache";

if (!process.env.API_KEY) {
  console.warn("API_KEY not set!");
  process.exit(1);
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
  console.log("Ready!");

  if (process.env.CHANNEL_ID) {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    setInterval(() => saveData(channel as TextChannel), 30000);
    saveData(channel as TextChannel);
  } else {
    console.warn("CHANNEL_ID not set!");
  }
});

client.login(process.env.API_KEY);
