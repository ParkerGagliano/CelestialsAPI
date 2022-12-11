"use strict";
//let db = require("./database.js")
let express = require("express");
let app = (module.exports = express());
const cors = require("cors");
const fs = require("fs");
const Knex = require("knex");
const knexConfig = require("./knexfile");
const { Model, ConstraintViolationError } = require("objection");
const { Streamers } = require("./models/streamers");
const knex = Knex(knexConfig.development);
// Bind all Models to the knex instance. You only
// need to do this once before you use any of
// your model classes.
Model.knex(knex);
async function createSchema() {
  if (await knex.schema.hasTable("wowplayers")) {
    return;
  }
  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema.createTable("wowplayers", (table) => {
    table.increments("id").primary();
    table.string("name").unique();
    table.string("tagline");
    table.string("rank");
    table.string("twitter");
    table.string("youtube");
    table.string("twitch");
    table.string("tiktok");
    table.string("imageextention");
  });
  await knex.schema.createTable("streamers", (table) => {
    table.increments("id").primary();
    table.string("name").unique();
  });
}
createSchema();

const fileUpload = require("express-fileupload");
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
let apiKeys = ["tochangeonaws"];

function error(status, msg) {
  let err = new Error(msg);
  err.status = status;
  return err;
}

app.use(
  fileUpload({
    limits: {
      fileSize: 10000000, // Around 10MB
    },
    abortOnLimit: true,
  })
);

app.get("/wowplayers", async (req, res) => {
  let data = await Wowplayers.query().orderBy("rank", "name");
  res.send(data);
});

app.post("/api/wowplayers", async (req, res) => {
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
});

app.patch("/api/wowplayers", async (req, res) => {
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
});

app.delete("/api/wowplayers", async (req, res) => {
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
});

app.get("/streamers", async (req, res) => {
  try {
    let data = await Streamers.query();
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

app.delete("/api/streamers", async (req, res) => {
  try {
    let del = await Streamers.query()
      .delete()
      .where("name", req.body.name.toLowerCase());
    res.send({
      message: "Streamer deleted",
    });
  } catch (err) {
    res.status(403).send({
      message: "Name not found",
    });
  }
});

app.post("/api/streamers", async (req, res) => {
  try {
    let andy = await Streamers.query().insertGraph({
      name: req.body.name.toLowerCase(),
    });
    res.send({
      message: "Streamer added",
    });
  } catch (err) {
    if (err instanceof ConstraintViolationError) {
      res.status(409).send({
        message: "Streamer already exists",
      });
    } else {
      res.status(500).send({
        message: "Server error",
      });
    }
  }
});

//controller does validation, routing, and error handling
//controller shoudlnt run sql queries
//look at migrations (DB)

app.use(express.static("uploads"));

app.use(function (req, res) {
  res.status(404);
  res.send({ error: "Sorry, can't find that" });
});

const port = process.env.PORT || 3000;

if (!module.parent) {
  app.listen(port);
  console.log("Express started on port 80");
}