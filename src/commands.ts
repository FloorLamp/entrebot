import { ListingsJsonData, LISTINGS_PATH } from "./cache";

export const floorPrice = () => {
  let listings: ListingsJsonData;
  try {
    delete require.cache[require.resolve(LISTINGS_PATH)];
    listings = require(LISTINGS_PATH);
  } catch (error) {
    console.warn("listings not found in cache");
    return;
  }

  return Math.min(...listings.map(([id, { price }]) => Number(price) / 1e8));
};
