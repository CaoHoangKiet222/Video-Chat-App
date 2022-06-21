import { createSlice } from "@reduxjs/toolkit";

export const videoGroupSlice = createSlice({
  name: "video group",
  initialState: {
    peers: null,
    stream: null,
  },
  reducers: {
    setPeers(state, action) {
      state.peers = action.payload.peers;
    },
    setStream(state, action) {
      state.stream = action.payload.stream;
    },
  },
});

export const videoActions = videoGroupSlice.actions;

export default videoGroupSlice.reducer;
