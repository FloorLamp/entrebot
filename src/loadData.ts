import fs from "fs";
import { drip } from "./common";
import { LootData } from "./Drip/Drip.did";

async function loadData() {
  const data: Record<string, LootData[]> = {};
  let start = 0;
  const page = 1001;
  while (start < 8001) {
    const res = await drip.data_of_many({
      Range: [BigInt(start), BigInt(start + page)],
    });
    res.forEach(([id, loot]) => {
      data[id.toString()] = loot;
    });
    start += page;
  }

  fs.writeFileSync("./data.json", JSON.stringify(data));
  console.log(`wrote ${Object.keys(data).length} entries`);
}

loadData();
