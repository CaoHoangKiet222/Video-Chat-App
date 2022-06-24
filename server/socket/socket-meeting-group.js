exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "joinVideoGroup":
      socket.on(type, ({ room, user }) => {
        console.log("A user joins meeting-group-rooms", room);

        socket.join(room);

        console.log(io.adapter.rooms);
        socket.userInfo = user;
        socket.room = room;
        console.log(io.clients);

        const allUsersInRoom = Array.from(io.adapter.rooms.get(room));
        console.log(allUsersInRoom);

        // for (const clientId of io.adapter.rooms.get(room)) {
        //   const clientSocket = io.sockets.get(clientId);
        //   console.log(clientSocket.userInfo);
        // }

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
          userJoinInfo: socket.userInfo,
        });
      });
      break;
    case "returningSignal":
      socket.on(type, ({ userJoinId, signal }) => {
        io.to(userJoinId).emit("receivingSignal", {
          signal,
          userInRoomId: socket.id,
          userInRoomInfo: socket.userInfo,
        });
      });
      break;
    case "leaveGroupRoom":
      socket.on(type, ({ userLeaveId, room, user }) => {
        socket.room = null;
        socket.userInfo = null;
        socket.broadcast.to(room).emit("userLeaving", { userLeaveId, user });

        socket.leave(room);
      });
      break;
    case "showMyVideo":
      socket.on(type, ({ room }) => {
        console.log(io.adapter.rooms);
        socket.userInfo.showVideo = !socket.userInfo.showVideo;
        socket.broadcast.to(room).emit("showUserVideo", { userId: socket.id });
      });
      break;
    case "toggleSound":
      socket.on(type, ({ room }) => {
        console.log(io.adapter.rooms);
        socket.userInfo.muteSound = !socket.userInfo.muteSound;
        socket.broadcast.to(room).emit("toggleSound", { userId: socket.id });
      });
      break;
    case "toggleControls":
      socket.on(type, ({ room }) => {
        console.log(io.adapter.rooms);
        console.log(socket.userInfo.isShare);
        socket.userInfo.isShare = !socket.userInfo.isShare;
        console.log(socket.userInfo.isShare);
        socket.broadcast.to(room).emit("toggleControls", { userId: socket.id });
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected to meeting-group channel");
        console.log(io.adapter.rooms);

        if (socket.room && socket.userInfo) {
          socket.broadcast.to(socket.room).emit("userLeaving", {
            userLeaveId: socket.id,
            user: socket.userInfo,
          });
        }

        socket.room = null;
        socket.userInfo = null;
      });
      break;
  }
};
