import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ListingsJsonData, LISTINGS_PATH } from "../cache";
import { dataJson } from "../common";
import { LootData } from "../Drip/Drip.did";
import { lootDataToString, shortPrincipal } from "../utils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("market")
    .setDescription("Search marketplace for item")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("Item name, prefix, or suffix")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    let listings: ListingsJsonData;
    try {
      delete require.cache[require.resolve(LISTINGS_PATH)];
      listings = require(LISTINGS_PATH);
    } catch (error) {
      console.warn("listings not found in cache");
      return interaction.reply({
        ephemeral: true,
        content: "Listings not loaded...",
      });
    }

    const string = interaction.options.getString("search");
    if (!string || string.length < 3) {
      return interaction.reply({
        ephemeral: true,
        content: "Invalid search query",
      });
    }

    const re = new RegExp(string, "i");
    const allMatches = Object.fromEntries(
      Object.entries(dataJson)
        .map(([id, items]): [number, LootData[]] => {
          const matches = items.filter(
            (item) =>
              re.test(item.name) ||
              re.test(item.name_prefix) ||
              re.test(item.prefix) ||
              re.test(item.name_suffix)
          );
          return [Number(id), matches];
        })
        .filter(([_, ls]) => ls.length > 0)
    );
    const matchCount = Object.keys(allMatches).length;

    if (!matchCount) {
      return interaction.reply({
        ephemeral: true,
        content: 'No matching items. Try "anime" or "pillow"',
      });
    }

    const filtered = listings
      .filter(([id]) => allMatches[id])
      .map(([id, { price, seller }]) => ({
        id,
        price: Number(price) / 1e8,
        seller,
      }))
      .sort((a, b) => a.price - b.price);

    return interaction.reply({
      embeds: [
        {
          color: "PURPLE",
          title: `${filtered.length} "${string}" items listed | ${matchCount} total`,
          fields: filtered.slice(0, 5).flatMap(({ id, price, seller }) => {
            return allMatches[id.toString()].map((ld) => ({
              name: `${id} | ${lootDataToString(ld)}`,
              value: `${price} ICP by [${shortPrincipal(
                seller
              )}](https://ic.rocks/principal/${seller})`,
            }));
          }),
          description: `Min ${filtered[0].price} ICP | Max ${
            filtered.slice(-1)[0].price
          } ICP`,
        },
      ],
    });
  },
};
