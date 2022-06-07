const User = require('../models/user');
const Conversation = require('../models/conversation');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const {sortName} = require('../utilities/utilities');

exports.getCall = async (req, res, next) => {
   try {
      console.log(req.session.user);
      const {members} = await Conversation.findOne({_id: req.params.conversationId}).populate({path: "members.userId"});
      const friend = members.find(member => member.userId._id.toString() !== req.session.user._id.toString());
      res.send({friend: friend.userId});
   } catch (err) {
      res.send({error: err.message});
   }
}

exports.getListFriends = async (req, res, next) => {
   try {
      const friends = await User.find();
      const listFriends = friends.filter(friend => friend._id.toString() !== req.session.user._id.toString());
      const sortedName = sortName(listFriends);
      return res.send(sortedName);

   } catch (err) {
      res.send({error: err.message});
   }
}

exports.getConversation = async (req, res, next) => {
   try {
      const conv = await Conversation.find({"members.userId": req.session.user}).populate({path: "members.userId"});

      return res.status(200).json({
         conv,
         user: req.session.user
      });
   } catch (err) {
      console.error(err);
      res.send({error: err.message});
   }
}

exports.postAddFriend = async (req, res, next) => {
   try {
      let conversation = await Conversation.find({"members.userId": req.session.user}).populate({path: "members.userId"});
      const convExist = await Conversation.findOne({
         $and: [
            {"members.userId": req.body.friendId},
            {"members.userId": req.session.user._id}
         ]
      });

      if (!convExist) {
         const newConversation = new Conversation(
            {
               members: [{userId: req.session.user}, {userId: req.body.friendId}],
               messages: []
            }
         );
         await newConversation.save();
         conversation = await Conversation.find({"members.userId": req.session.user}).populate({path: "members.userId"});
      }

      res.send({
         conv: conversation,
         user: req.session.user
      });
   } catch (err) {
      res.send({error: err.message});
   }
}

exports.postUserLogin = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
         return res.send({error: errors.array()[0].msg});
      }
      const user = await User.findOne({email: req.body.email});

      req.session.user = user;
      req.session.isLoggedin = true;
      req.session.save((err) => {
         if (err) {
            console.log(err);
         }
      })

      return res.send(user);
   }
   catch (err) {
      console.error(err);
   }
}

exports.postUserSignUp = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
         return res.send({error: errors.array()[0].msg});
      }

      const hashedPassword = await bcryptjs.hash(req.body.password, 12);

      const user = new User({
         name: req.body.email.split('@')[0],
         email: req.body.email,
         password: hashedPassword,
         avata: "images/user.jpg",
         lastOnline: Date.now()
      });
      await user.save();

      res.send(user);
   } catch (err) {
      console.error(err);
      res.send({error: err.message});
   }
}
