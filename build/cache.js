"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTransactions = exports.saveListings = exports.LISTINGS_PATH = exports.TRANSACTIONS_PATH = void 0;
const fs_1 = __importDefault(require("fs"));
const luxon_1 = require("luxon");
const data_json_1 = __importDefault(require("./cache/data.json"));
const fetchData_1 = require("./fetchData");
const utils_1 = require("./utils");
const data = data_json_1.default;
exports.TRANSACTIONS_PATH = `${__dirname}/cache/transactions.json`;
exports.LISTINGS_PATH = `${__dirname}/cache/listings.json`;
async function saveListings() {
    const now = luxon_1.DateTime.utc().toISO();
    let txs;
    try {
        txs = await (0, fetchData_1.fetchAllListings)();
    }
    catch (error) {
        console.error(error);
        return;
    }
    fs_1.default.writeFileSync(exports.LISTINGS_PATH, (0, utils_1.stringify)(txs));
    console.log(`listings saved at ${now}`);
    return txs.length;
}
exports.saveListings = saveListings;
async function saveTransactions(channel) {
    const now = luxon_1.DateTime.utc().toISO();
    let txs;
    try {
        txs = await (0, fetchData_1.fetchRecentTransactions)();
    }
    catch (error) {
        console.error(error);
        return;
    }
    let cached;
    try {
        delete require.cache[require.resolve(exports.TRANSACTIONS_PATH)];
        cached = require(exports.TRANSACTIONS_PATH);
    }
    catch (error) { }
    fs_1.default.writeFileSync(exports.TRANSACTIONS_PATH, (0, utils_1.stringify)(txs));
    console.log(`transactions saved at ${now}`);
    txs.forEach((d, i) => {
        if (!cached) {
            return;
        }
        if (cached.find((prev) => prev.time === d.time.toString())) {
            return;
        }
        const { index } = (0, utils_1.decodeTokenId)(d.token);
        const lootData = data[index.toString()];
        console.log("new tx", index, d);
        channel.send({
            embeds: [
                {
                    color: "GREEN",
                    title: "New Sale",
                    description: `Drip ${index} was bought for ${Number(d.price) / 1e8} ICP by [${(0, utils_1.shortAccount)(d.buyer)}](https://ic.rocks/account/${d.buyer}) from [${(0, utils_1.shortPrincipal)(d.seller)}](https://ic.rocks/principal/${d.seller})
          \`\`\`${lootData.map(utils_1.lootDataToString).join("\n")}\`\`\`
          `,
                    timestamp: (0, utils_1.dateTimeFromNanos)(d.time).toJSDate(),
                },
            ],
        });
    });
}
exports.saveTransactions = saveTransactions;
