import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import conversationReducer from "./conversations-slice";
import friendsReducer from "./friends-slice";
import videoReducer from "./video-slice";
import socketReducer from "./socket-slice";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    socket: socketReducer,
    friends: friendsReducer,
    video: videoReducer,
  },
});

export default store;
