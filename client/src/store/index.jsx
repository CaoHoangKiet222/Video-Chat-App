import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import conversationReducer from "./conversations-slice";
import callsReducer from "./calls-slice";
import friendsReducer from "./friends-slice";
import videoReducer from "./video-slice";
import socketReducer from "./socket-slice";
import timeCallReducer from "./timecall-slice";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    calls: callsReducer,
    socket: socketReducer,
    friends: friendsReducer,
    video: videoReducer,
    timeCall: timeCallReducer,
  },
});

export default store;
