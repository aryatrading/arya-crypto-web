import { createSelector, createSlice } from "@reduxjs/toolkit";
import { AssetType } from "../../types/asset";
import { AppState } from "./store";

interface initialStateType {
  marketAssets: AssetType[];
  assetLivePrice: any;
}

const initialState: initialStateType = {
  assetLivePrice: {},
  marketAssets: [],
};

const selectMarketData = (state: AppState) => state.market;

export const selectMarketAssets = createSelector([selectMarketData], (data) => {
  return data.marketAssets;
});
export const selectAssetLivePrice = createSelector(
  [selectMarketData],
  (data) => data.assetLivePrice
);

export const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    storeMrkAssets: (state, action: { payload: AssetType[] }) => {
      state.marketAssets = action.payload;
    },
    pricechange: (state, action) => {
      const { symbol, price } = action.payload;
      state.assetLivePrice = {
        ...state.assetLivePrice,
        [symbol]: price,
      };
    },
    clearLiveData: (state) => {
      state.assetLivePrice = {};
    },
  },
});

export const { storeMrkAssets, pricechange, clearLiveData } =
  marketSlice.actions;

export default marketSlice.reducer;
