import { LootData } from "../Drip/Drip.did";
import { searchListings } from "../queries";
import { lootDataToString } from "../utils";

async function filterItems(query: Partial<LootData>) {
  const res = searchListings(query);
  if (!res) {
    return;
  }
  const { matches, listings } = res;
  const entries = Object.entries(matches);
  if (!entries.length) {
    return;
  }

  console.log(`${entries.length} matches`);
  const uniqueItems = [
    ...new Set(
      entries.flatMap(([id, ds]) => ds.map((ld) => `${ld.slot} - ${ld.name}`))
    ),
  ].sort();
  console.log(uniqueItems.join("\n"));
  console.log(`${uniqueItems.length} unique base items`);

  console.log(
    listings
      .map(
        ({ id, price, data }) =>
          `${id} - ${price} ICP\n${data.map(lootDataToString).join("\n")}`
      )
      .join("\n\n")
  );
}

filterItems({ name_suffix: "Wet" });
