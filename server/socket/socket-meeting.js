const Meetings = module.require("../models/meetings");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "joinVideo":
      socket.on(type, async ({ conversationId }) => {
        try {
          console.log("A user joins meeting-rooms", conversationId);

          socket.join(conversationId);

          // console.log(io.adapter.rooms);
        } catch (err) {
          console.error(err);
        }
      });
      break;
    case "meetingConnection":
      socket.on(type, ({ room, callee, caller }, callback) => {
        socket.broadcast.to(room).emit("meetingConnection", {
          callId: room,
          caller,
          isReceiving: true,
          callee,
        });
        callback();
      });
      break;
    case "callToUser":
      socket.on(type, ({ callId, signalData }) => {
        socket.broadcast.to(callId).emit("callToUser", { signal: signalData });
      });
      break;
    case "answerCall":
      socket.on(type, async ({ signal, callId, call }, cb) => {
        try {
          const { callerId, calleeId, startCall, callAccepted } = call;

          cb();
          io.to(callId).emit("callAccepted", signal, startCall);

          await new Meetings({
            callerId,
            calleeId,
            startCall,
            callAccepted,
          }).save();
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "joinMeetingRoom":
      socket.on(type, ({ callId }) => {
        io.to(callId).emit("joinMeetingRoom", callId);
      });
      break;
    case "notAnswerCall":
      socket.on(type, async ({ callId, call }, callback) => {
        try {
          socket.to(callId).emit("notAnswerCall");
          callback();

          const { callerId, calleeId, startCall, callAccepted } = call;
          await new Meetings({
            callerId,
            calleeId,
            startCall,
            callAccepted,
          }).save();
        } catch (error) {
          console.log(error);
        }
      });
      break;
    case "callEnded":
      socket.on(
        type,
        async ({ callId, callTime, callerId, calleeId, startCall }) => {
          try {
            io.to(callId).emit("callEnded");

            await Meetings.findOneAndUpdate(
              { callerId, calleeId, startCall },
              { callTime }
            );
          } catch (error) {
            console.log(error);
          }
        }
      );
      break;
    case "showMyVideo":
      socket.on(type, ({ callId, type, isClickFirstTime }, callback) => {
        callback();

        if (type === "phone") {
          if (!isClickFirstTime) {
            return socket.broadcast.to(callId).emit("startPhone");
          }
        }

        socket.broadcast.to(callId).emit("showUserVideo");
      });
      break;
    case "toggleSound":
      socket.on(type, ({ callId }) => {
        socket.broadcast.to(callId).emit("toggleSound");
      });
      break;
    case "meetingGroupConnection":
      socket.on(type, ({ room, caller }, callback) => {
        socket.broadcast
          .to(room)
          .emit("meetingGroupConnection", { room, caller });
        callback();
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected to meeting channel");
        // console.log(io.adapter.rooms);
      });
      break;
  }
};
