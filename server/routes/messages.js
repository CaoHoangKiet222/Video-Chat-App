const router = require("express").Router();
const messagesController = require("../controllers/messages");
const {
  changeMembersToUserId,
} = require("../middleware/changeMembersToUserId");
const { upload } = require("../multer/fileHandling");

router.post(
  "/new-group",
  upload.single("groupImg"),
  changeMembersToUserId,
  messagesController.newGroup
);

router.delete("/delete-message", messagesController.deleteMessage);

module.exports = router;
