import { createSlice } from "@reduxjs/toolkit";
import { AssetType } from "../../types/asset";
import { AppState } from "./store";

interface initialStateType {
  asset: AssetType;
  timeseries: [];
  assetHolding: [];
  orders: [];
}

const initialState: initialStateType = {
  asset: {},
  timeseries: [],
  assetHolding: [],
  orders: [],
};

export const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    setAsset: (state, action: { payload: AssetType }) => {
      state.asset = action.payload;
    },
    setTimesseries: (state, action: { payload: any }) => {
      state.timeseries = action.payload;
    },
    setAssetHolding: (state, action: { payload: any }) => {
      state.assetHolding = action.payload;
    },
    setOrders: (state, action: { payload: any }) => {
      state.orders = action.payload;
    },
    clearAsset: (state) => {
      state.asset = {};
      state.timeseries = [];
      state.assetHolding = [];
    },
  },
});

export const {
  setAsset,
  setTimesseries,
  setAssetHolding,
  setOrders,
  clearAsset,
} = assetSlice.actions;

export const getAsset = (state: AppState) => state.asset.asset;
export const getAssetTimeseries = (state: AppState) => state.asset.timeseries;
export const getAssetHolding = (state: AppState) => state.asset.assetHolding;
export const getOrders = (state: AppState) => state.asset.orders;

export default assetSlice.reducer;
