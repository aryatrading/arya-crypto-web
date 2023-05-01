import { createSlice } from "@reduxjs/toolkit";
import { AssetType } from "../../types/asset";
import { AppState } from "./store";

interface initialStateType {
  asset: AssetType;
}

const initialState: initialStateType = {
  asset: {},
};

export const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    setAsset: (state, action: { payload: AssetType }) => {
      state.asset = action.payload;
    },
    clearAsset: (state) => {
      state.asset = {};
    },
  },
});

export const { setAsset, clearAsset } = assetSlice.actions;

export const getAsset = (state: AppState) => state.asset.asset;

export default assetSlice.reducer;
