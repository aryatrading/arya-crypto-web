import { SwapTradeType } from "../../types/trade";
import { axiosInstance } from "../api/axiosConfig";

export const createSwapTrade = async (
  payload: SwapTradeType,
  provider: number
) => {
  const { data } = await axiosInstance.post(
    `trade-engine/order?provider=${provider}`,
    payload
  );

  return data;
};
