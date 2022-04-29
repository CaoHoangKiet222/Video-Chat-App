import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
const ENDPOINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;

export const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: io(`${ENDPOINT_SERVER}/chat-rooms`, {
      transports: ["websocket"],
    }),
  },
  reducers: {
    setSocketNamespace(state, action) {
      state.socket = io(`${ENDPOINT_SERVER}/${action.payload.NAMESPACE}`, {
        transports: ["websocket"],
      });
    },
  },
});

export default socketSlice.reducer;
