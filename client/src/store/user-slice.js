import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
   name: "user",
   initialState: {
      user: null,
      isFetch: false,
      error: null
   },
   reducers: {
      login(state, action) {
         state.user = action.payload.user;
         state.isFetch = action.payload.isFetch;
         state.error = action.payload.error;
      },
      logout(state, action) {

      }
   }
})

export const userActions = userSlice.actions;

export default userSlice.reducer;
