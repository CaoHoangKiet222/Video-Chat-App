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
  password: {
    type: String,
    required: true,
  },
  avatar: {
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/dv7uhlgru/image/upload/v1656512818/image-profile/user_ifpemd.jpg",
    },
    public_id: {
      type: String,
      default: "",
    },
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
  website: {
    type: String,
    default: "Unknow",
  },
  facebook: {
    type: String,
    default: "Unknow",
  },
  twitter: {
    type: String,
    default: "Unknow",
  },
  instagram: {
    type: String,
    default: "Unknow",
  },
  linkedin: {
    type: String,
    default: "Unknow",
  },
  twoFA: {
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    secret: {
      type: String,
      default: "",
    },
  },
  isLoggined: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("User", userSchema);
