const Conversation = require("../models/conversation");

exports.deleteMessage = async (req, res, _next) => {
  try {
    const conversation = await Conversation.findById(
      req.body.conversationId
    ).select("messages");

    conversation.messages.splice(
      conversation.messages.findIndex(
        ({ _id }) => _id.toString() === req.body.message._id.toString()
      ),
      1
    );

    await conversation.save();
  } catch (error) {
    console.log(error);
  }
};
