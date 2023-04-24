import { configureStore, ThunkAction, Action, Store } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import userReducer from "./userSlice";
import exchangeReducer from "./exchangeSlice";

export function makeStore() {
  return configureStore({
    reducer: { user: userReducer, exchange: exchangeReducer },
  });
}

export const store = makeStore();

// const makeStore = (context: Context) => createStore(reducer);

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<Store>(makeStore);
