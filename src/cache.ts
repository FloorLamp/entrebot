import { Principal } from "@dfinity/principal";
import { TextChannel } from "discord.js";
import fs from "fs";
import { DateTime } from "luxon";
import dataJson from "./cache/data.json";
import { LootData } from "./Drip/Drip.did";
import { fetchAllListings, fetchRecentTransactions } from "./fetchData";
import { Awaited, MapType } from "./types";
import {
  dateTimeFromNanos,
  decodeTokenId,
  lootDataToString,
  shortAccount,
  shortPrincipal,
  stringify,
} from "./utils";
import { Transaction, _SERVICE } from "./Wrapper/Wrapper.did";
const data = dataJson as Record<string, LootData[]>;

export type JsonTransactionData = MapType<
  MapType<TransactionData, Principal, string>,
  bigint,
  string
>;
export type TransactionData = Transaction[];
export type ListingsData = Awaited<ReturnType<_SERVICE["listings"]>>;
export type ListingsJsonData = MapType<
  MapType<ListingsData, Principal, string>,
  bigint,
  string
>;

export const TRANSACTIONS_PATH = `${__dirname}/cache/transactions.json`;
export const LISTINGS_PATH = `${__dirname}/cache/listings.json`;

export async function saveListings() {
  const now = DateTime.utc().toISO();
  let txs: ListingsData;
  try {
    txs = await fetchAllListings();
  } catch (error) {
    console.error(error);
    return;
  }
  fs.writeFileSync(LISTINGS_PATH, stringify(txs));
  console.log(`listings saved at ${now}`);
  return txs.length;
}

export async function saveTransactions(channel: TextChannel) {
  const now = DateTime.utc().toISO();
  let txs: Transaction[];
  try {
    txs = await fetchRecentTransactions();
  } catch (error) {
    console.error(error);
    return;
  }

  let cached: JsonTransactionData;
  try {
    delete require.cache[require.resolve(TRANSACTIONS_PATH)];
    cached = require(TRANSACTIONS_PATH);
  } catch (error) {}
  fs.writeFileSync(TRANSACTIONS_PATH, stringify(txs));
  console.log(`transactions saved at ${now}`);

  txs.forEach((d, i) => {
    if (!cached) {
      return;
    }
    if (cached.find((prev) => prev.time === d.time.toString())) {
      return;
    }
    const { index } = decodeTokenId(d.token);
    const lootData = data[index.toString()];
    console.log("new tx", index, d);
    channel.send({
      embeds: [
        {
          color: "GREEN",
          title: "New Sale",
          description: `Drip ${index} was bought for ${
            Number(d.price) / 1e8
          } ICP by [${shortAccount(d.buyer)}](https://ic.rocks/account/${
            d.buyer
          }) from [${shortPrincipal(d.seller)}](https://ic.rocks/principal/${
            d.seller
          })
\`\`\`${lootData.map(lootDataToString).join("\n")}\`\`\``,
          timestamp: dateTimeFromNanos(d.time).toJSDate(),
        },
      ],
    });
  });
}
