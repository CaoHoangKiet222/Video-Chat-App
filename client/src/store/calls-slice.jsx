import { createSlice } from "@reduxjs/toolkit";

export const callsSlice = createSlice({
  name: "calls",
  initialState: {
    calls: null,
    error: null,
  },
  reducers: {
    setCalls(state, action) {
      state.calls = action.payload.calls;
      state.error = action.payload.error;
    },
  },
});

export const callsActions = callsSlice.actions;

export default callsSlice.reducer;
