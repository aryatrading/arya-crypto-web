import { configureStore, ThunkAction, Action, Store } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import userReducer from "./userSlice";
import marketReducer from "./marketSlice";
import assetReducer from "./assetSlice";

export function makeStore() {
  return configureStore({
    reducer: { user: userReducer, market: marketReducer, asset: assetReducer },
  });
}

export const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<Store>(makeStore);
