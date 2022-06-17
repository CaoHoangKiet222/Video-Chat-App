const Conversation = require("../models/conversation");

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
