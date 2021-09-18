import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { searchListings } from "../queries";
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
    const string = interaction.options.getString("search");
    if (!string || string.length < 3) {
      return interaction.reply({
        ephemeral: true,
        content: "Invalid search query",
      });
    }
    const results = searchListings(string);
    if (!results) {
      return interaction.reply({
        ephemeral: true,
        content: "Listings not loaded...",
      });
    }
    if (!results.count) {
      return interaction.reply({
        ephemeral: true,
        content: 'No matching items. Try "anime" or "pillow"',
      });
    }

    return interaction.reply({
      embeds: [
        {
          color: "PURPLE",
          title: `${results.listings.length} "${string}" items listed | ${results.count} total`,
          fields: results.listings
            .slice(0, 5)
            .flatMap(({ id, price, seller, data }) => {
              return data.map((ld) => ({
                name: `${id} | ${lootDataToString(ld)}`,
                value: `${price} ICP by [${shortPrincipal(
                  seller
                )}](https://ic.rocks/principal/${seller})`,
              }));
            }),
          description: `Min ${results.listings[0].price} ICP | Max ${
            results.listings.slice(-1)[0].price
          } ICP`,
        },
      ],
    });
  },
};
