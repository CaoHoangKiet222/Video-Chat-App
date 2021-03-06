const express = require("express");
const router = express.Router();

const { checkValidation } = require("../middleware/isAuth");
const userController = require("../controllers/user");

router.get("/isExpiredCookie", userController.checkCookieExpiration);

router.get("/Friends/list-friends", userController.getListFriends);

router.get("/Chats/conversation", userController.getConversation);

router.post("/meeting/:conversationId", userController.getCall);

router.post("/add-friend", userController.postAddFriend);

router.post("/login", checkValidation("login"), userController.postUserLogin);

router.post("/login-by-firebase", userController.postUserLoginByFirebase);

router.post("/logout", userController.postUserLogout);

router.post(
  "/signup",
  checkValidation("signup"),
  userController.postUserSignUp
);

router.post("/password-reset", userController.postReset);

router.post(
  "/new-password/:token",
  checkValidation("new-password"),
  userController.postNewPassword
);

router.post("/update-user/account", userController.updateUserAccount);

router.post(
  "/update-user/social-network",
  userController.updateUserSocialNetwork
);

router.post(
  "/update-user/password",
  checkValidation("update-password"),
  userController.updateUserPassword
);

router.post("/update-user/enable-2fa", userController.postEnable2FA);

router.post("/verify-2fa", userController.postVerify2FA);

module.exports = router;
