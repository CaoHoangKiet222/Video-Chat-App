import { createSlice } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: "error",
  initialState: {
    message: null,
    error: false,
  },
  reducers: {
    setError(state, action) {
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
    resetError(state, action) {
      state.error = action.payload.error;
    },
  },
});

export const errorActions = errorSlice.actions;

export default errorSlice.reducer;
