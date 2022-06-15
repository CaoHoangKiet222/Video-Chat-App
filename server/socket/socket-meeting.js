const Conversation = module.require("../models/conversation");
const Meetings = module.require("../models/meetings");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "joinVideo":
      socket.on(type, async ({ user, friend }) => {
        try {
          console.log("A user joins meeting-rooms");

          const conversation = await Conversation.findOne({
            $and: [
              { "members.userId": user._id },
              { "members.userId": friend._id },
            ],
          }).select({ _id: 1 });

          socket.join(conversation._id.toString());

          console.log(io.adapter.rooms);
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
        const { callerId, calleeId, startCall, callAccepted } = call;

        cb();
        io.to(callId).emit("callAccepted", signal, startCall);

        await new Meetings({
          callerId,
          calleeId,
          startCall,
          callAccepted,
        }).save();

        console.log("answerCall done");
      });
      break;
    case "joinMeetingRoom":
      socket.on(type, ({ callId }) => {
        io.to(callId).emit("joinMeetingRoom", callId);
      });
      break;
    case "notAnswerCall":
      socket.on(type, async ({ callId, call }) => {
        try {
          io.to(callId).emit("notAnswerCall");

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
          io.to(callId).emit("callEnded");

          await Meetings.findOneAndUpdate(
            { callerId, calleeId, startCall },
            { callTime }
          );
        }
      );
      break;
    case "showMyVideo":
      socket.on(type, ({ callId, type, isClickFirstTime }, callback) => {
        callback();
        socket.broadcast.to(callId).emit("showUserVideo");

        !isClickFirstTime &&
          socket.broadcast.to(callId).emit("startVideoOrPhone", type);
      });
      break;
    case "toggleSound":
      socket.on(type, ({ callId }) => {
        socket.broadcast.to(callId).emit("toggleSound");
      });
      break;
  }
};
