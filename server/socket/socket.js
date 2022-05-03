const Conversation = module.require("../models/conversation");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    // Use for chat
    case "joinRoom":
      socket.on("joinRoom", async (room, callback) => {
        try {
          // const conv = await Conversation.findOne({ _id: room }).populate({
          //   path: "members.userId",
          // });
          //
          // callback(null, conv.messages);

          socket.join(room);

          console.log("A user joins chat-rooms");
          console.log(io.adapter.rooms);
        } catch (err) {
          console.error(err);
          // callback(err.message, null);
        }
      });
      break;
    case "leaveRoom":
      socket.on("leaveRoom", (room) => {
        socket.leave(room);
      });
      break;
    case "sendMessage":
      socket.on("sendMessage", async (message, room, callback) => {
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
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
      break;
    // Use for video
    case "joinVideo":
      socket.on("joinVideo", async ({ user, friend }) => {
        try {
          console.log("A user joins meeting-rooms");

          const conversation = await Conversation.findOne({
            $and: [
              { "members.userId": user._id },
              { "members.userId": friend._id },
            ],
          }).select({ _id: 1 });

          // console.log("joinVideo", conversation._id.toString());
          socket.join(conversation._id.toString());

          console.log(io.adapter.rooms);
        } catch (err) {
          console.error(err);
        }
      });
      break;
    case "meetingConnection":
      socket.on("meetingConnection", ({ room, callee, caller }, callback) => {
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
      socket.on("callToUser", ({ callId, signalData }) => {
        console.log("callId", callId);
        socket.broadcast.to(callId).emit("callToUser", { signal: signalData });
      });
      break;
    case "answerCall":
      socket.on("answerCall", ({ signal, callId }) => {
        io.to(callId).emit("callAccepted", signal);
        console.log("answerCall done");
      });
      break;
    case "notAnswerCall":
      socket.on("notAnswerCall", ({ callId }) => {
        io.to(callId).emit("notAnswerCall");
      });
      break;
  }
};
