const {check, body} = require('express-validator');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

// exports.isAuth = (req, res, next) => {
//    if (!req.session.isLoggedin) {
//       return res.redirect('/login');
//    }
//    next();
// }

exports.checkValidation = (type) => {
   switch (type) {
      case "login":
         return check("email")
            .isEmail()
            .withMessage("Invalid email!!")
            .normalizeEmail()
            .custom(async (value, {req}) => {
               const user = await User.findOne({email: value});
               if (!user) {
                  // req.flash("oldInput",
                  //    {
                  //       email: req.body.email,
                  //       password: req.body.password,
                  //       confirmPassword: req.body.confirmPassword
                  //    }
                  // );
                  return Promise.reject("E-mail not found. Please sign up!!");
               }
               else {
                  const matchPassword = await bcryptjs.compare(req.body.password, user.password);
                  if (!matchPassword) {
                     return Promise.reject("Invalid password!!");
                  }
               }
            });
      case "signup":
         return [
            check("email")
               .isEmail()
               .withMessage("Invalid email!!")
               .normalizeEmail()
               .custom(async (value, {req}) => {
                  const user = await User.findOne({email: value});
                  if (user) {
                     // req.flash("oldInput",
                     //    {
                     //       email: req.body.email,
                     //       password: req.body.password,
                     //       confirmPassword: req.body.confirmPassword
                     //    }
                     // );
                     return Promise.reject("E-mail already in use!!");
                  }
               }),
            body(
               "password",
               // second argument is default error
               "The password must be 5+ chars long and must contain number or text!!"
            )
               .isLength({min: 5})
               .trim()
               .isAlphanumeric(),
            body("confirmPassword")
               .trim()
               .custom((value, {req}) => {
                  if (value !== req.body.password) {
                     throw new Error("Password confirmation does not match password");
                  }
                  return true;
               })
         ];
      default:
         return null;
   }
}
