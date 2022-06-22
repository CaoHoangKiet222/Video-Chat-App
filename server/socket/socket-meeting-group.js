exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "joinVideoGroup":
      socket.on(type, ({ room, user }) => {
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
      socket.on(
        type,
        ({ userAlreadyInRoomId, calleeId, signal, calleeInfo }) => {
          io.to(userAlreadyInRoomId).emit("userJoined", {
            signal,
            userJoinId: calleeId,
            userJoinInfo: { ...calleeInfo, userJoinId: calleeId },
          });
        }
      );
      break;
    case "returningSignal":
      socket.on(type, ({ userJoinId, signal }) => {
        io.to(userJoinId).emit("receivingSignal", {
          signal,
          userInRoomId: socket.id,
        });
      });
      break;
    case "leaveGroupRoom":
      socket.on(type, ({ userLeaveId, room, user }) => {
        socket.broadcast.to(room).emit("userLeaving", { userLeaveId, user });
        console.log("sdfasdfsadfssssssssssss", io.adapter.rooms);

        socket.leave(room);

        console.log("sdfasdfsadfssssssssssss", io.adapter.rooms);
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected to meeting-group channel");
        console.log(io.adapter.rooms);
        // need to be fixed in server
        // socket.broadcast.to(room).emit("userLeaving", { userLeaveId: socket.id});
        socket.leave();
      });
      break;
  }
};
