import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;

export const socketSlice = createSlice({
  name: "socket",
  initialState: {
    notifySocket: io(`${ENDPOINT_SERVER}/notify`, {
      transports: ["websocket"],
    }),
    chatSocket: io(`${ENDPOINT_SERVER}/chat-rooms`, {
      transports: ["websocket"],
    }),
    meetingSocket: io(`${ENDPOINT_SERVER}/meeting-rooms`, {
      transports: ["websocket"],
    }),
  },
  reducers: {
    disconnectSocket(state) {
      state.notifySocket = state.notifySocket.disconnect();
      state.chatSocket = state.chatSocket.disconnect();
      state.meetingSocket = state.meetingSocket.disconnect();
    },
    setupSocket(state) {
      state.notifySocket = io(`${ENDPOINT_SERVER}/notify`, {
        transports: ["websocket"],
      });
      state.chatSocket = io(`${ENDPOINT_SERVER}/chat-rooms`, {
        transports: ["websocket"],
      });
      state.meetingSocket = io(`${ENDPOINT_SERVER}/meeting-rooms`, {
        transports: ["websocket"],
      });
    },
  },
});

export const socketActions = socketSlice.actions;

export default socketSlice.reducer;
