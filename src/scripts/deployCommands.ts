import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";

const commandFiles = fs
  .readdirSync(`${__dirname}/../commands`)
  .filter((file) => /(js|ts)$/.test(file));

const commands = commandFiles
  .map((file) => require(`${__dirname}/../commands/${file}`))
  .map((command) => command.data.toJSON());
console.log(commands);

const rest = new REST({ version: "9" }).setToken(process.env.API_KEY!);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
