const { cloudinary, uploads } = require("../cloudinary/cloudinary");

const Conversation = module.require("../models/conversation");
const Files = module.require("../models/files");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    // Use for chat
    case "joinRoom":
      socket.on(type, async (room, callback) => {
        try {
          const conv = await Conversation.findOne({ _id: room }).populate({
            path: "members.userId messages.senderId messages.files",
          });

          console.log(conv.messages);
          callback(conv.messages);

          socket.join(room);

          console.log("A user joins chat-rooms");
          // console.log(io.adapter.rooms);
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
      socket.on(type, async ({ message, room }, callback) => {
        try {
          const {
            content,
            files,
            messageDate,
            sender: senderId,
            reply,
          } = message;

          socket.broadcast.to(room).emit("receiveMessage", {
            content,
            files,
            messageDate,
            senderId,
            reply,
          });

          console.log(io.adapter.rooms);

          callback(null, { content, files, messageDate, senderId, reply });

          const uploadedImgsUrl = await Promise.all(
            files.images.map((data) => {
              return uploads(data, "image-preview");
            })
          );
          const newFiles = await new Files({ images: uploadedImgsUrl }).save();
          console.log(newFiles);

          await Conversation.findOneAndUpdate(
            { _id: room },
            {
              $push: {
                messages: {
                  content: content,
                  files: newFiles._id,
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
          Conversation.findOneAndUpdate(
            {
              $and: [
                { "members.userId": user._id },
                { "members.userId": friend._id },
                { groupName: "" },
              ],
            },
            {
              $push: {
                messages: message,
              },
            },
            { new: true },
            async (_err, conversation) => {
              if (!conversation) {
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
    case "forwardGroupMessage":
      socket.on(type, ({ message, room }, callback) => {
        try {
          console.log(message, room);
          Conversation.findOneAndUpdate(
            {
              _id: room,
            },
            {
              $push: {
                messages: message,
              },
            },
            { new: true },
            async (_err, conversation) => {
              io.to(conversation._id.toString()).emit(
                "receiveGroupMessage",
                conversation.messages.splice(-1)[0]
              );
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
        socket.broadcast.to(conversationId).emit("deleteMessage", message);
        callback();
      });
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected to message channel");
        // console.log(io.adapter.rooms);
      });
      break;
  }
};
