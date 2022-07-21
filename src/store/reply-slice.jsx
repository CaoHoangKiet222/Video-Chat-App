import { createSlice } from "@reduxjs/toolkit";

export const replySlice = createSlice({
  name: "reply",
  initialState: {
    reply: null,
  },
  reducers: {
    setReply(state, action) {
      state.reply = action.payload.reply;
    },
  },
});

export const replyActions = replySlice.actions;

export default replySlice.reducer;
