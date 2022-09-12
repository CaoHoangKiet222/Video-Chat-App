const { check, body } = require("express-validator");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

exports.checkValidation = (type) => {
  switch (type) {
    case "login":
      return check("email")
        .isEmail()
        .withMessage("Invalid email. Please enter the right one!!!")
        .normalizeEmail()
        .custom(async (value, { req }) => {
          const user = await User.findOne({ email: value });
          if (!user) {
            return Promise.reject("E-mail not found. Please sign up!!");
          } else {
            const matchPassword = await bcryptjs.compare(
              req.body.password,
              user.password
            );
            if (!matchPassword) {
              return Promise.reject(
                "Invalid password. Please enter the right one!!!"
              );
            }
          }
        });
    case "signup":
      return [
        check("email")
          .isEmail()
          .withMessage("Invalid email!!")
          .normalizeEmail()
          .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
              return Promise.reject("E-mail already in use!!");
            }
          }),
        body(
          "password"
          // second argument is default error
          /* "The password must be 5+ chars long and must contain number, (upper + lower) text and symbol!!" */
        )
          .isLength({ min: 5 })
          .withMessage("Your password must be 5+ chars")
          .isStrongPassword({
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
          .withMessage(
            "Your password must contain number, (upper + lower) text and symbol!!"
          )
          .trim(),
        body("confirmPassword")
          .trim()
          .custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(
                "Password confirmation does not match with password"
              );
            }
            return true;
          }),
      ];
    case "new-password":
      return [
        body("password")
          .isLength({ min: 5 })
          .withMessage("Your password must be 5+ chars")
          .isStrongPassword({
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
          .withMessage(
            "Your password must contain number, (upper + lower) text and symbol!!"
          )
          .trim(),
        body("confirmPassword")
          .trim()
          .custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(
                "Password confirmation does not match with password"
              );
            }
            return true;
          }),
      ];
    case "update-password":
      return [
        body("currentPass")
          .trim()
          .custom(async (value, { req }) => {
            const user = await User.findById(req.body.userId);

            if (!user) {
              throw new Error("User not found!!!");
            }
            const matchPassword = await bcryptjs.compare(value, user.password);

            if (!matchPassword) {
              return Promise.reject(
                "The your current password doesn't match with old password!!"
              );
            }
            return true;
          }),
        body("newPass")
          .isLength({ min: 5 })
          .withMessage("Your password must be 5+ chars")
          .isStrongPassword({
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
          .withMessage(
            "Your password must contain number, (upper + lower) text and symbol!!"
          )
          .trim()
          .custom((value, { req }) => {
            if (value === req.body.currentPass) {
              throw new Error(
                "Please choose password which doesn't match with the old one!!!"
              );
            }
            return true;
          }),
        body("confirmPass")
          .trim()
          .custom((value, { req }) => {
            if (value !== req.body.newPass) {
              throw new Error(
                "Password confirmation does not match with password"
              );
            }
            return true;
          }),
      ];
    case "invite-others":
      return check("email")
        .isEmail()
        .withMessage("Invalid email. Please enter the right one!!!")
        .normalizeEmail();
    default:
      return null;
  }
};
