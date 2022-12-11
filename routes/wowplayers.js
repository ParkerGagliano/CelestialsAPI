const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const WowplayerService = require("../services/wowplayers");


router.get("/", async (req, res) => {
    WowplayerService.getAll(req, res);
  });



router.use(auth)

router.post("/", async (req, res) => {
    WowplayerService.addPlayer(req);

});

router.patch("/", async (req, res) => {
    WowplayerService.editPlayer(req);

});

router.delete("/", async (req, res) => {
    WowplayerService.deletePlayer(req);

});

module.exports = router;