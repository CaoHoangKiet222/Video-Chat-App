const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "HCM city",
  },
  birth: {
    type: String,
    default: "Unknow",
  },
  phone: {
    type: String,
    default: "Unknow",
  },
  address: {
    type: String,
    default: "Unknow",
  },
  password: {
    type: String,
    required: true,
  },
  avata: {
    type: String,
  },
  lastOnline: {
    type: Date,
    required: true,
  },
});

module.exports = model("User", userSchema);
