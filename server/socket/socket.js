const Conversation = module.require("../models/conversation");
const Meetings = module.require("../models/meetings");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    // Use for chat
    case "joinRoom":
      socket.on(type, async (room, callback) => {
        try {
          const conv = await Conversation.findOne({ _id: room }).populate({
            path: "members.userId messages.senderId",
          });

          callback(conv.messages);

          socket.join(room);

          console.log("A user joins chat-rooms");
          console.log(io.adapter.rooms);
        } catch (err) {
          console.error(err);
          callback(null, err.message);
        }
      });
      break;
    case "leaveRoom":
      socket.on(type, (room) => {
        socket.leave(room);
      });
      break;
    case "sendMessage":
      socket.on(type, async (message, room, callback) => {
        try {
          Conversation.findOneAndUpdate(
            { _id: room },
            {
              $push: {
                messages: message,
              },
            },
            { new: true },
            (_error, conversation) => {
              console.log(conversation);

              io.to(room).emit(
                "receiveMessage",
                conversation.messages.splice(-1)[0]
              );
            }
          ).populate("messages.senderId");

          callback();
        } catch (err) {
          console.error(err);
          callback(err.message);
        }
      });
      break;
    case "deleteMessage":
      socket.on(type, ({ message, conversationId }) => {
        console.log(message, conversationId);
        socket.broadcast.to(conversationId).emit("deleteMessage", message);
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected");
      });
      break;
    // Use for video
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
      socket.on(type, ({ callId }, callback) => {
        callback();
        socket.broadcast.to(callId).emit("showUserVideo");
      });
      break;
    case "toggleSound":
      socket.on(type, ({ callId }) => {
        socket.broadcast.to(callId).emit("toggleSound");
      });
      break;
  }
};
