import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
    posts: any[];
}

const initialState: initialStateType = {
    posts: [],
};


export const postsSlice = createSlice({
    name: "market",
    initialState,
    reducers: {
        setPosts: (state, action: { payload: any[] }) => {
            state.posts = action.payload;
        },
    },
});

export const { setPosts } = postsSlice.actions;

export default postsSlice.reducer;
