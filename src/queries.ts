import fs from "fs";
import { ListingsJsonData, LISTINGS_PATH } from "./cache";
import { dataJson } from "./common";
import { LootData } from "./Drip/Drip.did";

const getListings = () => {
  let listings: ListingsJsonData = [];
  try {
    listings = JSON.parse(fs.readFileSync(LISTINGS_PATH).toString());
  } catch (error) {
    console.warn("listings not found in cache");
  }

  return listings;
};

export const floorPrice = () => {
  const listings = getListings();

  return Math.min(...listings.map(([id, { price }]) => Number(price) / 1e8));
};

export const allListings = () => {
  const listings = getListings();
  return listings
    .filter(([id]) => dataJson[id])
    .map(([id, { price, seller }]) => ({
      id,
      price: Number(price) / 1e8,
      seller,
      data: dataJson[id],
    }))
    .sort((a, b) => a.price - b.price);
};

/**
 * @returns count: number of listings that matched
 */
export const searchListings = (query: string | Partial<LootData>) => {
  const listings = getListings();
  if (!listings.length) {
    return;
  }

  let re: RegExp;
  let queryEntries: [string, any][];
  if (typeof query === "string") {
    re = new RegExp(query, "i");
  } else {
    queryEntries = Object.entries(query);
  }
  const entries = Object.entries(dataJson)
    .map(([id, items]): [number, LootData[]] => {
      const filteredItems = items.filter((item) =>
        re
          ? re.test(item.name) ||
            re.test(item.name_prefix) ||
            re.test(item.prefix) ||
            re.test(item.name_suffix)
          : queryEntries.every(
              ([key, value]) => item[key as keyof LootData] === value
            )
      );
      return [Number(id), filteredItems];
    })
    .filter(([_, ls]) => ls.length > 0);

  const matches = Object.fromEntries(entries);

  return {
    count: entries.length,
    matches,
    listings: listings
      .filter(([id]) => matches[id])
      .map(([id, { price, seller }]) => ({
        id,
        price: Number(price) / 1e8,
        seller,
        data: matches[id],
      }))
      .sort((a, b) => a.price - b.price),
  };
};
