import { DateTime } from "luxon";
import dataJson from "./cache/data.json";
import { wrapper } from "./common";
import { LootData } from "./Drip/Drip.did";
import { lootDataToString, tokenIdentifier } from "./utils";
import { canisterId } from "./Wrapper";
const data = dataJson as Record<string, LootData[]>;

type Listing = {
  id: string;
  account: string;
  principal: string;
  price: number;
};

export async function fetchRecentTransactions(count: number = 5) {
  // results are in ascending order
  const txs = await wrapper.getTransactions([BigInt(count)]);
  txs.reverse();
  return txs;
}

export async function fetchAllListings() {
  return await wrapper.listings();
}

export async function fetchListings(
  query: Partial<LootData> = { name_prefix: "8 Bit" }
) {
  const queryEntries = Object.entries(query);
  const allMatches = Object.entries(data)
    .map(([id, items]: [string, LootData[]]) => [
      id,
      items.filter((item) => {
        if (
          queryEntries.every(
            ([key, value]) => item[key as keyof LootData] === value
          )
        ) {
          return item;
        }
      }),
    ])
    .filter(([_, ls]) => ls.length > 0) as [string, LootData[]][];
  if (!allMatches.length) {
    return;
  }

  console.log(
    allMatches.map(([id, ds]) => `${id} - ${ds.map(lootDataToString)}`)
  );
  console.log(`${allMatches.length} matches`);

  const now = DateTime.utc().toISO();
  const results = await Promise.all(
    allMatches.map(([id]) => {
      const tokenId = tokenIdentifier(canisterId, Number(id));
      return wrapper.details(tokenId);
    })
  );

  const parsed = (
    results.map((res, i) => {
      if ("ok" in res) {
        const listing = res.ok[1][0];
        if (listing) {
          const id = allMatches[i][0];
          return {
            id,
            data: data[id].map(lootDataToString),
            account: res.ok[0],
            principal: listing.seller.toText(),
            price: Number(listing.price) / 1e8,
          };
        }
      }
    }) as Listing[]
  )
    .filter(Boolean)
    .sort((a, b) => a.price - b.price);
  console.log(parsed);

  return {
    now,
    results: parsed,
  };
}
