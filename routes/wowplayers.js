const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const WowplayerService = require("../services/wowplayers");


router.get("/", async (req, res) => {
    WowplayerService.getAll(req, res);
  });



router.use(auth)

router.post("/", async (req, res) => {
    try {
        let avatar = req.files.avatar;
    }
    catch (err) {
        res.status(500).send({
            message: "no photo",
        });
    }
    try {
        let avatar = req.files.avatar
        let extension =  (avatar.name.split(".").pop()).toLowerCase();
        let data = {name: req.body.name.toLowerCase(),
        tagline: req.body.tagline,
        rank: req.body.rank,
        twitter: req.body.twitter,
        youtube: req.body.youtube,
        twitch: req.body.twitch,
        tiktok: req.body.tiktok,
        imageextention: extension}
        await WowplayerService.addPlayer(data);
        avatar.mv("./uploads/" + data.name + "." + extension);
        res.send({
            message: "Player and photo added",
        });
    } catch (err) {
        console.log(err)
        res.status(403).send({
            message: "Name already exists",
        });
    }


    
        
});

router.patch("/", async (req, res) => {
    WowplayerService.editPlayer(req);

});

router.delete("/", async (req, res) => {
    WowplayerService.deletePlayer(req);

});

module.exports = router;