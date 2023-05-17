import { createSlice } from "@reduxjs/toolkit";
import { ProfitsType, TradeType, TradeValidations } from "../../types/trade";
import { AppState } from "./store";

interface initialStateType {
  trade: TradeType;
  validations?: TradeValidations;
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
};

export const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    setTrade: (state, action: { payload: any }) => {
      state.trade.asset_name = action.payload?.asset_name.toUpperCase();
      state.trade.base_name = action.payload.base_name.toUpperCase();
      state.trade.symbol_name =
        `${action.payload.asset_name}${action.payload.base_name}`.toUpperCase();
      state.trade.available_quantity = action.payload?.available_quantity ?? 0;
    },
    setSide: (state, action: { payload: { side: string } }) => {
      state.trade.entry_order = {
        type: action.payload.side,
      };
    },
    setOrderType: (state, action: { payload: { orderType: string } }) => {
      state.trade.entry_order = {
        order_type: action.payload.orderType,
        trigger_price: 0,
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
    removeStoploss: (satte) => {
      satte.trade.stop_loss = [];
    },
    addTakeProfit: (state, action: { payload: ProfitsType }) => {
      // state.trade.take_profit = state.trade.take_profit?.push(action.payload);
    },
    clearTrade: (state) => {
      state.trade.symbol_name = "BTCUSDT";
      state.trade.asset_name = "BTC";
      state.trade.base_name = "USDT";
      state.trade.available_quantity = 0;
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
} = tradeSlice.actions;

export const getTrade = (state: AppState) => state.trade.trade;
export const getValidations = (state: AppState) => state.trade.validations;

export default tradeSlice.reducer;
