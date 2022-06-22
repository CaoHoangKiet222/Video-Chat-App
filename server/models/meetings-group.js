const { Schema, model } = require("mongoose");

const meetingsGroupSchema = new Schema({
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
