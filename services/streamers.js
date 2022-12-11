
let {Streamers} = require("../models/streamers");
//only service goes to DB

module.exports = {
  async getAll () {
    try {
      const streamers = await Streamers.query().orderBy('name')
      return streamers
    } catch (err) {
        throw new Error(err)
    }
},

  async addStreamer (name) {    
    try {
      const newStreamer = await Streamers.query().insertGraph({ name: (name).toLowerCase() });
      return newStreamer
    } catch (err) {
      if (err instanceof ConstraintViolationError) {
        throw new Error('Streamer already exists')
      } else {
        throw new Error(err)
      }
    }
    },

    async deleteStreamer (name) {
      try {
        const del = await Streamers.query().delete().where("name", (name).toLowerCase());
        return del
      } catch (err) {
        throw new Error('Name not found')
      }
    }
}