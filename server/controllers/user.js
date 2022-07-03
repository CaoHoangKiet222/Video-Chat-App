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
const url = require("url");

exports.getCall = async (req, res, _next) => {
  try {
    const { members } = await Conversation.findOne({
      _id: req.params.conversationId,
    }).populate({ path: "members.userId", select: "-password" });

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
    }).select("-password");

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
        if (_err) {
          throw new Error("Conversation not found!!");
        }
        console.log("getConversation", req.session.user);
        return res.status(200).json({
          conv: convTest,
          user: req.session.user,
        });
      }
    ).populate({ path: "members.userId", select: "-password" });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
};

exports.getSession = (req, res, _next) => {
  try {
    if (req.session.isRemember) {
      return res.send({
        isRemember: req.session.isRemember,
      });
    }

    User.findByIdAndUpdate(
      req.session.user._id,
      {
        isLoggined: false,
      },
      { new: true },
      () => {
        req.session.destroy((error) => console.log(error));

        res.json({
          isRemember: false,
          error: null,
        });
      }
    );

    // req.session.destroy((error) => console.log(error));
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.postAddFriend = async (req, res, _next) => {
  try {
    console.log("sssssssssssssssssssss", req.body);
    const convExist = await Conversation.findOne({
      $and: [
        { "members.userId": req.body.friendId },
        { "members.userId": req.session.user._id },
        { groupName: "" },
      ],
    });

    if (!convExist) {
      await new Conversation({
        members: [{ userId: req.session.user }, { userId: req.body.friendId }],
        messages: [],
      }).save();
    }

    const conversation = await Conversation.find({
      "members.userId": req.session.user,
    }).populate({ path: "members.userId" });

    res.send({
      conv: conversation,
      user: req.session.user,
    });
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

    console.log("login", req.body);
    const user = await User.findOne({
      email: req.body.email,
      loginByFirebase: "",
    }).select("-password");

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
    ).select("-password");
  } catch (err) {
    console.log(err);
  }
};
exports.postUserLoginByFirebase = async (req, res, _next) => {
  try {
    console.log("loginbygoogle", req.body);
    const user = await User.findOne({
      email: req.body.email,
      loginByFirebase: req.body.provider,
    }).select("-password");

    console.log(user);
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
        return await User.findById(user._id).select("-password");
      });
      console.log(newUser);
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
    ).select("-password");
  } catch (err) {
    console.log(err);
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

    const user = await User.create({
      name: req.body.email.split("@")[0],
      email: req.body.email,
      password: await bcryptjs.hash(req.body.password, 12),
    }).then(async (user) => {
      return await User.findById(user._id).select("-password");
    });

    res.send(user);
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

          const getUrl = url.format({
            protocol: req.protocol,
            host: req.get("host"),
          });
          console.log(getUrl);

          mailer.sendMail({
            from: "caohoangkiet1720@gmail.com",
            to: "kiet.caohoang@hcmut.edu.vn",
            subject: "Password Reset",
            html: `
              <p>You requested a password reset</p>
              <p>Click <a href="${getUrl}/reset/${token}">this</a> to reset password </p>
           `,
          });

          res.send({ message: "Check your email" });
        }
      );
    });
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.postNewPassword = (req, res, _next) => {
  try {
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.checkAuthUser = (req, res, _next) => {
  try {
    console.log("checkAuthUser", req.session);
    if (!req.session.isLoggined) {
      return res.json({ isAuth: false });
    }

    res.json({ isAuth: true });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.updateUserAccount = async (req, res, _next) => {
  try {
    let { name, avatar, address, birth, phone, website, userId } = req.body;

    if (avatar) {
      avatar = await uploadImgs(avatar, "image-profile");
      console.log(avatar);
    }

    const user = await User.findById(userId).select("avatar -password");
    console.log(user);
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
        console.log(updatedUser);
        setSession(req, updatedUser, true);
        res.json({
          update: "Your work has been saved. Enjoy our page!!!",
          user: updatedUser,
        });
      }
    ).select("-password");
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.updateUserSocialNetwork = async (req, res, _next) => {
  try {
    const { facebook, twitter, instagram, linkedin, userId } = req.body;
    console.log(req.body);
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
        console.log(updatedUser);
        setSession(req, updatedUser, true);
        res.json({
          update: "Your work has been saved. Enjoy our page!!!",
          user: updatedUser,
        });
      }
    ).select("-password");
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
    console.log(req.body);

    // mailerMain();

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
        console.log(updatedUser);
        setSession(req, updatedUser, true);
        res.json({
          update: "Your work has been saved. Enjoy our page!!!",
          user: updatedUser,
        });
      }
    ).select("-password");
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.postEnable2FA = (req, res, _next) => {
  try {
    console.log(req.body);
    const { is2FAEnabled, userId } = req.body;
    if (is2FAEnabled) {
      User.findByIdAndUpdate(
        userId,
        {
          twoFA: {
            is2FAEnabled,
            secret: generateUniqueSecret(),
          },
        },
        { new: true },
        async (err, updatedUser) => {
          if (err) {
            return console.log(err);
          }
          console.log(updatedUser);

          const otpAuth = generateOTPToken(
            updatedUser.name,
            "kietcaohoang.com",
            updatedUser.twoFA.secret
          );

          const QRCodeImage = await generateQRCode(otpAuth);
          setSession(req, updatedUser, true);

          return res.status(200).json({ QRCodeImage, user: updatedUser });
        }
      ).select("-password");
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
          console.log(updatedUser);
          setSession(req, updatedUser, true);

          return res.status(200).json({
            update: "Disable two authentication done!!!",
            user: updatedUser,
          });
        }
      ).select("-password");
    }
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.postVerify2FA = (req, res, _next) => {
  try {
    const isValid = verifyOTPToken(req.body.otpToken, req.body.userSecret);
    if (isValid) {
      User.findByIdAndUpdate(
        req.body.userId,
        { isLoggined: true },
        { new: true },
        (err, updatedUser) => {
          if (err) {
            return console.log(err);
          }
          console.log(updatedUser);
          setSession(req, updatedUser, true);
        }
      );
    }
    res.json({ isValid });
  } catch (err) {
    res.send({ error: err.message });
  }
};
