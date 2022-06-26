const Conversation = require("../models/conversation");
const { getConversation } = require("./user");
const { cloudinary } = require("../cloudinary/cloudinary");

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
    await Conversation.findByIdAndUpdate(req.body.conversationId, {
      $pull: {
        messages: { _id: req.body.message._id },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
