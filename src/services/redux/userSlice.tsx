import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../types/user";
import { AppState } from "./store";

const initialState: UserType = {
  email: null,
  userId: null,
  firebaseId: null,
  knownKeys: [],
  subscription: false,
  language: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserType, action) => {
      state.firebaseId = action.payload?.firebase_id ?? null;
      state.subscription = action.payload?.subscription ?? false;
    },
  },
});

export const { setUser } = userSlice.actions;

export const isPremiumUser = (state: AppState) => state.user.subscription;
export const firebaseId = (state: AppState) => state.user.firebaseId;

export default userSlice.reducer;
