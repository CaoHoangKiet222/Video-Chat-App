import {createSlice} from "@reduxjs/toolkit";

export const videoSlice = createSlice({
   name: "video",
   initialState: {
      stream: null,
      callId: null,
      call: null,
      callAccepted: false,
      callEnded: false
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
      setCallAccepted(state, action) {
         state.callAccepted = action.payload.callAccepted;
      },
      setCallEnded(state, action) {
         state.callEnded = action.payload.callEnded;
      }
   }
})

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
