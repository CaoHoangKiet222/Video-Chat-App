const Conversation = require("../models/conversation");
const User = require("../models/user");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "notifyingUserIsOnline":
      socket.on(type, ({ userId }) => {
        socket.userId = userId;
        socket.broadcast.emit(type);
      });
      break;
    case "notifyingUserIsOffline":
      socket.on(type, () => {
        socket.broadcast.emit(type);
      });
      break;
    case "disconnect":
      socket.on(type, async () => {
        await User.findByIdAndUpdate(socket.userId, { isLoggined: false });
        socket.broadcast.emit("notifyingUserIsOffline");
      });
      break;
  }
};
