import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
    posts: any[] | null;
}

const initialState: initialStateType = {
    posts: null,
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
