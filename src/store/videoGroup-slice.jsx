import { createSlice } from "@reduxjs/toolkit";

export const videoGroupSlice = createSlice({
  name: "video group",
  initialState: {
    peers: null,
    stream: null,
    callId: null,
    caller: null,
  },
  reducers: {
    setPeers(state, action) {
      state.peers = action.payload.peers;
    },
    setStream(state, action) {
      state.stream = action.payload.stream;
    },
    setCallId(state, action) {
      state.callId = action.payload.callId;
    },
    setCaller(state, action) {
      state.caller = action.payload.caller;
    },
  },
});

export const videoGroupActions = videoGroupSlice.actions;

export default videoGroupSlice.reducer;
