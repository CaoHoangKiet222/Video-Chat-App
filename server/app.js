const express = require('express');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const socketListen = require('./socket/socket');
// const sharedsession = require("express-socket.io-session");

const PORT = process.env.YOUR_PORT || process.env.PORT || 5000;
const MONGODB_URI = "mongodb+srv://kietcao:thangcho@cluster0.kfugn.mongodb.net/video-chat?retryWrites=true&w=majority";

// Body Parser Middleware
app.use(express.json({limit: '50mb'})); // Allow us to handle raw json
app.use(express.urlencoded({limit: '50mb', extended: false})) // Allow us to handle form submissions to handle URL encoded data


const MongoDBStore = require('connect-mongodb-session')(expressSession);

const store = new MongoDBStore({
   uri: MONGODB_URI,
   collection: 'mySessions'
});

app.use(cors({
   origin: 'http://localhost:3000',
   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   credentials: true
}));

// session to save data across requests in memory not in browser
const session = expressSession({
   secret: 'my secret',
   resave: false,
   saveUninitialized: false,
   store: store
});

app.use(session);

// io.use(sharedsession(session));

app.get('/', (req, res) => {
   res.send("Server is running");
})

app.use(require('./routes/user'));

io.on('connection', (socket) => {
   console.log("A user connected");
   console.log(io.sockets.adapter.rooms);

   // Use for chat
   socketListen(socket, "join");

   socketListen(socket, "sendMessage", io);

   socketListen(socket, "disconnect", io);

   // Use for video 
   socketListen(socket, "joinVideo", io);

   socketListen(socket, "callToUser", io);

   socketListen(socket, "answerCall", io);
});

(async () => {
   try {
      mongoose.connect(MONGODB_URI);
      server.listen(PORT, () => {
         console.log(`Server is listening on port ${PORT}`);
      })
   } catch (err) {
      console.error(err);
   }
})();
