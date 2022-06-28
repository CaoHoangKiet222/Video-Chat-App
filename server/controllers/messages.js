const Conversation = require("../models/conversation");
const Files = require("../models/files");
const { getConversation } = require("./user");
const {
  cloudinary,
  destroyAsset,
  uploadImgs,
  uploadAttachments,
} = require("../cloudinary/cloudinary");

exports.newGroup = (req, res, _next) => {
  try {
    cloudinary.uploader.upload(
      req.body.groupImg,
      { upload_preset: "image-group" },
      async (error, result) => {
        console.log(result, error);
        if (error) {
          throw new Error("Upload image error!");
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

exports.deleteMessage = async (req, _res, _next) => {
  try {
    console.log("deleteMessage", req.body.message);

    // Conversation.findOne({
    //   messages: {
    //     reply: {
    //
    //     }
    //   }
    // }).select

    Conversation.findByIdAndUpdate(
      req.body.conversationId,
      {
        $pull: {
          messages: { _id: req.body.message._id },
        },
      },
      (error, conversation) => {
        console.log(conversation);
        if (error) {
          throw new Error(error.message);
        }

        Files.findByIdAndDelete(conversation.messages[0].files, (err, file) => {
          console.log(file);
          if (err) {
            throw new Error(error.message);
          }

          if (!file) {
            throw new Error("Delete in cloudinary fail!!!");
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
      .select({ messages: { $elemMatch: { _id: req.body.message._id } } })
      .populate("messages.files");
  } catch (error) {
    console.log(error);
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

      const uploadedAttachmentsUrl = await Promise.all(
        files.attachments.map(({ url, fileName }) => {
          return uploadAttachments({ url, fileName }, "attachments");
        })
      );

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
