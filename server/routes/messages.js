const router = require("express").Router();
const messagesController = require("../controllers/messages");
const { checkValidation } = require("../middleware/isAuth");

router.post(
  "/invite-others",
  checkValidation("invite-others"),
  messagesController.postInvitation
);

router.delete("/delete-message", messagesController.deleteMessage);

module.exports = router;
