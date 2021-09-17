import { Principal } from "@dfinity/principal";
import { TextChannel } from "discord.js";
import fs from "fs";
import dataJson from "./cache/data.json";
import { LootData } from "./Drip/Drip.did";
import { fetchRecentTransactions } from "./fetchData";
import {
  dateTimeFromNanos,
  decodeTokenId,
  lootDataToString,
  shortAccount,
  shortPrincipal,
  stringify,
} from "./utils";
import { Transaction } from "./Wrapper/Wrapper.did";
const data = dataJson as Record<string, LootData[]>;

export type MapType<T, A, B> = {
  [Key in keyof T]: T[Key] extends A
    ? B
    : T[Key] extends Record<any, any>
    ? MapType<T[Key], A, B>
    : T[Key];
};
export type JsonData = MapType<
  MapType<Data, Principal, string>,
  bigint,
  string
>;
export type Data = {
  now: string;
  data: Transaction[];
};

const SNAPSHOT_PATH = `${__dirname}/cache/transactions.json`;

export async function saveData(channel: TextChannel) {
  let txs: Data;
  try {
    txs = await fetchRecentTransactions();
  } catch (error) {
    console.error(error);
    return;
  }

  let cached: JsonData;
  try {
    delete require.cache[require.resolve(SNAPSHOT_PATH)];
    cached = require(SNAPSHOT_PATH);
  } catch (error) {}
  fs.writeFileSync(SNAPSHOT_PATH, stringify(txs));
  console.log(`snapshot saved at ${txs.now}`);

  const d = txs.data[0];
  const { index } = decodeTokenId(d.token);
  const lootData = data[index.toString()];

  txs.data.forEach((d, i) => {
    if (!cached) {
      return;
    }
    if (cached.data.find((prev) => prev.time === d.time.toString())) {
      return;
    }
    const { index } = decodeTokenId(d.token);
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
          \`\`\`${lootData.map(lootDataToString).join("\n")}\`\`\`
          `,
          timestamp: dateTimeFromNanos(d.time).toJSDate(),
        },
      ],
    });
  });
}
