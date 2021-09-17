"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lootDataToString = exports.decodeTokenId = exports.tokenIdentifier = exports.to32bits = exports.dateTimeFromNanos = exports.formatNumber = exports.shortAccount = exports.shortPrincipal = exports.stringify = void 0;
const principal_1 = require("@dfinity/principal");
const luxon_1 = require("luxon");
const stringify = (data) => JSON.stringify(data, (key, value) => typeof value === "bigint"
    ? value.toString()
    : value instanceof principal_1.Principal
        ? value.toText()
        : Buffer.isBuffer(value)
            ? value.toString("hex")
            : value, 2);
exports.stringify = stringify;
const shortPrincipal = (principal) => {
    const parts = (typeof principal === "string" ? principal : principal.toText()).split("-");
    return `${parts[0]}...${parts.slice(-1)[0]}`;
};
exports.shortPrincipal = shortPrincipal;
const shortAccount = (accountId) => `${accountId.slice(0, 4)}...${accountId.slice(-4)}`;
exports.shortAccount = shortAccount;
const formatNumber = (number, digits) => {
    let n = number;
    if (typeof number !== "number") {
        n = Number(n);
    }
    const maximumFractionDigits = typeof digits === "undefined" ? (number < 1 ? 8 : 4) : digits;
    return Intl.NumberFormat("en-US", {
        maximumFractionDigits,
    }).format(n);
};
exports.formatNumber = formatNumber;
const dateTimeFromNanos = (n) => luxon_1.DateTime.fromSeconds(Number(n / BigInt(1e9)));
exports.dateTimeFromNanos = dateTimeFromNanos;
const to32bits = (num) => {
    let b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);
    return Array.from(new Uint8Array(b));
};
exports.to32bits = to32bits;
const from32bits = (ba) => {
    let value = 0;
    for (let i = 0; i < 4; i++) {
        value = (value << 8) | ba[i];
    }
    return value;
};
const tokenIdentifier = (principal, index) => {
    const padding = Buffer.from("\x0Atid");
    const array = new Uint8Array([
        ...padding,
        ...principal_1.Principal.fromText(principal).toUint8Array(),
        ...(0, exports.to32bits)(index),
    ]);
    return principal_1.Principal.fromUint8Array(array).toText();
};
exports.tokenIdentifier = tokenIdentifier;
const decodeTokenId = (tid) => {
    var p = principal_1.Principal.fromText(tid).toUint8Array();
    if (Buffer.from(p.slice(0, 4)).toString("hex") !==
        Buffer.from("\x0Atid").toString("hex")) {
        return {
            index: 0,
            canister: tid,
            token: (0, exports.tokenIdentifier)(tid, 0),
        };
    }
    else {
        return {
            index: Buffer.from(p.slice(-4)).readUInt32BE(),
            canister: principal_1.Principal.fromUint8Array(p).toText(),
            token: tid,
        };
    }
};
exports.decodeTokenId = decodeTokenId;
const slotToEmoji = (slot) => {
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
const lootDataToString = (data) => `${slotToEmoji(data.slot === "weapon" ? "hand" : data.slot)} ${!!data.name_prefix ? `"${data.name_prefix}" ` : ""}${!!data.prefix ? `${data.prefix} ` : ""}${data.name}${!!data.name_suffix ? ` (${data.name_suffix})` : ""}${!!data.special ? ` 🔥` : ""}`;
exports.lootDataToString = lootDataToString;
