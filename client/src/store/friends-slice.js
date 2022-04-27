import {createSlice} from "@reduxjs/toolkit";

export const friendsSlice = createSlice({
   name: "friends",
   initialState: {
      friends: null,
      isFetch: false,
      error: null
   },
   reducers: {
      setFriends(state, action) {
         state.friends = action.payload.friends;
         state.isFetch = action.payload.isFetch;
         state.error = action.payload.error;
      }
   }
})

export const friendsActions = friendsSlice.actions;

export default friendsSlice.reducer;
