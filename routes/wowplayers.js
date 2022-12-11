const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const WowplayerService = require("../services/wowplayers");


router.get("/", async (req, res) => {
    WowplayerService.getAll(req, res);
  });



router.use(auth)

router.post("/", async (req, res) => {
    let avatar = req.files.avatar;
    let data = {name: req.body.name.toLowerCase(),
        tagline: req.body.tagline,
        rank: req.body.rank,
        twitter: req.body.twitter,
        youtube: req.body.youtube,
        twitch: req.body.twitch,
        tiktok: req.body.tiktok,
        imageextention: avatar.name.split(".").pop().toLowerCase(),
        avatar: avatar}
    if (!req.files) {
        res.send({
            status: false,
            message: "No file uploaded",
        });
        } else {
            try {
                WowplayerService.addPlayer(data);
                avatar.mv("./uploads/" + data.name + "." + data.extension);
            }
            catch (err) {
                res.status(500).send({
                    message: err,
                });
            }

    
        }

});

router.patch("/", async (req, res) => {
    WowplayerService.editPlayer(req);

});

router.delete("/", async (req, res) => {
    WowplayerService.deletePlayer(req);

});

module.exports = router;