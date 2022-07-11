const Conversation = require("../models/conversation");
const User = require("../models/user");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "notifyingUserIsOnline":
      socket.on(type, async ({ userId }) => {
        // await User.findByIdAndUpdate(socket.userId, { isLoggined: true });
        socket.userId = userId;
        socket.broadcast.emit(type);
      });
      break;
    case "notifyingUserIsOffline":
    case "notifyingUserAddFriend":
    case "notifyingUserAddGroup":
    case "notifyingDeleteUser":
      socket.on(type, () => {
        socket.broadcast.emit(type);
      });
      break;
    case "disconnect":
      socket.on(type, async () => {
        // await User.findByIdAndUpdate(socket.userId, { isLoggined: false });
        // socket.broadcast.emit("notifyingUserIsOffline");
        socket.userId = null;
      });
      break;
  }
};
