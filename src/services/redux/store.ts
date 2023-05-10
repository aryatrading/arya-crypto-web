import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";

import user from "./userSlice";
import market from "./marketSlice";
import exchange from "./exchangeSlice";
import assetReducer from "./assetSlice";
import swapReducer from "./swapSlice";

import { MODE_DEBUG } from "../../utils/constants/config";

const combineReducer = combineReducers({
  user,
  market,
  exchange,
  asset: assetReducer,
  swap: swapReducer,
});

export const reducer = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    return nextState;
  } else {
    return combineReducer(state, action);
  }
};

const configStore = () => {
  return configureStore({
    reducer: reducer,
    devTools: MODE_DEBUG ? true : false,
  });
};

export let store: ReturnType<typeof configStore>;

export const makeStore = () => {
  store = configStore();
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
