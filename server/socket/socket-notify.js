exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "notifyingUserIsOnline":
      socket.on(type, () => {
        socket.broadcast.emit(type);
      });
      break;
    case "notifyingUserIsOffline":
      socket.on(type, () => {
        socket.broadcast.emit(type);
      });
      break;
  }
};
