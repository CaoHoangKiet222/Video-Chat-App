const User = require("../models/user");
const Conversation = require("../models/conversation");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sortName, setSession } = require("../utilities/utilities");
const { uploadImgs, destroyAsset } = require("../cloudinary/cloudinary");
const { mailer } = require("../mailer/mailer");
const {
  generateUniqueSecret,
  generateOTPToken,
  generateQRCode,
  verifyOTPToken,
} = require("../2FA/2fa");
const crypto = require("crypto");

exports.getCall = async (req, res, _next) => {
  try {
    const { members } = await Conversation.findOne({
      _id: req.params.conversationId,
    }).populate({
      path: "members.userId",
      select: "-password -avatar.public_id -twoFA.secret -groupImg.public_id",
    });

    const friend = members.find(
      (member) =>
        member.userId._id.toString() !== req.session.user._id.toString()
    );

    res.send({ friend: friend.userId });
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.getListFriends = async (req, res, _next) => {
  try {
    const listFriends = await User.find({
      _id: {
        $ne: req.session.user._id.toString(),
      },
    }).select("-password -avatar.public_id -twoFA.secret");

    const sortedName = sortName(listFriends);

    return res.send(sortedName);
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.getConversation = (req, res, _next) => {
  try {
    Conversation.find(
      {
        "members.userId": req.session.user,
      },
      (_err, convTest) => {
        if (!convTest) {
          return res.send({ error: "Conversation not found!!" });
        }

        return res.status(200).json({
          conv: convTest,
          user: req.session.user,
        });
      }
    ).populate({
      path: "members.userId",
      select: "-password -avatar.public_id -twoFA.secret -groupImg.public_id",
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
};

exports.postAddFriend = async (req, res, _next) => {
  try {
    Conversation.findOne(
      {
        $and: [
          { "members.userId": req.body.friendId },
          { "members.userId": req.session.user._id },
          { groupName: "" },
        ],
      },
      async (_err, convExist) => {
        if (!convExist) {
          await new Conversation({
            members: [
              { userId: req.session.user },
              { userId: req.body.friendId },
            ],
            messages: [],
          }).save();
        }

        Conversation.find(
          {
            "members.userId": req.session.user,
          },
          (_err, conversation) => {
            res.send({
              conv: conversation,
              user: req.session.user,
            });
          }
        ).populate({ path: "members.userId" });
      }
    );
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.postUserLogin = async (req, res, _next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.send({ error: errors.array()[0].msg });
    }

    const user = await User.findOne({
      email: req.body.email,
      loginByFirebase: "",
    }).select("-password -avatar.public_id -twoFA.secret");

    if (user.twoFA.is2FAEnabled) {
      setSession(req, user, false);
      return res.send(user);
    }

    User.findOneAndUpdate(
      { email: req.body.email },
      { isLoggined: true },
      { new: true },
      (_error, updatedUser) => {
        setSession(req, updatedUser, true);

        return res.send(updatedUser);
      }
    ).select("-password -avatar.public_id -twoFA.secret");
  } catch (err) {
    console.log(err);
    res.send({ erroe: err.message });
  }
};
exports.postUserLoginByFirebase = async (req, res, _next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      loginByFirebase: req.body.provider,
    }).select("-password -avatar.public_id -twoFA.secret");

    if (!user) {
      const newUser = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: await bcryptjs.hash(req.body.password, 12),
        loginByFirebase: req.body.provider,
        avatar: {
          url: req.body.photoURL,
          public_id: "",
        },
        phone: req.body.phone,
        isLoggined: true,
      }).then(async (user) => {
        return await User.findById(user._id).select(
          "-password -avatar.public_id -twoFA.secret"
        );
      });
      setSession(req, newUser, true);
      return res.send(newUser);
    }

    if (user.twoFA.is2FAEnabled) {
      setSession(req, user, false);
      return res.send(user);
    }

    User.findOneAndUpdate(
      { email: req.body.email, loginByFirebase: req.body.provider },
      { isLoggined: true },
      { new: true },
      (_error, updatedUser) => {
        setSession(req, updatedUser, true);

        return res.send(updatedUser);
      }
    ).select("-password -avatar.public_id -twoFA.secret");
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
};

exports.postUserLogout = (req, res, _next) => {
  try {
    User.findByIdAndUpdate(
      req.session.user._id,
      {
        isLoggined: false,
      },
      { new: true },
      () => {
        req.session.destroy((error) => console.log(error));

        res.json({ error: null });
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

exports.postUserSignUp = async (req, res, _next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.send({ error: errors.array()[0].msg });
    }

    await User.create({
      name: req.body.email.split("@")[0],
      email: req.body.email,
      password: await bcryptjs.hash(req.body.password, 12),
    });

    res.send({
      message: "Creating account successfully, have fun with our page!!!",
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
};

exports.postReset = (req, res, _next) => {
  try {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        return res.send({ error: err.message });
      }
      console.log(
        `${buffer.length} bytes of random data: ${buffer.toString("hex")}`
      );
      const token = buffer.toString("hex");
      User.findOneAndUpdate(
        { email: req.body.email, loginByFirebase: "" },
        {
          resetPass: {
            token,
            // Date.now() in milliseconds
            expireToken: Date.now() + 3600000,
          },
        },
        { new: true },
        async (_err, user) => {
          if (!user) {
            return res.send({ error: "No found that email!!" });
          }

          mailer.sendMail(
            {
              from: process.env.NODEMAILER_AUTH_USER,
              to: user.email,
              subject: "Password Reset",
              html: `
              <h3>Hello ${user.email}</h3>
              <p>You requested a password reset</p>
              <p>Click <a href="${process.env.ENDPOINT_CLIENT_NETLIFY}/reset-password/new-pass?token=${token}">this</a> to reset password.</p>
           `,
            },
            (err, result) => {
              console.log("mailer", result);
              if (err) {
                return res.send({ error: "Something went wrong!!!" });
              }
              res.send({
                message:
                  "Confirm successfully, please check email to reset your password!!!",
              });
            }
          );
        }
      );
    });
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.postNewPassword = async (req, res, _next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.send({ error: errors.array()[0].msg });
    }

    User.findOne(
      {
        $and: [
          { "resetPass.token": req.params.token },
          { "resetPass.expireToken": { $gt: Date.now() } },
        ],
      },
      async (err, user) => {
        if (err) {
          return res.send({ error: err.message });
        }

        if (!user) {
          return res.send({ error: "Your reset token had been expired!!!" });
        }

        user.password = await bcryptjs.hash(req.body.password, 12);
        user.resetPass.token = null;
        user.resetPass.expireToken = null;
        await user.save();

        res.send({
          message: "We have resetted your password, please login!!!",
        });
      }
    );
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.checkCookieExpiration = async (req, res, _next) => {
  try {
    // console.log("checkAuthUser", req.session);

    if (req.session.cookieExpiration - Date.now() <= 0) {
      await User.updateOne(
        {
          _id: req.session.user._id,
        },
        {
          isLoggined: false,
        }
      );
      req.session.destroy((err) => console.log(err));
      return res.json({ expireCookie: true });
    }
    if (req.session.isLoggined) {
      return res.json({ isAuth: true });
    }

    res.json({ expireCookie: false, isAuth: false });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.updateUserAccount = async (req, res, _next) => {
  try {
    let { name, avatar, address, birth, phone, website, userId } = req.body;

    if (avatar) {
      avatar = await uploadImgs(avatar, "image-profile");
    }

    const user = await User.findById(userId).select(
      "avatar -password -avatar.public_id -twoFA.secret"
    );
    destroyAsset(user.avatar.public_id, "image");

    User.findOneAndUpdate(
      { _id: userId },
      {
        name,
        avatar,
        birth,
        phone,
        website,
        address,
      },
      { new: true },
      (error, updatedUser) => {
        if (error) {
          return new Error("Update user account fail!!!");
        }
        setSession(req, updatedUser, true);
        res.json({
          update: "Your work has been saved. Enjoy our page!!!",
          user: updatedUser,
        });
      }
    ).select("-password -avatar.public_id -twoFA.secret");
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.updateUserSocialNetwork = async (req, res, _next) => {
  try {
    const { facebook, twitter, instagram, linkedin, userId } = req.body;
    User.findOneAndUpdate(
      { _id: userId },
      {
        facebook,
        twitter,
        instagram,
        linkedin,
      },
      { new: true },
      (error, updatedUser) => {
        if (error) {
          return new Error("Update user account fail!!!");
        }
        setSession(req, updatedUser, true);
        res.json({
          update: "Your work has been saved. Enjoy our page!!!",
          user: updatedUser,
        });
      }
    ).select("-password -avatar.public_id -twoFA.secret");
  } catch (err) {
    res.send({ error: err.message });
  }
};
exports.updateUserPassword = async (req, res, _next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.send({ error: errors.array()[0].msg });
    }

    const { newPass, userId } = req.body;

    User.findOneAndUpdate(
      { _id: userId },
      {
        password: await bcryptjs.hash(newPass, 12),
      },
      { new: true },
      (error, updatedUser) => {
        if (error) {
          return res.send({ error: "Update user account fail!!!" });
        }
        setSession(req, updatedUser, true);
        res.json({
          update: "Your work has been saved. Enjoy our page!!!",
          user: updatedUser,
        });
      }
    ).select("-password -avatar.public_id -twoFA.secret");
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.postEnable2FA = (req, res, _next) => {
  try {
    const { is2FAEnabled, userId } = req.body;
    if (is2FAEnabled) {
      const secret = generateUniqueSecret();

      User.findByIdAndUpdate(
        userId,
        {
          twoFA: {
            is2FAEnabled,
            secret,
          },
        },
        { new: true },
        async (err, updatedUser) => {
          if (err) {
            return console.log(err);
          }

          const otpAuth = generateOTPToken(
            updatedUser.name,
            "chk.videochatapp",
            secret
          );

          const QRCodeImage = await generateQRCode(otpAuth);
          setSession(req, updatedUser, true);

          return res.status(200).json({ QRCodeImage, user: updatedUser });
        }
      ).select("-password -avatar.public_id -twoFA.secret");
    } else {
      User.findByIdAndUpdate(
        userId,
        {
          twoFA: {
            is2FAEnabled,
            secret: "",
          },
        },
        { new: true },
        async (err, updatedUser) => {
          if (err) {
            return console.log(err);
          }
          setSession(req, updatedUser, true);

          return res.status(200).json({
            update: "Disable two authentication done!!!",
            user: updatedUser,
          });
        }
      ).select("-password -avatar.public_id -twoFA.secret");
    }
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.postVerify2FA = (req, res, _next) => {
  try {
    User.findById(req.body.userId, (_err, user) => {
      if (!user) {
        return res.send({ error: "Can't find user!!" });
      }
      const isValid = verifyOTPToken(req.body.otpToken, user.twoFA.secret);
      if (isValid) {
        User.findByIdAndUpdate(
          req.body.userId,
          { isLoggined: true },
          { new: true },
          (err, updatedUser) => {
            if (err) {
              return console.log(err);
            }
            setSession(req, updatedUser, true);
          }
        ).select("-password -avatar.public_id -twoFA.secret");
      }
      res.json({ isValid });
    });
  } catch (err) {
    res.send({ error: err.message });
  }
};
