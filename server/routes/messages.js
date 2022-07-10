const router = require("express").Router();
const messagesController = require("../controllers/messages");
const {
  changeMembersToUserId,
} = require("../middleware/changeMembersToUserId");
const { checkValidation } = require("../middleware/isAuth");

router.post(
  "/invite-others",
  checkValidation("invite-others"),
  messagesController.postInvitation
);

router.post("/new-group", changeMembersToUserId, messagesController.newGroup);

router.delete("/delete-message", messagesController.deleteMessage);

module.exports = router;
