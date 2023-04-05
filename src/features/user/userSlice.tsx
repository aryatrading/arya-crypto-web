import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "../../types/user";

const initialState: UserState = {
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
    addUser: (state: UserState, action) => {
      state.email = action.payload.email;
      state.userId = action.payload.user_id;
      state.firebaseId = action.payload.firebase_id;
      state.knownKeys = action.payload.known_keys;
      state.subscription = action.payload.subscription;
    },
  },
});

export const { addUser } = userSlice.actions;

export default userSlice.reducer;
