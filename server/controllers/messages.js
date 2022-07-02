const Conversation = require("../models/conversation");
const Files = require("../models/files");
const { getConversation } = require("./user");
const {
  cloudinary,
  destroyAsset,
  uploadImgs,
  uploadAttachments,
} = require("../cloudinary/cloudinary");
const Reply = require("../models/reply");

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
          members: [...req.body.newMembers, { userId: req.session.user }],
          groupImg: result.url,
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

exports.uploadFilesInConversation = (files) => {
  try {
    return new Promise(async (resolve) => {
      const uploadedImgsUrl = await Promise.all(
        files.images.map(({ url }) => {
          return uploadImgs(url, "image-preview");
        })
      );
      console.log(uploadedImgsUrl);

      const uploadedAttachmentsUrl = await Promise.all(
        files.attachments.map(({ url, fileName }) => {
          return uploadAttachments({ url, fileName }, "attachments");
        })
      );
      console.log(uploadedAttachmentsUrl);

      const newFiles = await new Files({
        images: uploadedImgsUrl,
        attachments: uploadedAttachmentsUrl,
      }).save();

      resolve({ _id: newFiles._id });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteMessage = (message, conversationId) => {
  try {
    console.log("deleteMessage", message);

    Conversation.findByIdAndUpdate(
      conversationId,
      {
        $pull: {
          messages: { _id: message._id },
        },
      },
      async (error, conversation) => {
        console.log(conversation);
        if (error) {
          return new Error(error.message);
        }

        // delete when it points to other message
        Reply.findOneAndDelete(
          {
            _id: conversation.messages[0].reply,
          },
          (error, reply) => {
            console.log("delete reply", reply);
            if (error) {
              return new Error(error.message);
            }
          }
        );

        // delete when it is message root
        Reply.deleteMany(
          { meesage_id: conversation.messages[0]._id },
          (_error, reply) => {
            console.log("deleteMany reply", reply);
          }
        );

        Files.findByIdAndDelete(conversation.messages[0].files, (err, file) => {
          console.log(file);
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
      }
    )
      .select({ messages: { $elemMatch: { _id: message._id } } })
      .populate("messages.files");
  } catch (error) {
    console.log(error);
  }
};
