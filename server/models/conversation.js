const { Schema, model } = require("mongoose");

const conversationSchema = new Schema({
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
    },
  ],
});

module.exports = model("Conversation", conversationSchema);
