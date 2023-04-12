import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/user";

const initialState: User = {
  email: null,
  userId: null,
  firebaseId: null,
  knownKeys: [],
  subscription: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: User, action) => {
      state.email = action.payload.data.email;
      state.userId = action.payload.data.user_id;
      state.firebaseId = action.payload.data.firebase_id;
      state.knownKeys = action.payload.data.known_keys;
      state.subscription = action.payload.data.subscription;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
