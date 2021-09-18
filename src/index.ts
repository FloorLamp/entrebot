import {
  Client,
  Collection,
  CommandInteraction,
  Intents,
  TextChannel,
} from "discord.js";
import "dotenv/config";
import fs from "fs";
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
if (!process.env.GUILD_ID) {
  console.warn("GUILD_ID not set!");
  process.exit(1);
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
  console.log("Ready!");

  const channel = await client.channels.fetch(process.env.CHANNEL_ID!);
  const guild = client.guilds.cache.get(process.env.GUILD_ID!);

  const tasks = async () => {
    saveTransactions(channel as TextChannel);
    const listings = await saveListings();

    if (process.env.NO_STATUS) {
      return;
    }
    guild?.me?.setNickname(`Floor ${floorPrice()} ICP`);
    client.user?.setActivity(`${listings} Drip listed`, {
      type: "WATCHING",
    });
  };
  setInterval(tasks, 30000);
  tasks();
});

const commands = new Collection<
  string,
  { execute: (arg: CommandInteraction) => Promise<any> }
>();
const commandFiles = fs
  .readdirSync(`${__dirname}/commands`)
  .filter((file) => /(js|ts)$/.test(file));

for (const file of commandFiles) {
  const command = require(`${__dirname}/commands/${file}`);
  commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.API_KEY);
