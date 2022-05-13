const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const socketListen = require("./socket/socket");

const PORT = process.env.YOUR_PORT || process.env.PORT || 5000;
const MONGODB_URI =
  "mongodb+srv://kietcao:thangcho@cluster0.kfugn.mongodb.net/video-chat?retryWrites=true&w=majority";

// Body Parser Middleware
app.use(express.json({ limit: "50mb" })); // Allow us to handle raw json
app.use(express.urlencoded({ limit: "50mb", extended: false })); // Allow us to handle form submissions to handle URL encoded data

const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: MONGODB_URI,
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

app.use(require("./routes/user"));

const io_chat = io.of("/chat-rooms");
io_chat.on("connection", (socket) => {
  console.log("A user connected to channel chat-rooms");

  socketListen(socket, "joinRoom", io_chat);

  socketListen(socket, "leaveRoom");

  socketListen(socket, "sendMessage", io_chat);

  socketListen(socket, "disconnect");
});

const io_meeting = io.of("/meeting-rooms");
io_meeting.on("connection", (socket) => {
  console.log("A user connected to channel meeting-rooms");

  socketListen(socket, "joinVideo", io_meeting);

  socketListen(socket, "meetingConnection", io_meeting);

  socketListen(socket, "callToUser");

  socketListen(socket, "answerCall", io_meeting);

  socketListen(socket, "notAnswerCall", io_meeting);

  socketListen(socket, "joinMeetingRoom", io_meeting);

  socketListen(socket, "callEnded", io_meeting);

  socketListen(socket, "showMyVideo");

  socketListen(socket, "toggleSound");
});

(async () => {
  try {
    mongoose.connect(MONGODB_URI);
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
