import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;

export const socketSlice = createSlice({
  name: "socket",
  initialState: {
    chatSocket: io(`${ENDPOINT_SERVER}/chat-rooms`, {
      transports: ["websocket"],
    }),
    meetingSocket: io(`${ENDPOINT_SERVER}/meeting-rooms`, {
      transports: ["websocket"],
    }),
  },
});

export default socketSlice.reducer;
