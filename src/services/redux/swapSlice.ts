import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { AssetSwapType } from "../../types/asset";

interface initialStateType {
  provider?: number | null;
  from: AssetSwapType;
  to: AssetSwapType;
}

const initialState: initialStateType = {
  provider: null,
  from: {},
  to: {},
};

export const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    setFrom: (state, action: { payload: AssetSwapType }) => {
      state.from = action.payload;
    },
    setTo: (state, action: { payload: AssetSwapType }) => {
      state.to = action.payload;
    },
    swap: (
      state,
      action: { payload: { from: AssetSwapType; to: AssetSwapType } }
    ) => {
      state.from = action.payload.from;
      state.to = action.payload.to;
    },
    setProvider: (state, action: { payload: number }) => {
      state.provider = action.payload;
    },
    clearSwap: (state) => {
      state.from = {};
    },
  },
});

export const { setFrom, setTo, swap, setProvider, clearSwap } =
  swapSlice.actions;

export const getFrom = (state: AppState) => state.swap.from;
export const getTo = (state: AppState) => state.swap.to;
export const getProvider = (state: AppState) => state.swap.provider;

export default swapSlice.reducer;
