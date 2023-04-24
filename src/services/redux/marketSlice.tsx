import { createSlice } from "@reduxjs/toolkit";
import { AssetType } from "../../types/asset";
import { AppState } from "./store";

interface initialStateType {
  marketAssets: AssetType[];
  assetliveprice: any;
}

const initialState: initialStateType = {
  assetliveprice: {},
  marketAssets: [],
};

export const marketSlice = createSlice({
  name: "maket",
  initialState,
  reducers: {
    storeMrkAssets: (state, action: { payload: AssetType[] }) => {
      state.marketAssets = action.payload;
    },
    pricechange: (state, action) => {
      state.assetliveprice = {
        ...state.assetliveprice,
        [action.payload.symbol]: action.payload.price,
      };
    },
  },
});

export const { storeMrkAssets, pricechange } = marketSlice.actions;

export const getMarketAssets = (state: AppState) => state.market.marketAssets;

export default marketSlice.reducer;
