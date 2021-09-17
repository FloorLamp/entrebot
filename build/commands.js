"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorPrice = void 0;
const cache_1 = require("./cache");
const floorPrice = () => {
    let listings;
    try {
        delete require.cache[require.resolve(cache_1.LISTINGS_PATH)];
        listings = require(cache_1.LISTINGS_PATH);
    }
    catch (error) {
        console.warn("listings not found in cache");
        return;
    }
    return Math.min(...listings.map(([id, { price }]) => Number(price) / 1e8));
};
exports.floorPrice = floorPrice;
