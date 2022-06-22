exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "joinVideoGroup":
      socket.on(type, ({ room }) => {
        console.log("A user joins meeting-group-rooms", room);

        socket.join(room);

        console.log(io.adapter.rooms);

        const allUsersInRoom = Array.from(io.adapter.rooms.get(room));
        console.log(allUsersInRoom);

        socket.emit(
          "allUsers",
          allUsersInRoom.filter((userSocketId) => userSocketId !== socket.id)
        );
      });
      break;
    case "sendingSignal":
      socket.on(type, ({ userAlreadyInRoomId, calleeId, signal }) => {
        io.to(userAlreadyInRoomId).emit("userJoined", { signal, calleeId });
      });
      break;
    case "returningSignal":
      socket.on(type, ({ calleeId, signal }) => {
        io.to(calleeId).emit("receivingSignal", {
          signal,
          userInRoomId: socket.id,
        });
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected to meeting-group channel");
        console.log(io.adapter.rooms);
      });
      break;
  }
};
