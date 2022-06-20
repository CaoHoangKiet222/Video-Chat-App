const { Schema, model } = require("mongoose");

const meetingsGroupSchema = new Schema({
  groupName: {
    type: String,
    default: "",
  },
  groupImg: {
    type: String,
    default: "",
  },
  caller: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  callees: Schema.Types.Mixed,
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

module.exports = model("MeetingsGroup", meetingsGroupSchema);
