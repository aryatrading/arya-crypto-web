import { createSlice } from "@reduxjs/toolkit";
import {
  ProfitsType,
  TradeOrder,
  TradeType,
  TradeValidations,
  TrailingType,
} from "../../types/trade";
import { AppState } from "./store";

interface initialStateType {
  trade: TradeType;
  validations?: TradeValidations;
  pairs?: string[];
  tradeableAsset?: string[];
  tradeFilter: string;
  openOrders?: TradeOrder[];
  historyOrders?: TradeOrder[];
  assetPrice?: number;
}

const initialState: initialStateType = {
  trade: {
    // TRADE DEFAULT VALUES
    symbol_name: "BTCUSDT",
    asset_name: "BTC",
    base_name: "USDT",
    available_quantity: 0,
  },
  validations: {},
  pairs: [],
  tradeableAsset: [],
  tradeFilter: "USDT",
  openOrders: [],
  historyOrders: [],
  assetPrice: 0,
};

export const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    setTrade: (state, action: { payload: any }) => {
      state.trade.asset_name = action.payload?.asset_name
        .toUpperCase()
        .replace("-", "");
      state.trade.base_name = action.payload.base_name
        .toUpperCase()
        .replace("-", "");
      state.trade.symbol_name =
        `${action.payload.asset_name}${action.payload.base_name}`
          .toUpperCase()
          .replace("-", "");
      state.trade.available_quantity = action.payload?.available_quantity ?? 0;
      state.trade.entry_order = {
        trigger_price: 0,
        type: "BUY",
        order_type: "MARKET",
        price_based: true,
      };
    },
    setFilter: (state, action: { payload: { filter: string } }) => {
      state.tradeFilter = action.payload.filter;
    },
    setSide: (state, action: { payload: { side: string } }) => {
      state.trade.entry_order = {
        ...state.trade.entry_order,
        type: action.payload.side,
      };
    },
    setOrderType: (state, action: { payload: { orderType: string } }) => {
      state.trade.entry_order = {
        ...state.trade.entry_order,
        order_type: action.payload.orderType,
      };
    },
    setTriggerPrice: (state, action: { payload: { price: any } }) => {
      state.trade.entry_order = {
        ...state.trade.entry_order,
        trigger_price: action.payload.price,
      };
    },
    setQuantity: (state, action: { payload: { quantity: any } }) => {
      state.trade.entry_order = {
        ...state.trade.entry_order,
        quantity: action.payload.quantity,
      };
    },
    setPrice: (state, action: { payload: { price: number } }) => {
      state.trade.entry_order = {
        ...state.trade.entry_order,
        price: action.payload.price,
        price_based: true,
      };
    },
    setValidations: (state, action: { payload: TradeValidations }) => {
      state.validations = action.payload;
      state.trade.entry_order = {
        ...state.trade.entry_order,
        quantity: action.payload.min_qty,
        price: action.payload.min_price,
      };
    },
    addStoploss: (state, action: { payload: ProfitsType }) => {
      state.trade.stop_loss = [action.payload];
    },
    addTrailing: (state, action: { payload: TrailingType }) => {
      state.trade.trailing_stop_loss = [action.payload];
    },
    removeTrailing: (state) => {
      state.trade.trailing_stop_loss = [];
    },
    removeStoploss: (satte) => {
      satte.trade.stop_loss = [];
    },
    addTakeProfit: (state, action: { payload: any }) => {
      state.trade.take_profit = [
        ...(state.trade.take_profit ?? []),
        action.payload,
      ];
    },
    setTakeProfit: (state, action: { payload: any }) => {
      state.trade.take_profit = action.payload;
    },
    setPairs: (state, action: { payload: { pairs: string[] } }) => {
      state.pairs = action.payload.pairs;
      state.tradeFilter = action.payload.pairs[0];
    },
    addTradables: (state, action: { payload: { assets: string[] } }) => {
      state.tradeableAsset = action.payload.assets;
    },
    setOpenOrders: (state, action: { payload: { orders: TradeOrder[] } }) => {
      state.openOrders = action.payload.orders;
    },
    setHistoryOrders: (
      state,
      action: { payload: { orders: TradeOrder[] } }
    ) => {
      state.historyOrders = action.payload.orders;
    },
    setAssetPrice: (state, action: { payload: { price: number } }) => {
      state.assetPrice = action.payload.price;
    },
    clearTrade: (state) => {
      state.trade.symbol_name = "BTCUSDT";
      state.trade.asset_name = "BTC";
      state.trade.base_name = "USDT";
      state.trade.available_quantity = 0;
      state.openOrders = [];
      state.validations = {};
      state.historyOrders = [];
      state.trade.entry_order = {};
      state.trade.stop_loss = [];
      state.trade.take_profit = [];
      state.trade.trailing_stop_loss = [];
    },
    clearOrder: (state) => {
      state.trade.stop_loss = [];
      state.trade.take_profit = [];
      state.trade.trailing_stop_loss = [];
    },
  },
});

export const {
  setTrade,
  clearTrade,
  setSide,
  setOrderType,
  setValidations,
  addStoploss,
  removeStoploss,
  addTakeProfit,
  setTakeProfit,
  setPairs,
  addTradables,
  setFilter,
  setTriggerPrice,
  setQuantity,
  setOpenOrders,
  setPrice,
  setHistoryOrders,
  setAssetPrice,
  addTrailing,
  removeTrailing,
  clearOrder,
} = tradeSlice.actions;

export const getTrade = (state: AppState) => state.trade.trade;
export const getValidations = (state: AppState) => state.trade.validations;

export const getPairs = (state: AppState) => state.trade.pairs;
export const getFilter = (state: AppState) => state.trade.tradeFilter;
export const getTradedAssets = (state: AppState) => state.trade.tradeableAsset;
export const getOpenOrders = (state: AppState) => state.trade.openOrders;
export const getHistoryOrders = (state: AppState) => state.trade.historyOrders;
export const getAssetPrice = (state: AppState) => state.trade.assetPrice;

export default tradeSlice.reducer;
