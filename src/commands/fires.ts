import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { searchListings } from "../queries";
import { lootDataToString, shortPrincipal } from "../utils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fires")
    .setDescription("Get prices for 🔥 items"),
  async execute(interaction: CommandInteraction) {
    const res = searchListings({ special: true });
    if (!res) {
      return;
    }
    const { count, listings } = res;
    if (!listings.length) {
      return;
    }

    const listingsByFires = Array(4)
      .fill(0)
      .map((_, n) => {
        return listings.find(({ data }) => {
          return data.filter(({ special }) => special).length === n + 1;
        });
      });

    const description = listingsByFires
      .map((d, n): string => {
        const name = Array(n + 1)
          .fill("🔥")
          .join("");

        return d
          ? `${name} | **${d.price} ICP** by [${shortPrincipal(
              d.seller
            )}](https://ic.rocks/principal/${d.seller})
\`\`\`
Drip ${d.id}
${d.data.map(lootDataToString).join("\n")}
\`\`\``
          : "n/a";
      })
      .join("\n");

    return interaction.reply({
      embeds: [
        {
          color: "PURPLE",
          title: `${listings.length} 🔥 items listed | ${count} total`,
          description,
        },
      ],
    });
  },
};
