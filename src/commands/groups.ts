import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { dataJson } from "../common";
import { allListings } from "../queries";
import { lootDataToString, shortPrincipal } from "../utils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("groups")
    .setDescription("Get prices by group")
    .addBooleanOption((option) =>
      option.setName("prefix").setDescription("Item prefix")
    )
    .addBooleanOption((option) =>
      option.setName("suffix").setDescription("Item suffix")
    ),
  async execute(interaction: CommandInteraction) {
    const listings = allListings();
    if (!listings.length) {
      return;
    }

    const isPrefix = interaction.options.getBoolean("prefix");
    const isSuffix = interaction.options.getBoolean("suffix");
    if (isPrefix === isSuffix) {
      return interaction.reply({
        ephemeral: true,
        content: "Select one of prefix, suffix",
      });
    }
    const entries = Object.entries(dataJson);
    const set = entries.reduce((set, [id, items]) => {
      items.forEach((item) =>
        set.add(isPrefix ? item.name_prefix : item.name_suffix)
      );
      return set;
    }, new Set<string>());
    const list = [...set].sort();
    const groups: {
      [k: string]: { name: string; value: string };
    } = Object.fromEntries(
      list.map((name) => [name, null]).filter(([name]) => !!name)
    );

    listings.forEach(({ id, data, price, seller }) => {
      data.forEach((item) => {
        const key = isPrefix ? item.name_prefix : item.name_suffix;
        if (!key || groups[key]) {
          return;
        }
        groups[key] = {
          name: `${key}: ${lootDataToString(item)}`,
          value: `Drip ${id} | **${price} ICP** by [${shortPrincipal(
            seller
          )}](https://ic.rocks/principal/${seller})`,
        };
      });
    });

    const fields = Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, field]) => field);

    return interaction.reply({
      embeds: [
        {
          color: "RED",
          title: `${set.size} groups`,
          fields,
        },
      ],
    });
  },
};
