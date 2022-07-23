const {
  uploadFilesInConversation,
  deleteMessage,
} = require("../controllers/messages");
const Reply = require("../models/reply");

const Conversation = module.require("../models/conversation");

exports = module.exports = (socket, type, io = null) => {
  switch (type) {
    case "joinRoom":
      socket.on(type, async (room, callback) => {
        try {
          const conv = await Conversation.findOne({ _id: room }).populate({
            path: "members.userId messages.senderId messages.files messages.reply",
            select:
              "-password -avatar.public_id -twoFA.secret -groupImg.public_id",
          });

          callback(conv.messages);

          socket.join(room);

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
      socket.on(type, async ({ message, room, type }, callback) => {
        try {
          const {
            _id,
            content,
            files,
            messageDate,
            sender: senderId,
            reply,
          } = message;

          // type is important
          socket.broadcast
            .to(room)
            .emit(type === "group" ? "receiveGroupMessage" : "receiveMessage", {
              _id,
              content,
              files,
              messageDate,
              senderId,
              reply,
            });

          // console.log(io.adapter.rooms);

          callback(null, { _id, content, files, messageDate, senderId, reply });

          const newFiles = await uploadFilesInConversation(files);

          let newReply = null;
          if (reply) {
            newReply = await new Reply({ ...reply }).save();
          }

          await Conversation.findOneAndUpdate(
            { _id: room },
            {
              $push: {
                messages: {
                  _id,
                  content: content,
                  files: newFiles._id,
                  messageDate: messageDate,
                  senderId: senderId._id,
                  reply: newReply === null ? null : newReply._id,
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
      socket.on(type, async ({ message, user, friend }, callback) => {
        try {
          const {
            _id,
            content,
            files,
            messageDate,
            senderId,
            reply,
            isForward,
          } = message;
          const newFiles = await uploadFilesInConversation(files);
          // console.log(newFiles);
          const newMes = {
            _id,
            content,
            isForward,
            files: newFiles._id,
            messageDate,
            senderId: senderId._id,
            reply,
          };

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
                messages: newMes,
              },
            },
            { new: true },
            async (_err, conversation) => {
              if (!conversation) {
                await new Conversation({
                  members: [{ userId: user._id }, { userId: friend._id }],
                  messages: [newMes],
                }).save();
              } else {
                io.to(conversation._id.toString()).emit(
                  "receiveMessage",
                  conversation.messages.splice(-1)[0]
                );
              }
              callback();
            }
          ).populate({
            path: "messages.senderId messages.files",
            select:
              "-password -avatar.public_id -twoFA.secret -groupImg.public_id",
          });
        } catch (err) {
          console.log(err);
        }
      });
      break;
    case "forwardGroupMessage":
      socket.on(type, async ({ message, room }, callback) => {
        try {
          const {
            _id,
            content,
            files,
            messageDate,
            senderId,
            reply,
            isForward,
          } = message;
          const newFiles = await uploadFilesInConversation(files);

          const newMes = {
            _id,
            content,
            isForward,
            files: newFiles._id,
            messageDate,
            senderId: senderId._id,
            reply,
          };

          Conversation.findByIdAndUpdate(
            room,
            {
              $push: {
                messages: newMes,
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
          ).populate({
            path: "messages.senderId messages.files",
            select:
              "-password -avatar.public_id -twoFA.secret -groupImg.public_id",
          });
        } catch (err) {
          console.log(err);
        }
      });
      break;
    case "deleteMessage":
      socket.on(type, ({ message, conversationId }, callback) => {
        socket.broadcast.to(conversationId).emit("deleteMessage", message);
        callback();
        deleteMessage(message, conversationId);
      });
      break;
    case "deleteConversation":
    case "deleteGroupConversation":
      socket.on(type, ({ room, userDelete, isAdmin }, callback) => {
        socket.broadcast.to(room).emit(type, { userDelete, isAdmin });
        callback();
      });
      break;
    case "blockConversation":
    case "blockGroupConversation":
    case "blockGroupSingleConversation":
      socket.on(
        type,
        ({ room, userBlock, isBlock, isAdmin, userIsBlockedId }) => {
          socket.broadcast
            .to(room)
            .emit(type, { userBlock, isBlock, isAdmin, userIsBlockedId });
        }
      );
      break;
    case "disconnect":
      socket.on(type, () => {
        console.log("A user disconnected to message channel");
        // console.log(io.adapter.rooms);
      });
      break;
  }
};
