import {createSlice} from "@reduxjs/toolkit";

export const conversationSlice = createSlice({
   name: "conversation",
   initialState: {
      conversation: null,
      error: null
   },
   reducers: {
      setConversation(state, action) {
         state.conversation = action.payload.conversation;
         state.error = action.payload.error;
      },
   }
})

export const conversationActions = conversationSlice.actions;

export default conversationSlice.reducer;
