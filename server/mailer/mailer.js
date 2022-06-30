const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const mailer = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.mailerMain = () => {
  // send mail with defined transport object
  mailer.sendMail(
    {
      from: "kiet.caohoang@hcmut.edu.vn",
      to: "caohoangkiet1720@gmail.com",
      subject: "Password Reset",
      html: `
            <p>You requested a password reset</p>
            <p>Click <a href="">this</a> to reset password </p>
         `,
    },
    (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
    }
  );
};
