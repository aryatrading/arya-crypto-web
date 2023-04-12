import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../types/user";

const initialState: UserType = {
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
    setUser: (state: UserType, action) => {
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
