"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveData = void 0;
const fs_1 = __importDefault(require("fs"));
const data_json_1 = __importDefault(require("./cache/data.json"));
const fetchData_1 = require("./fetchData");
const utils_1 = require("./utils");
const data = data_json_1.default;
const SNAPSHOT_PATH = `${__dirname}/cache/transactions.json`;
async function saveData(channel) {
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
        delete require.cache[require.resolve(SNAPSHOT_PATH)];
        cached = require(SNAPSHOT_PATH);
    }
    catch (error) { }
    fs_1.default.writeFileSync(SNAPSHOT_PATH, (0, utils_1.stringify)(txs));
    console.log(`snapshot saved at ${txs.now}`);
    const d = txs.data[0];
    const { index } = (0, utils_1.decodeTokenId)(d.token);
    const lootData = data[index.toString()];
    txs.data.forEach((d, i) => {
        if (!cached) {
            return;
        }
        if (cached.data.find((prev) => prev.time === d.time.toString())) {
            return;
        }
        const { index } = (0, utils_1.decodeTokenId)(d.token);
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
exports.saveData = saveData;
