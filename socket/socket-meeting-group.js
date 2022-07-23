exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "joinVideoGroup":
      socket.on(type, ({ room, user }) => {
        try {
          // console.log("A user joins meeting-group-rooms", room);

          socket.join(room);

          socket.userInfo = user;
          socket.room = room;

          const allUsersInRoom = Array.from(io.adapter.rooms.get(room));

          socket.emit(
            "allUsers",
            allUsersInRoom.filter((userSocketId) => userSocketId !== socket.id)
          );
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "sendingSignal":
      socket.on(type, ({ userAlreadyInRoomId, calleeId, signal }) => {
        try {
          io.to(userAlreadyInRoomId).emit("userJoined", {
            signal,
            userJoinId: calleeId,
            userJoinInfo: socket.userInfo,
          });
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "returningSignal":
      socket.on(type, ({ userJoinId, signal }) => {
        try {
          io.to(userJoinId).emit("receivingSignal", {
            signal,
            userInRoomId: socket.id,
            userInRoomInfo: socket.userInfo,
          });
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "leaveGroupRoom":
      socket.on(type, ({ userLeaveId, room, user }) => {
        try {
          socket.room = null;
          socket.userInfo = null;
          socket.broadcast.to(room).emit("userLeaving", { userLeaveId, user });

          socket.leave(room);
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "showMyVideo":
      socket.on(type, ({ room }) => {
        try {
          socket.userInfo.showVideo = !socket.userInfo.showVideo;
          socket.broadcast
            .to(room)
            .emit("showUserVideo", { userId: socket.id });
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "toggleSound":
      socket.on(type, ({ room }) => {
        try {
          socket.userInfo.muteSound = !socket.userInfo.muteSound;
          socket.broadcast.to(room).emit("toggleSound", { userId: socket.id });
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "toggleControls":
      socket.on(type, ({ room }) => {
        try {
          socket.userInfo.isShare = !socket.userInfo.isShare;
          socket.broadcast
            .to(room)
            .emit("toggleControls", { userId: socket.id });
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected to meeting-group channel");
        // console.log(io.adapter.rooms);

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
