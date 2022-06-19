const Conversation = require("../models/conversation");

exports.newGroup = async (req, res, _next) => {
  try {
    console.log(req.body.newMembers);
    const newGroup = await new Conversation({
      members: [...req.body.newMembers, { userId: req.session.user }],
      groupImg: req.body.groupImg,
      groupName: req.body.groupName,
      messages: [],
    }).save();
    // console.log(newGroup);
    res.json(newGroup);
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
