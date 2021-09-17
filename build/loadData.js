"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const common_1 = require("./common");
async function loadData() {
    const data = {};
    let start = 0;
    const page = 1001;
    while (start < 8001) {
        const res = await common_1.drip.data_of_many({
            Range: [BigInt(start), BigInt(start + page)],
        });
        res.forEach(([id, loot]) => {
            data[id.toString()] = loot;
        });
        start += page;
    }
    fs_1.default.writeFileSync("./data.json", JSON.stringify(data));
    console.log(`wrote ${Object.keys(data).length} entries`);
}
loadData();
