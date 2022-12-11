const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const WowplayerService = require("../services/wowplayers");


router.get("/", async (req, res) => {
    try {
        let data = await WowplayerService.getAll();
        res.send(data)
    }
    catch (err) {
        res.status(500).send({
            message: err,
        });
    }
  });



router.use(auth)

router.post("/", async (req, res) => {
    try {
        let avatar = req.files.avatar;
    }
    catch (err) {
        res.status(500).send(
            "You must have upload a photo with a player"
        );
        return
    }
    try {
        let avatar = req.files.avatar
        let extension =  (avatar.name.split(".").pop()).toLowerCase();
        console.log(extension)
        let data = {name: req.body.name.toLowerCase(),
        tagline: req.body.tagline,
        rank: req.body.rank,
        twitter: req.body.twitter,
        youtube: req.body.youtube,
        twitch: req.body.twitch,
        tiktok: req.body.tiktok,
        imageextention: extension}
        let response = await WowplayerService.addPlayer(data);
        avatar.mv("./uploads/" + data.name + "." + extension);
        res.send("Player and photo uploaded"
            
        );
    } catch (err) {
        res.status(403).send({
            message: err.message,
        });
    }


    
        
});

router.patch("/", async (req, res) => {
    try {
        let data = {name: req.body.name.toLowerCase(),
            tagline: req.body.tagline,
            rank: req.body.rank,
            twitter: req.body.twitter,
            youtube: req.body.youtube,
            twitch: req.body.twitch,
            tiktok: req.body.tiktok,
            }
            let returndata = await WowplayerService.editPlayer(data);
            res.send(returndata);
    }
    catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
    
});

router.delete("/", async (req, res) => {
    try {
        let data = {name: req.body.name.toLowerCase()}
        let response = await WowplayerService.deletePlayer(data);
        res.send({
            message: response,
        });
    }   
    catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
});

module.exports = router;