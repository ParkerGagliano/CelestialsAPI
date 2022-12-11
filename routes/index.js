let streamers = require("./streamers");
let wowplayers = require("./wowplayers");
let router = require("express").Router();

router.use("/api/streamers", streamers);
router.use("/api/wowplayers", wowplayers)

module.exports = router;
