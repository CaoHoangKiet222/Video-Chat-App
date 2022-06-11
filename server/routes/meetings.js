const router = require("express").Router();
const meetingsController = require("../controllers/meetings");

router.get("/get-calls", meetingsController.getCalls);

module.exports = router;
