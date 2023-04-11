import { createSlice } from "@reduxjs/toolkit";
import { Asset } from "../types/asset";

const initialState = {
  coinlist: [],
};

export const marketSlice = createSlice({
  name: "maket",
  initialState,
  reducers: {
    addCoins: (state, action) => {
      state.coinlist = action.payload;
    },
  },
});

export const { addCoins } = marketSlice.actions;

export default marketSlice.reducer;
