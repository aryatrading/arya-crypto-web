import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ExchangeStateType, ExchangeType } from "../../types/exchange.types";
import StatusAsync from "../../utils/status-async";
import { AppState } from "./store";

const initialState: ExchangeStateType = {
  status: StatusAsync.PENDING,
  data: {
    selectedExchange: null,
    connectedExchanges: [],
  },
  error: null,
};

export const selectExchangeData = (state: AppState) => state.exchange?.data;
export const selectSelectedExchange = createSelector([selectExchangeData], (data: ExchangeStateType["data"]) => (data?.selectedExchange));
export const selectConnectedExchanges = createSelector([selectExchangeData], (data: ExchangeStateType["data"]) => (data?.connectedExchanges));


export const selectExchangeStoreStatus = createSelector([(state: AppState) => state.exchange?.status], (status: StatusAsync) => (status));

export const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setExchangeStoreAsyncStatus: (state: ExchangeStateType, action: { payload: StatusAsync }) => {
      state.status = action.payload;
    },
    setExchangeStoreError: (state: ExchangeStateType, action: { payload: Error | null }) => {
      state.error = action.payload;
    },
    setConnectedExchanges: (state: ExchangeStateType, action: { payload: ExchangeType[] }) => {
      state.data.connectedExchanges = action.payload;
    },
    setSelectedExchange: (state: ExchangeStateType, action: { payload: ExchangeType }) => {
      state.data.selectedExchange = action.payload;
    },
  },
});

export const { setExchangeStoreError, setSelectedExchange, setConnectedExchanges, setExchangeStoreAsyncStatus } = exchangeSlice.actions;

export default exchangeSlice.reducer;
