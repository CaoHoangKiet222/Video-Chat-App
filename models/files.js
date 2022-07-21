const { Schema, model } = require("mongoose");

const filesSchema = new Schema({
  images: [
    {
      type: Schema.Types.Mixed,
      default: {},
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
