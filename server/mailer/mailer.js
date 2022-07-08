const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
});

module.exports = {
  mailer,
};
