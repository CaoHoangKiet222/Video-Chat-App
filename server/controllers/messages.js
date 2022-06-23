const Conversation = require("../models/conversation");
const { getConversation } = require("./user");

exports.newGroup = async (req, res, _next) => {
  try {
    await new Conversation({
      members: [...req.body.newMembers, { userId: req.session.user }],
      groupImg: req.file.filename,
      groupName: req.body.groupName,
      messages: [],
    }).save();

    getConversation(req, res, _next);
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
