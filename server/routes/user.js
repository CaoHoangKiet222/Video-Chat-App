const express = require('express');
const router = express.Router();

const {checkValidation} = require('../middleware/isAuth');
const userController = require('../controllers/user');


router.get('/Friends/list-friends', userController.getListFriends);

router.get('/Chats/conversation', userController.getConversation);

router.post('/meeting/:conversationId', userController.getCall);

router.post('/add-friend', userController.postAddFriend);

router.post('/login', checkValidation("login"), userController.postUserLogin);

router.post('/signup', checkValidation("signup"), userController.postUserSignUp);

module.exports = router;
