import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: false,
  },
  reducers: {
    setAuth(state, action) {
      state.auth = action.payload.auth;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
