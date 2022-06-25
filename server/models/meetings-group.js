const { Schema, model } = require("mongoose");

const meetingsGroupSchema = new Schema({
  groupImg: {
    type: String,
    default: "",
  },
  caller: Schema.Types.Mixed,
  callees: Schema.Types.Mixed,
  startCall: {
    type: String,
    default: "",
  },
  callTime: {
    type: String,
    default: "",
  },
});

module.exports = model("MeetingsGroup", meetingsGroupSchema);
