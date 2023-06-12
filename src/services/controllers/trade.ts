import { SwapTradeType, TradeOrder, TradeType } from "../../types/trade";
import { axiosInstance } from "../api/axiosConfig";
import { store } from "../redux/store";
import {
  addTradables,
  setHistoryOrders,
  setOrderType,
  setPairs,
  setTrade,
} from "../redux/tradeSlice";

export const initiateTrade = async (
  symbol: string,
  provider: number,
  base?: string
) => {
  store.dispatch(
    setTrade({
      asset_name: symbol ?? "btc",
      base_name: base ?? "usdt",
      available_quantity: await getAssetAvailable("USDT", provider),
    })
  );

  let _pairs = await getAvailablePairs(symbol ?? "btc", provider);

  // await getAssetOpenOrders(symbol ?? "BTC", provider);
  await getHistoryOrders(symbol ?? "BTC", provider);

  store.dispatch(addTradables({ assets: _pairs._tradables }));
  store.dispatch(setPairs({ pairs: _pairs._pairs }));

  store.dispatch(setOrderType({ orderType: "MARKET" }));
};

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

export const createTrade = async (payload: TradeType, provider: number) => {
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

export const getAvailablePairs = async (symbol: any, provider: number) => {
  const { data } = await axiosInstance.get(
    `trade-engine/symbols/?provider=${provider}`
  );

  let _tradables: string[] = [];
  let _pairs: string[] = [];

  for (var i = 0; i < data.length; i++) {
    _tradables.push(data[i].name);

    if (data[i].name.startsWith(symbol.toUpperCase())) {
      _pairs.push(data[i].name.split(symbol.toUpperCase())[1]);
    }
  }

  return { _tradables, _pairs };
};

export const getAssetOpenOrders = async (symbol: string, provider: number) => {
  return await axiosInstance.get(
    `trade-engine/orders`,
    {params:{
      provider,
      symbol,
      skip:0,
      limit:100,
      order_origin:['manual_order'],
      order_status:[0,100],
    }}
  );
  // store.dispatch(setOpenOrders({ orders: _openOrders }));
};

export const getHistoryOrders = async (symbol: string, provider: number) => {
  const { data } = await axiosInstance.get(
    `trade-engine/orders?provider=${provider}&symbol=${symbol}usdt&skip=0&limit=100&order_status=200&order_status=-100&order_status=-200&order_status=-300&order_origin=manual_order`
  );

  let _history: TradeOrder[] = [];

  for (var i = 0; i < data.length; i++) {
    let _order: TradeOrder = {
      status: data[i].order_status,
      exchange: "Binance",
      amount: data[i].order_value,
      price: data[i].executed_amount,
      createdAt: data[i].created_at,
      type: data[i]?.order_data?.side ?? "BUY",
    };
    _history.push(_order);
  }

  store.dispatch(setHistoryOrders({ orders: _history }));
};
