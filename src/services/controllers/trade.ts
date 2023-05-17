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

export const getAssetAvailable = async (base: string, provider: number) => {
  const { data } = await axiosInstance.get(
    `trade-engine/assets/${base}/?provider=${provider}`
  );

  return data[provider].data.free;
};

export const getAssetValidation = async (symbol: string, provider: number) => {
  const { data } = await axiosInstance.get(
    `trade-engine/symbols_rules/${symbol.toUpperCase()}?provider=${provider}`
  );

  return data;
};
