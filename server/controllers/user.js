const User = require("../models/user");
const Conversation = require("../models/conversation");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sortName } = require("../utilities/utilities");
const { uploadImgs, destroyAsset } = require("../cloudinary/cloudinary");

exports.getCall = async (req, res, _next) => {
  try {
    const { members } = await Conversation.findOne({
      _id: req.params.conversationId,
    }).populate({ path: "members.userId" });

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
    });

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
        return res.status(200).json({
          conv: convTest,
          user: req.session.user,
        });
      }
    ).populate({ path: "members.userId" });
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

        // res.json({ error: null });
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

    User.findOneAndUpdate(
      { email: req.body.email },
      { isLoggined: true },
      { new: true },
      (_error, user) => {
        req.session.user = user;
        req.session.isLoggined = true;
        // req.session.isRemember = req.body.rememberToLogin;
        req.session.save((err) => {
          if (err) {
            return console.log(err);
          }
        });
        console.log(user, req.body.rememberToLogin);

        return res.send(user);
      }
    );
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

    const hashedPassword = await bcryptjs.hash(req.body.password, 12);

    const user = new User({
      name: req.body.email.split("@")[0],
      email: req.body.email,
      password: hashedPassword,
      avatar: "images/user.jpg",
      lastOnline: new Date(Date.now()),
    });

    await user.save();

    res.send(user);
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
};

exports.checkAuthUser = (req, res, _next) => {
  try {
    console.log(req.session.isLoggined);
    if (!req.session.isLoggined) {
      return res.json({ isAuth: false });
    }

    res.json({ isAuth: true });
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.updateUserAccount = async (req, res, _next) => {
  try {
    let { name, avatar, birth, phone, website, userId } = req.body;

    if (avatar) {
      avatar = await uploadImgs(avatar, "image-profile");
      console.log(avatar);
    }

    const user = await User.findById(userId).select("avatar");
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
      },
      { new: true },
      (error, newUser) => {
        if (error) {
          return new Error("Update user account fail!!!");
        }
        console.log(newUser);
        req.session.user = newUser;
        req.session.isLoggined = true;
        req.session.reload((error) => console.log(error));
      }
    );
    res.json({ update: "Update done. You need to login again!!!" });
  } catch (err) {
    console.log(err);
  }
};
