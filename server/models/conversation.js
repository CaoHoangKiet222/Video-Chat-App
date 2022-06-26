const { Schema, model } = require("mongoose");

const conversationSchema = new Schema({
  groupImg: {
    type: String,
    default: "",
  },
  groupName: {
    type: String,
    default: "",
  },
  members: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  messages: [
    {
      content: {
        type: String,
        default: "",
      },
      files: {
        type: Schema.Types.ObjectId,
        ref: "Files",
      },
      messageDate: {
        type: Date,
        default: Date.now(),
      },
      senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      reply: {
        type: Schema.Types.Mixed,
        default: {},
      },
      isForward: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = model("Conversation", conversationSchema);
