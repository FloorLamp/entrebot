"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchListings = exports.fetchAllListings = exports.fetchRecentTransactions = void 0;
const luxon_1 = require("luxon");
const data_json_1 = __importDefault(require("./cache/data.json"));
const common_1 = require("./common");
const utils_1 = require("./utils");
const Wrapper_1 = require("./Wrapper");
const data = data_json_1.default;
async function fetchRecentTransactions(count = 5) {
    // results are in ascending order
    const txs = await common_1.wrapper.getTransactions([BigInt(count)]);
    txs.reverse();
    return txs;
}
exports.fetchRecentTransactions = fetchRecentTransactions;
async function fetchAllListings() {
    return await common_1.wrapper.listings();
}
exports.fetchAllListings = fetchAllListings;
async function fetchListings(query = { name_prefix: "8 Bit" }) {
    const queryEntries = Object.entries(query);
    const allMatches = Object.entries(data)
        .map(([id, items]) => [
        id,
        items.filter((item) => {
            if (queryEntries.every(([key, value]) => item[key] === value)) {
                return item;
            }
        }),
    ])
        .filter(([_, ls]) => ls.length > 0);
    if (!allMatches.length) {
        return;
    }
    console.log(allMatches.map(([id, ds]) => `${id} - ${ds.map(utils_1.lootDataToString)}`));
    console.log(`${allMatches.length} matches`);
    const now = luxon_1.DateTime.utc().toISO();
    const results = await Promise.all(allMatches.map(([id]) => {
        const tokenId = (0, utils_1.tokenIdentifier)(Wrapper_1.canisterId, Number(id));
        return common_1.wrapper.details(tokenId);
    }));
    const parsed = results.map((res, i) => {
        if ("ok" in res) {
            const listing = res.ok[1][0];
            if (listing) {
                const id = allMatches[i][0];
                return {
                    id,
                    data: data[id].map(utils_1.lootDataToString),
                    account: res.ok[0],
                    principal: listing.seller.toText(),
                    price: Number(listing.price) / 1e8,
                };
            }
        }
    })
        .filter(Boolean)
        .sort((a, b) => a.price - b.price);
    console.log(parsed);
    return {
        now,
        results: parsed,
    };
}
exports.fetchListings = fetchListings;
