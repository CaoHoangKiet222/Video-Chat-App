const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require("dotenv").config();
const socketMessageListen = require("./socket/socket-message");
const socketMeetingListen = require("./socket/socket-meeting");
const socketMeetingGroupListen = require("./socket/socket-meeting-group");
const socketNotifyListen = require("./socket/socket-notify");
const PORT = process.env.YOUR_PORT || process.env.PORT || 5000;

// Body Parser Middleware
app.use(express.json({ limit: "50mb" })); // Allow us to handle raw json
app.use(express.urlencoded({ limit: "50mb", extended: false })); // Allow us to handle form submissions to handle URL encoded data

const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
});

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// session to save data across requests in memory not in browser
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.use(require("./routes/image-group"));
app.use(require("./routes/user"));
app.use(require("./routes/messages"));
app.use(require("./routes/meetings"));

const io_notify = io.of("/notify");
io_notify.on("connection", (socket) => {
  console.log("A user connected to channel notify");
  console.log(io_notify.adapter.rooms);

  socketNotifyListen(socket, "notifyingUserIsOnline", io_notify);

  socketNotifyListen(socket, "notifyingUserIsOffline", io_notify);

  socketNotifyListen(socket, "disconnect", io_notify);
});

const io_chat = io.of("/chat-rooms");
io_chat.on("connection", (socket) => {
  console.log("A user connected to channel chat-rooms");

  socketMessageListen(socket, "joinRoom", io_chat);

  socketMessageListen(socket, "leaveRoom", io_chat);

  socketMessageListen(socket, "sendMessage", io_chat);

  socketMessageListen(socket, "forwardMessage", io_chat);

  socketMessageListen(socket, "forwardGroupMessage", io_chat);

  socketMessageListen(socket, "deleteMessage", io_chat);

  socketMessageListen(socket, "disconnect", io_chat);
});

const io_meeting = io.of("/meeting-rooms");
io_meeting.on("connection", (socket) => {
  console.log("A user connected to channel meeting-rooms");

  socketMeetingListen(socket, "joinVideo", io_meeting);

  socketMeetingListen(socket, "meetingConnection", io_meeting);

  socketMeetingListen(socket, "callToUser");

  socketMeetingListen(socket, "answerCall", io_meeting);

  socketMeetingListen(socket, "notAnswerCall");

  socketMeetingListen(socket, "joinMeetingRoom", io_meeting);

  socketMeetingListen(socket, "callEnded", io_meeting);

  socketMeetingListen(socket, "showMyVideo");

  socketMeetingListen(socket, "toggleSound");

  socketMeetingListen(socket, "meetingGroupConnection", io_meeting);

  socketMeetingListen(socket, "disconnect", io_meeting);
});

const io_meeting_group = io.of("/meeting-group-rooms");
io_meeting_group.on("connection", (socket) => {
  console.log("A user connected to channel meeting-group-rooms");

  socketMeetingGroupListen(socket, "joinVideoGroup", io_meeting_group);

  socketMeetingGroupListen(socket, "sendingSignal", io_meeting_group);

  socketMeetingGroupListen(socket, "returningSignal", io_meeting_group);

  socketMeetingGroupListen(socket, "leaveGroupRoom", io_meeting_group);

  socketMeetingGroupListen(socket, "disconnect", io_meeting_group);
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
