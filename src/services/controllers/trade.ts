import { SwapTradeType, TradeOrder, TradeType } from "../../types/trade";
import { exchangeMapper } from "../../utils/constants/utils";
import { axiosInstance } from "../api/axiosConfig";
import { store } from "../redux/store";
import {
  addStoploss,
  addTakeProfit,
  addTradables,
  addTrailing,
  clearOrder,
  setAssetPrice,
  setHistoryOrders,
  setOpenOrders,
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

  await getAssetOpenOrders(`${symbol ?? "BTC"}${base ?? "USDT"}`, provider);
  await getHistoryOrders(symbol ?? "BTC", provider);
  await getAssetCurrentPrice(symbol ?? "BTC");

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

export const getAssetCurrentPrice = async (asset_name: string) => {
  const { data } = await axiosInstance.get(
    `utils/asset-details?asset_name=${asset_name}`
  );

  store.dispatch(setAssetPrice({ price: data.asset_data?.current_price }));
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
  const { data } = await axiosInstance.get(
    `trade-engine/orders?provider=${provider}&skip=0&limit=100&symbol=${symbol}&order_origin=manual_order&order_status=0&order_status=100`
  );

  let _orders = [];

  store.dispatch(clearOrder());

  for (var i = 0; i < data.length; i++) {
    _orders.push({
      id: data[i]?.id,
      provider_id: data[i]?.order_provider,
      status: "Placed",
      type: data[i]?.order_data?.side ?? "SELL",
      amount: data[i]?.quantity,
      price: data[i]?.order_value,
      createdAt: data[i]?.created_at,
    });

    // console.log(data[i]);
    if (data[i]?.type === "SL") {
      store.dispatch(
        addStoploss({
          order_id: data[i]?.id,
          value: data[i]?.order_value,
          quantity: data[i]?.quantity,
        })
      );
    }

    if (data[i]?.type === "TP") {
      store.dispatch(
        addTakeProfit({
          order_id: data[i]?.id,
          value: data[i]?.order_value,
          quantity: data[i]?.quantity,
        })
      );
    }

    if (data[i]?.type === "T_SL") {
      store.dispatch(
        addTrailing({
          order_id: data[i]?.id,
          trigger_value: data[i]?.order_data?.activation_price,
        })
      );
    }
  }

  store.dispatch(setOpenOrders({ orders: _orders }));
};

export const getHistoryOrders = async (symbol: string, provider: number) => {
  const { data } = await axiosInstance.get(
    `trade-engine/orders?provider=${provider}&symbol=${symbol}usdt&skip=0&limit=100&order_status=200&order_status=-100&order_status=-200&order_status=-300&order_origin=manual_order`
  );

  let _history: TradeOrder[] = [];

  for (var i = 0; i < data.length; i++) {
    let _provider = data[i]?.order_provider;

    let _order: TradeOrder = {
      status: data[i].order_status,
      exchange: exchangeMapper(_provider),
      amount: data[i].quantity,
      price: data[i].order_value,
      createdAt: data[i].created_at,
      type: data[i]?.order_data?.side ?? "BUY",
    };
    _history.push(_order);
  }

  store.dispatch(setHistoryOrders({ orders: _history }));
};

export const cancelOpenOrder = async (orderId: number, provider: number) => {
  const { data } = await axiosInstance.put(
    `trade-engine/cancel?order_id=${orderId}&provider=${provider}`
  );

  return data;
};
