const router = require("express").Router();
const { getGroupImg } = require("../controllers/image-group");

router.get("/image-group/:groupImg", getGroupImg);

module.exports = router;
