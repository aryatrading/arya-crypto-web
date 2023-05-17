import { createSlice } from "@reduxjs/toolkit";
import { TradeType } from "../../types/trade";
import { AppState } from "./store";

interface initialStateType {
  trade: TradeType;
}

const initialState: initialStateType = {
  trade: {
    // TRADE DEFAULT VALUES
    symbol_name: "BTCUSDT",
    asset_name: "BTC",
    base_name: "USDT",
    available_quantity: 0,
  },
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
    clearTrade: (state) => {
      state.trade.symbol_name = "BTCUSDT";
      state.trade.asset_name = "BTC";
      state.trade.base_name = "USDT";
      state.trade.available_quantity = 0;
    },
  },
});

export const { setTrade, clearTrade, setSide } = tradeSlice.actions;

export const getTrade = (state: AppState) => state.trade.trade;

export default tradeSlice.reducer;
