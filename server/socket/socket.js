const Conversation = module.require("../models/conversation");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    // Use for chat
    case "joinRoom":
      socket.on(type, async (room, callback) => {
        try {
          const conv = await Conversation.findOne({ _id: room }).populate({
            path: "members.userId",
          });
          //
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
          const conversation = await Conversation.findOne({ _id: room });
          conversation.messages.push(message);
          await conversation.save();
          const newMesage = conversation.messages.splice(-1)[0];
          io.to(room).emit("receiveMessage", newMesage);

          callback();
        } catch (err) {
          console.error(err);
          callback(err.message);
        }
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
      socket.on(type, ({ signal, callId }) => {
        io.to(callId).emit("callAccepted", signal);
        console.log("answerCall done");
      });
      break;
    case "joinMeetingRoom":
      socket.on(type, ({ callId }) => {
        io.to(callId).emit("joinMeetingRoom", callId);
      });
      break;
    case "notAnswerCall":
      socket.on(type, ({ callId }) => {
        io.to(callId).emit("notAnswerCall");
      });
      break;
    case "callEnded":
      socket.on(type, ({ callId }) => {
        io.to(callId).emit("callEnded");
        console.log("callEnded done");
      });
      break;
  }
};
