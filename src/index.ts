import { Client, Intents, TextChannel } from "discord.js";
import "dotenv/config";
import { saveListings, saveTransactions } from "./cache";
import { floorPrice } from "./commands";

if (!process.env.API_KEY) {
  console.warn("API_KEY not set!");
  process.exit(1);
}
if (!process.env.CHANNEL_ID) {
  console.warn("CHANNEL_ID not set!");
  process.exit(1);
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
  console.log("Ready!");

  const channel = await client.channels.fetch(process.env.CHANNEL_ID!);
  const tasks = async () => {
    saveTransactions(channel as TextChannel);
    const listings = await saveListings();
    client.user?.setUsername(`Floor ${floorPrice()} ICP`);
    client.user?.setActivity(`${listings} Drip listed`, { type: "WATCHING" });
  };
  setInterval(tasks, 30000);
  tasks();
});

client.login(process.env.API_KEY);
