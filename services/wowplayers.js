const { Wowplayers } = require("../models/wowplayers");

module.exports = {
    async getAll(req, res) {
        let data = await Wowplayers.query().orderBy("rank", "name");
        res.send(data);

    },

    async addPlayer(data) {
        try {
            let newPlayer = await Wowplayers.query().insertGraph(data);
            return newPlayer
        } catch (err) {
            throw new Error(err)
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



