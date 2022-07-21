import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "video",
  initialState: {
    stream: null,
    callId: null,
    call: null,
    userStream: null,
    peer: null,
    callAccepted: false,
    callEnded: false,
    error: null,
    type: null,
  },
  reducers: {
    setStream(state, action) {
      state.stream = action.payload.currentStream;
    },
    setCallId(state, action) {
      state.callId = action.payload.callId;
    },
    setUserStream(state, action) {
      state.userStream = action.payload.userStream;
    },
    setPeer(state, action) {
      state.peer = action.payload.peer;
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
    setError(state, action) {
      state.error = action.payload.error;
    },
    setType(state, action) {
      state.type = action.payload.type;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
