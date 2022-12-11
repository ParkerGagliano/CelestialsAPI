const { Wowplayers } = require("../models/wowplayers");
const fs = require('fs');
const {ConstraintViolationError } = require("objection");

module.exports = {
    async getAll() {
        let data = await Wowplayers.query().orderBy("rank", "name");
        return data
    },

    async addPlayer(data) {
        try {
            let newPlayer = await Wowplayers.query().insertGraph(data);
            return newPlayer
        } catch (err) {
            if (err instanceof ConstraintViolationError) {
                throw new Error("This player already exists")
            }
            else {
                throw new Error(err)
            }
 
        }

    },


    async editPlayer(data) {
        let update = await Wowplayers.query()
            .patch(data)
            .where("name", data.name.toLowerCase());
        if (update > 0) {
            return ("This person has been updated");
        } else {
            return ("This person does not exist");
        }
    },

    


    async deletePlayer(data) {
        let extension = await Wowplayers.query().where("name", data.name);
            console.log(extension)
        try {
            let del = await Wowplayers.query()
                .delete()
                .where("name", data.name);
        }
        catch (err) {
            throw new Error("Name not found")
        }
        
        try {
            fs.unlink(
            `./uploads/${data.name}.${extension[0].imageextention}`,
            (err) => {
                if (err) {
                return err;
                }
            }
            );
            return ("Player and photo deleted")
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }

    }

    }




