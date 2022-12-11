const { Wowplayers } = require("../models/wowplayers");

module.exports = {
    async getAll(req, res) {
        let data = await Wowplayers.query().orderBy("rank", "name");
        res.send(data);

    },

    async addPlayer(req, res) {
        try {
            let avatar = req.files.avatar;
            let extension = avatar.name.split(".").pop().toLowerCase();
            let andy = await Wowplayers.query().insertGraph({
            name: req.body.name.toLowerCase(),
            tagline: req.body.tagline,
            rank: req.body.rank,
            twitter: req.body.twitter,
            youtube: req.body.youtube,
            twitch: req.body.twitch,
            tiktok: req.body.tiktok,
            imageextention: extension,
            });
        
            if (!req.files) {
            res.send({
                status: false,
                message: "No file uploaded",
            });
            } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            avatar.mv("./uploads/" + req.body.name.toLowerCase() + "." + extension);
            }
            res.send({
            status: true,
            message: "Player and photo uploaded",
            });
        } catch (err) {
            if (err instanceof ConstraintViolationError) {
            res.status(409).send({
                message: "User already exists",
            });
            } else if (err instanceof TypeError) {
            res.status(409).send({
                message: "No file uploaded",
            });
            } else {
            res.status(500).send({
                message: "Server error",
            });
            }
        }
    },
    async editPlayer(req, res) {
        let data = {
            name: req.body.name,
            tagline: req.body.tagline,
            rank: req.body.rank,
            twitter: req.body.twitter,
            youtube: req.body.youtube,
            twitch: req.body.twitch,
            tiktok: req.body.tiktok,
        };
        let update = await Wowplayers.query()
            .patch(data)
            .where("name", data.name.toLowerCase());
        if (update > 0) {
            res.send("This person has been updated");
        } else {
            res.send("This person does not exist");
        }
    },

    async deletePlayer(req, res) {
        try {
            let data = {
            name: req.body.name,
            };
            let extension = await Wowplayers.query()
            .select("imageextention")
            .where("name", data.name.toLowerCase());
            let del = await Wowplayers.query()
            .delete()
            .where("name", data.name.toLowerCase());
            fs.unlink(
            `./uploads/${req.body.name}.${extension[0].imageextention}`,
            (err) => {
                if (err) {
                return;
                }
            }
            );
            if (del > 0) {
            res.send("This person and photo has been deleted");
            } else {
            res.send("This person does not exist");
            }
        } catch (err) {
            if (err instanceof TypeError) {
            res.status(409).send({
                message: "This person does not exist",
            });
            } else {
            res.status(500).send({
                message: "Server error",
            });
            }
        }
    }
}



