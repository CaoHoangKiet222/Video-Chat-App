const { Schema, model } = require("mongoose");

const meetingsSchema = new Schema({
  callerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  calleeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  startCall: {
    type: String,
    default: "",
  },
  callTime: {
    type: String,
    default: "",
  },
  callAccepted: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Meetings", meetingsSchema);
