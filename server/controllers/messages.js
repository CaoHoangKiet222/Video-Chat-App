const { default: mongoose } = require("mongoose");
const Conversation = require("../models/conversation");

exports.deleteMessage = async (req, res, _next) => {
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
