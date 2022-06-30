import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isFetch: false,
    error: null,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.isFetch = action.payload.isFetch;
      state.error = action.payload.error;
    },
    logout(state) {
      state.user = null;
      state.isFetch = false;
      state.error = null;
    },
    setIsFetch(state, action) {
      state.isFetch = action.payload.isFetch;
    },
    setUser(state, action) {
      state.user = action.payload.user;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
