import { instance } from "../api";

export const getTrades = async (symbol: string, providerId: string) => {
  // TODO: read providerId from state
  try {
    let trades = await instance.get(
      `/trade-engine/orders/open/?provider=${providerId}&symbol=${symbol}`
    );
    console.log(trades);
  } catch (error: any) {
    console.log(error);
  }
};
