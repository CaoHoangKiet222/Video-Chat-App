const Conversation = module.require("../models/conversation");

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
    case "forwardMessage":
      socket.on(type, async ({ message, user, friend }, callback) => {
        console.log(message);

        Conversation.findOneAndUpdate(
          {
            $and: [
              { "members.userId": user._id },
              { "members.userId": friend._id },
            ],
          },
          {
            $push: {
              messages: message,
            },
          },
          { new: true },
          (_err, conversation) => {
            io.to(conversation._id.toString()).emit(
              "receiveMessage",
              conversation.messages.splice(-1)[0]
            );
          }
        ).populate("messages.senderId");

        callback();
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
  }
};
