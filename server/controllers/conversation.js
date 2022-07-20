const Conversation = require("../models/conversation");
const { cloudinary, destroyAsset } = require("../cloudinary/cloudinary");
const { getConversation } = require("./user");
const Reply = require("../models/reply");
const Files = require("../models/files");
const Meeting = require("../models/meetings");

exports.newGroup = (req, res, _next) => {
  try {
    cloudinary.uploader.upload(
      req.body.groupImg,
      { upload_preset: "image-group" },
      async (error, result) => {
        console.log(result, error);
        if (error) {
          return new Error("Upload image error!");
        }

        await new Conversation({
          members: [
            ...req.body.newMembers,
            { userId: req.session.user, isAdmin: true },
          ],
          groupImg: { url: result.url, public_id: result.public_id },
          groupName: req.body.groupName,
          messages: [],
        }).save();

        getConversation(req, res, _next);
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ error: error.messsage });
  }
};

exports.blockConversation = (req, res, _next) => {
  try {
    console.log(req.body);
    Conversation.findByIdAndUpdate(
      req.body.conversationId,
      {
        "members.$[].block": {
          byUserId: req.body.isBlock ? null : req.body.userId,
          isBlock: !req.body.isBlock,
        },
      },
      { new: true },
      (_err, conversation) => {
        if (!conversation) {
          return res.send({ error: "Block conversation fail!!!" });
        }
        getConversation(req, res, _next);
      }
    );
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.blockGroupConversation = (req, res, _next) => {
  try {
    console.log("blockGroupConversation", req.body);
    if (req.body.isAdmin) {
      Conversation.findByIdAndUpdate(
        req.body.conversationId,
        {
          "members.$[].block": {
            byUserId: req.body.isBlock ? null : req.body.userId,
            isBlock: !req.body.isBlock,
          },
        },
        { new: true },
        (_err, conversation) => {
          if (!conversation) {
            return res.send({ error: "Block group conversation fail!!!" });
          }
          getConversation(req, res, _next);
        }
      );
    }
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.deleteConversation = (req, res, _next) => {
  try {
    console.log("deleteConversation", req.body);
    Conversation.findByIdAndDelete(
      req.body.conversationId,
      (_err, conversation) => {
        if (!conversation) {
          return res.send({ error: "Delete conversation fail!!!" });
        }

        Meeting.deleteMany(
          {
            $or: [
              {
                $and: [
                  { callerId: conversation.members[0].userId },
                  { calleeId: conversation.members[1].userId },
                ],
              },
              {
                $and: [
                  { callerId: conversation.members[1].userId },
                  { calleeId: conversation.members[0].userId },
                ],
              },
            ],
          },
          (_error, result) => {
            console.log("Meeting delete", result);
          }
        );

        conversation.messages.forEach((message) => {
          Reply.deleteOne({ _id: message.reply }, (error) => {
            if (error) {
              return console.log(error);
            }
          });

          Files.findByIdAndDelete(message.files, (err, file) => {
            console.log("file", file);
            if (err) {
              return new Error(error.message);
            }

            if (!file) {
              return new Error("Delete in cloudinary fail!!!");
            }

            file.images.forEach(({ public_id }) => {
              destroyAsset(public_id, "image");
            });

            file.attachments.forEach(({ public_id }) => {
              destroyAsset(public_id, "raw");
            });
          });
        });

        getConversation(req, res, _next);
      }
    );
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.deleteGroupConversation = (req, res, _next) => {
  try {
    if (req.body.isAdmin) {
      Conversation.findByIdAndDelete(
        req.body.conversationId,
        (_err, conversation) => {
          if (!conversation) {
            return res.send({ error: "Delete conversation fail!!!" });
          }

          destroyAsset(conversation.groupImg.public_id, "image");

          conversation.messages.forEach((message) => {
            Reply.deleteOne({ _id: message.reply }, (error) => {
              if (error) {
                return console.log(error);
              }
            });

            Files.findByIdAndDelete(message.files, (err, file) => {
              console.log("file", file);
              if (err) {
                return new Error(error.message);
              }

              if (!file) {
                return new Error("Delete in cloudinary fail!!!");
              }

              file.images.forEach(({ public_id }) => {
                destroyAsset(public_id, "image");
              });

              file.attachments.forEach(({ public_id }) => {
                destroyAsset(public_id, "raw");
              });
            });
          });

          getConversation(req, res, _next);
        }
      );
    } else {
      Conversation.updateOne(
        { _id: req.body.conversationId },
        {
          $pull: {
            members: {
              userId: req.body.userId,
            },
          },
        },
        () => {
          getConversation(req, res, _next);
        }
      );
    }
  } catch (err) {
    res.send({ error: error.message });
  }
};
