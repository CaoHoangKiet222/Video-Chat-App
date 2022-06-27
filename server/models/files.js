const { Schema, model } = require("mongoose");

const filesSchema = new Schema({
  images: [
    {
      type: String,
      default: "",
    },
  ],
  attachments: [
    {
      type: Schema.Types.Mixed,
      default: {},
    },
  ],
});

module.exports = model("Files", filesSchema);
