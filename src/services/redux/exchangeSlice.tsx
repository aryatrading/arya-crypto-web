import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ExchangeStateType } from "../../types/exchange.types";
import StatusAsync from "../../utils/status-async";
import { AppState } from "./store";

const initialState: ExchangeStateType = {
    status: StatusAsync.RESOLVED,
    data:{
        selectedExchange: {
            id:"1",
            name:"Overall Portfolio",
            portfolioValue: 1400,
            portfolioChange: 0.1,
        },
        connectedExchanges: null,
        allExchanges: null,
    },
    error: null,
};

export const selectExchangeData = (state: AppState) => state.exchange.data;
export const selectSelectedExchange = createSelector([selectExchangeData], (data: ExchangeStateType["data"]) => (data.selectedExchange));


export const selectExchangeDataStatus = createSelector([(state: AppState) => state.exchange.status], (status: StatusAsync) => (status));

export const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setUsedExchange: (state: ExchangeStateType, action:{payload:any}) => {
      state.data.selectedExchange = action.payload.data.selectedExchange;
    },
  },
});

export const { setUsedExchange } = exchangeSlice.actions;

export default exchangeSlice.reducer;
