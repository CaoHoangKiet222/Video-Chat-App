import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: false,
    signup: false,
  },
  reducers: {
    setAuth(state, action) {
      state.auth = action.payload.auth;
    },
    setSignUp(state, action) {
      state.signup = action.payload.signup;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
