import { createSlice } from "@reduxjs/toolkit";

export const timeCallSlice = createSlice({
  name: "timeCall",
  initialState: {
    timeCall: null,
    error: null,
  },
  reducers: {
    setTimeCall(state, action) {
      state.timeCall = action.payload.timeCall;
      state.error = action.payload.error;
    },
  },
});

export const timeCallActions = timeCallSlice.actions;

export default timeCallSlice.reducer;
