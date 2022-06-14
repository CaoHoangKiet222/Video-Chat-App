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
        io.to(room).emit("leaveRoom");

        socket.leave(room);
      });
      break;
    case "sendMessage":
      socket.on(type, async (message, room, callback) => {
        try {
          console.log(message);
          const { content, messageDate, sender: senderId, reply } = message;

          socket.broadcast
            .to(room)
            .emit("receiveMessage", { content, messageDate, senderId, reply });

          callback(null, { content, messageDate, senderId, reply });

          await Conversation.findOneAndUpdate(
            { _id: room },
            {
              $push: {
                messages: {
                  content: content,
                  messageDate: messageDate,
                  senderId: senderId._id,
                  reply: reply,
                },
              },
            }
          );
        } catch (err) {
          console.error(err);
          callback(err.message, null);
        }
      });
      break;
    case "forwardMessage":
      socket.on(type, ({ message, user, friend }, callback) => {
        try {
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
            async (_err, conversation) => {
              console.log("asdfasdfasdfsdfs", conversation);

              if (!conversation) {
                console.log("conversation not exists");
                await new Conversation({
                  members: [{ userId: user._id }, { userId: friend._id }],
                  messages: [message],
                }).save();
              } else {
                io.to(conversation._id.toString()).emit(
                  "receiveMessage",
                  conversation.messages.splice(-1)[0]
                );
                console.log("emit done");
              }
              callback();
            }
          ).populate("messages.senderId");
        } catch (err) {
          console.log(err);
        }
      });
      break;
    case "deleteMessage":
      socket.on(type, ({ message, conversationId }, callback) => {
        console.log(message, conversationId);
        socket.broadcast.to(conversationId).emit("deleteMessage", message);
        callback();
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected");
      });
      break;
  }
};
