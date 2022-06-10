const router = require("express").Router();
const meetingsController = require("../controllers/meetings");

router.post("/save-calls", meetingsController.saveCalls);

router.get("/get-calls", meetingsController.getCalls);

module.exports = router;
