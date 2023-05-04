import { createSlice } from "@reduxjs/toolkit";
import { AssetType } from "../../types/asset";
import { AppState } from "./store";

interface initialStateType {
  asset: AssetType;
  timeseries: [];
}

const initialState: initialStateType = {
  asset: {},
  timeseries: [],
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
    clearAsset: (state) => {
      state.asset = {};
      state.timeseries = [];
    },
  },
});

export const { setAsset, setTimesseries, clearAsset } = assetSlice.actions;

export const getAsset = (state: AppState) => state.asset.asset;
export const getAssetTimeseries = (state: AppState) => state.asset.timeseries;

export default assetSlice.reducer;
