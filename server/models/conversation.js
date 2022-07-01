const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

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
      _id: {
        type: String,
        default: uuidv4(),
      },
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
        type: Schema.Types.ObjectId,
        ref: "Reply",
      },
      isForward: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = model("Conversation", conversationSchema);
