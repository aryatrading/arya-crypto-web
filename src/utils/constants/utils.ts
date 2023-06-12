export enum EnumEntityNames {
  order = "order",
  trade = "trade",
}

export const exchangeMapper = (provider: number) => {
  if (provider === 1) return "Binance";
  if (provider === 2) return "Coinbase";
  return "Not found";
};
