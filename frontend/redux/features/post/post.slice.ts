import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type IPost } from "types/post";

type TPostSlice = {
  data: IPost[];
};
const initialState: TPostSlice = {
  data: [],
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost(
      state,
      action: PayloadAction<{ post: IPost[] | []; new?: boolean }>
    ) {
      const payload = action.payload;
      if (payload.new) {
        state.data = payload.post;
      } else {
        state.data = [...state.data, ...payload.post];
      }
    },
    removePost(state, action: PayloadAction<string>) {
      const id = action.payload;

      state.data = state.data.filter((post) => post._id !== id);
    },
    addNewPost(state, action: PayloadAction<IPost>) {
      const id = action.payload;

      state.data = [id, ...state.data];
    },
  },
});

export const { setPost, removePost, addNewPost } = postSlice.actions;
export default postSlice.reducer;
