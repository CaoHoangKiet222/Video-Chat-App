const router = require("express").Router();
const {
  changeMembersToUserId,
} = require("../middleware/changeMembersToUserId");
const conversationController = require("../controllers/conversation");

router.delete(
  "/delete-conversation",
  conversationController.deleteConversation
);

router.delete(
  "/delete-group-conversation",
  conversationController.deleteGroupConversation
);

router.post("/block-conversation", conversationController.blockConversation);

router.post(
  "/block-group-conversation/single",
  conversationController.blockGroupSingleConversation
);

router.post(
  "/block-group-conversation",
  conversationController.blockGroupConversation
);

router.post(
  "/new-group",
  changeMembersToUserId,
  conversationController.newGroup
);

module.exports = router;
