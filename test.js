"use strict";
//let db = require("./database.js")
let express = require("express");
let app = (module.exports = express());
const cors = require("cors");
const fs = require("fs");

const Knex = require("knex");
const knexConfig = require("./knexfile");

const { Model } = require("objection");
const { wowplayers } = require("./models/wowplayers");

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
    table.string("name");
    table.string("tagline");
    table.string("rank");
    table.string("twitter");
    table.string("youtube");
    table.string("twitch");
    table.string("tiktok");
  });

  const kyle = await wowplayers.query().insertGraph({
    name: "Kyle",
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

app.use("/api", function (req, res, next) {
  let key = req.query["api-key"];
  if (!key) return next(error(400, "api key required"));
  if (apiKeys.indexOf(key) === -1) return next(error(401, "invalid api key"));
  req.key = key;
  next();
});

app.use(
  fileUpload({
    limits: {
      fileSize: 10000000, // Around 10MB
    },
    abortOnLimit: true,
  })
);

app.get("/", async (req, res) => {
  let joe = await wowplayers.query().orderBy('rank', 'name');
  res.send(joe);
  
})

app.post("/", async (req, res) => {
  let andy = await wowplayers.query().insertGraph({
    name: req.body.name,
    tagline: req.body.tagline,
    rank: req.body.rank,
    twitter: req.body.twitter,
    youtube: req.body.youtube,
    twitch: req.body.twitch,
    tiktok: req.body.tiktok,
  });
  console.log(req.body.avatar)
  
  if (!req.files) {
    res.send({
      status: false,
      message: "No file uploaded",
    });
  } else {
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let avatar = req.files.avatar;
    let extension =  (avatar.name.split(".").pop()).toLowerCase();
    //Use the mv() method to place the file in the upload directory (i.e. "uploads")
    avatar.mv("./uploads/" + req.body.name + "." + extension);
  }
});

app.delete("/delete", async (req, res) => {
  console.log("dnasklo");
  let data = {
    name: req.body.name,
  };
  let del = await wowplayers.query().delete().where("name", data.name);
  if (del > 0) {
    res.send("This person has been deleted");
  }
});

app.post("/api/upload-avatar/", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar;
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      avatar.mv("./uploads/" + avatar.name);
      //send response
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: avatar.name,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/api/wowplayers/", async (req, res, next) => {
  console.log(req.body.name);
  db.run(
    "DELETE FROM wowplayers WHERE name = ?",
    [req.body.name],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

app.get("/wowplayers", async (req, res, next) => {
  let sql = "select * from wowplayers order by rank,name";
  let params = [];
  console.log("test");
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

//controller does validation, routing, and error handling
//controller shoudlnt run sql queries
//look at migrations (DB)

app.patch("/api/wowplayers", async (req, res, next) => {
  console.log("joe");
  console.log(req.body.name);
  let data = {
    name: req.body.name,
    tagline: req.body.tagline,
    rank: req.body.rank,
    twitter: req.body.twitter,
    youtube: req.body.youtube,
    twitch: req.body.twitch,
    tiktok: req.body.tiktok,
  };
  db.run(
    `UPDATE wowplayers set 
         tagline = COALESCE(?,tagline),
         rank = COALESCE(?,rank), 
         twitter = COALESCE(?,twitter), 
         youtube = COALESCE(?,youtube), 
         twitch = COALESCE(?,twitch), 
         tiktok = COALESCE(?,tiktok) 
         WHERE name = ?`,
    [
      data.tagline,
      data.rank,
      data.twitter,
      data.youtube,
      data.twitch,
      data.tiktok,
      data.name,
    ],
    function (err, result) {
      console.log(err);
      if (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes,
      });
    }
  );
});

app.post("/api/wowplayers/", async (req, res, next) => {
  console.log("test");
  let errors = [];
  if (!req.body.name) {
    errors.push("No name specified");
  }
  if (!req.body.tagline) {
    errors.push("No tagline specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  let data = {
    name: req.body.name,
    tagline: req.body.tagline,
    rank: req.body.rank,
    twitter: req.body.twitter,
    youtube: req.body.youtube,
    twitch: req.body.twitch,
    tiktok: req.body.tiktok,
  };
  let sql =
    "INSERT INTO wowplayers (name, tagline,rank, twitter,youtube,twitch,tiktok) VALUES (?,?,?,?,?,?,?)";
  let params = [
    data.name,
    data.tagline,
    data.rank,
    data.twitter,
    data.youtube,
    data.twitch,
    data.tiktok,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

app.use(express.static("uploads"));

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

app.use(function (req, res) {
  res.status(404);
  res.send({ error: "Sorry, can't find that" });
});

const port = process.env.PORT || 1000;

if (!module.parent) {
  app.listen(port);
  console.log("Express started on port 80");
}
