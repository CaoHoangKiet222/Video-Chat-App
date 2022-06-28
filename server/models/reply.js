const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const replySchema = new Schema({
  message_id: {
    type: String,
    default: uuidv4(),
  },
  content: {
    type: String,
    default: "",
  },
  files: {
    haveImgs: {
      type: Boolean,
      default: false,
    },
    haveAttachments: {
      type: Boolean,
      default: false,
    },
  },
  senderId: Schema.Types.Mixed,
});

module.exports = model("Reply", replySchema);
