const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const StreamersService = require("../services/streamers");

// check if request has things needed

//nodemon s

router.get("/", async (req, res) => {
  try {
    let data = await StreamersService.getAll();
    res.json(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.use(auth);

router.delete("/", async (req, res) => {
  try {
    let del = await StreamersService.deleteStreamer(req.body.name);
    res.send({
      message: "Streamer deleted",
    });
  } catch (err) {
    res.status(403).send({
      message: "Name not found",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let add = await StreamersService.addStreamer(req.body.name);
    res.send({
      message: "Streamer added",
    });
  } catch (err) {
    res.status(403).send({
      message: "Name already exists",
    });
  }
});

module.exports = router;
