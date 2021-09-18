import { wrapper } from "./common";

export async function fetchRecentTransactions(count: number = 5) {
  // results are in ascending order
  const txs = await wrapper.getTransactions([BigInt(count)]);
  txs.reverse();
  return txs;
}

export async function fetchAllListings() {
  return await wrapper.listings();
}
