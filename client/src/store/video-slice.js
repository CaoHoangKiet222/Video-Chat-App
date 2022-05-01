import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "video",
  initialState: {
    stream: null,
    callId: null,
    call: null,
    callAccepted: false,
    callEnded: false,
  },
  reducers: {
    setStream(state, action) {
      state.stream = action.payload.currentStream;
    },
    setCallId(state, action) {
      state.callId = action.payload.callId;
    },
    setCall(state, action) {
      state.call = action.payload.call;
    },
    setCallSignal(state, action) {
      state.call.signal = action.payload.signal;
    },
    setCallAccepted(state, action) {
      state.callAccepted = action.payload.callAccepted;
    },
    setCallEnded(state, action) {
      state.callEnded = action.payload.callEnded;
    },
    setStateAgain(state) {
      state.stream = null;
      state.callId = null;
      state.call = null;
      state.callAccepted = false;
      state.callEnded = false;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
