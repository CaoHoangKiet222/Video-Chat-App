const router = require("express").Router();
const messagesController = require("../controllers/messages");

router.delete("/delete-message", messagesController.deleteMessage);

module.exports = router;
