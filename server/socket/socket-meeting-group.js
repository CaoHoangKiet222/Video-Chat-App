exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "joinVideoGroup":
      socket.on(type, ({ room, user }) => {
        console.log("A user joins meeting-group-rooms", room);

        socket.join(room);

        console.log(io.adapter.rooms);
        socket.userInfo = { ...user, inRoom: room };

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
        io.to(userAlreadyInRoomId).emit("userJoined", {
          signal,
          userJoinId: calleeId,
          userJoinInfo: { ...socket.userInfo, userJoinId: socket.id },
        });
      });
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

        socket.leave(room);
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected to meeting-group channel");
        console.log(io.adapter.rooms);
        // need to be fixed in server
        console.log(socket.userInfo);
        console.log("sdfasdfasfdasdf", Array.from(io.adapter.rooms));

        socket.broadcast.to(socket.userInfo?.inRoom).emit("userLeaving", {
          userLeaveId: socket.id,
          user: socket.userInfo,
        });
      });
      break;
  }
};
