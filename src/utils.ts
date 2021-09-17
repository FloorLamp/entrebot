import { Principal } from "@dfinity/principal";
import { DateTime } from "luxon";
import { LootData } from "./Drip/Drip.did";

export const stringify = (data: any) =>
  JSON.stringify(
    data,
    (key, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value instanceof Principal
        ? value.toText()
        : Buffer.isBuffer(value)
        ? value.toString("hex")
        : value,
    2
  );

export const shortPrincipal = (principal: string | Principal) => {
  const parts = (
    typeof principal === "string" ? principal : principal.toText()
  ).split("-");
  return `${parts[0]}...${parts.slice(-1)[0]}`;
};

export const shortAccount = (accountId: string) =>
  `${accountId.slice(0, 4)}...${accountId.slice(-4)}`;

export const formatNumber = (number: any, digits?: number) => {
  let n = number;
  if (typeof number !== "number") {
    n = Number(n);
  }
  const maximumFractionDigits =
    typeof digits === "undefined" ? (number < 1 ? 8 : 4) : digits;
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(n);
};

export const dateTimeFromNanos = (n: bigint) =>
  DateTime.fromSeconds(Number(n / BigInt(1e9)));

export const to32bits = (num: number) => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

const from32bits = (ba: number[]) => {
  let value = 0;
  for (let i = 0; i < 4; i++) {
    value = (value << 8) | ba[i];
  }
  return value;
};

export const tokenIdentifier = (principal: string, index: number) => {
  const padding = Buffer.from("\x0Atid");

  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principal).toUint8Array(),
    ...to32bits(index),
  ]);
  return Principal.fromUint8Array(array).toText();
};

export const decodeTokenId = (tid: string) => {
  var p = Principal.fromText(tid).toUint8Array();
  if (
    Buffer.from(p.slice(0, 4)).toString("hex") !==
    Buffer.from("\x0Atid").toString("hex")
  ) {
    return {
      index: 0,
      canister: tid,
      token: tokenIdentifier(tid, 0),
    };
  } else {
    return {
      index: Buffer.from(p.slice(-4)).readUInt32BE(),
      canister: Principal.fromUint8Array(p).toText(),
      token: tid,
    };
  }
};

const slotToEmoji = (slot: string) => {
  switch (slot) {
    case "hand":
      return "👋";
    case "chest":
      return "👕";
    case "head":
      return "🧢";
    case "waist":
      return "🪢";
    case "foot":
      return "👟";
    case "pants":
      return "👖";
    case "underwear":
      return "🩲";
    case "accessory":
      return "💍";
    default:
      return slot;
  }
};

export const lootDataToString = (data: LootData) =>
  `${slotToEmoji(data.slot === "weapon" ? "hand" : data.slot)} ${
    !!data.name_prefix ? `"${data.name_prefix}" ` : ""
  }${!!data.prefix ? `${data.prefix} ` : ""}${data.name}${
    !!data.name_suffix ? ` (${data.name_suffix})` : ""
  }${!!data.special ? ` 🔥` : ""}`;
