'use strict'

let db = require("./database.js")
let express = require('express');
let app = module.exports = express();
const cors = require('cors');
let bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function error(status, msg) {
  let err = new Error(msg);
  err.status = status;
  return err;
}

app.use('/api', function(req, res, next){

  let key = req.query['api-key'];

  if (!key) return next(error(400, 'api key required'));

  if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'))

  req.key = key;
  next();
});
app.use(cors());
app.use(
  fileUpload({
      limits: {
          fileSize: 10000000, // Around 10MB
      },
      abortOnLimit: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/api/upload-avatar/', async (req, res) => {
  try {
    if(!req.files) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let avatar = req.files.avatar;
        
        //Use the mv() method to place the file in the upload directory (i.e. "uploads")
        avatar.mv('./uploads/' + avatar.name);

        //send response
        res.send({
            status: true,
            message: 'File is uploaded',
            data: {
                name: avatar.name,
                mimetype: avatar.mimetype,
                size: avatar.size
            }
        });
    }
} catch (err) {
    res.status(500).send(err);
}
});

app.post('/api/upload/', (req, res) => {
  console.log(req.files.joe)
    let errors=[]
    if (!req.files.joe){
        errors.push("No photo");
    }
   
    let data = {
      profilephoto: req.files.joe
    }

    let sql ='INSERT INTO photos (profilephoto) VALUES (?)'
    let params =[data.profilephoto]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});


let apiKeys = ['7U8nmLES48','chANJ066ir'];


app.delete("/api/wowplayers/", (req, res, next) => {
  console.log(req.body.name)
  db.run(
      'DELETE FROM wowplayers WHERE name = ?',
      [req.body.name],
      function (err, result) {
          if (err){
              
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({"message":"deleted", changes: this.changes})
  });
})


app.get("/api/getphotos", (req, res, next) => {
  let sql = "select * from photos"
  let params = []
  console.log('test')
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});


app.get("/api/wowplayers", (req, res, next) => {
    let sql = "select * from wowplayers"
    let params = []
    console.log('test')
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

//controller does validation, routing, and error handling
//controller shoudlnt run sql queries
//look at migrations (DB)

app.patch("/api/user/:id", (req, res, next) => {
  console.log('joe')
  console.log(req.body.name)
  let data = {
      name: req.body.name,
      tagline: req.body.tagline,
      twitter : req.body.twitter,
      youtube : req.body.youtube,
      twitch : req.body.twitch,
      tiktok : req.body.tiktok

  }
  db.run(
      `UPDATE wowplayers set 
         name = COALESCE(?,name), 
         tagline = COALESCE(?,tagline), 
         twitter = COALESCE(?,twitter), 
         youtube = COALESCE(?,youtube), 
         twitch = COALESCE(?,twitch), 
         tiktok = COALESCE(?,tiktok) 
         WHERE id = ?`,
      [data.name, data.tagline, data.twitter, data.youtube, data.twitch, data.tiktok, req.params.id],
      function (err, result) {
        console.log(err)
          if (err){
              res.status(400).json({"error": err.message})
              return;
          }
          res.json({
              message: "success",
              data: data,
              changes: this.changes
          })
  });
})



app.post("/api/wowplayers/", (req, res, next) => {
    console.log('test')
    let errors=[]
    if (!req.body.name){
        errors.push("No name specified");
    }
    if (!req.body.tagline){
        errors.push("No tagline specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    let data = {
      name: req.body.name,
      tagline: req.body.tagline,
      twitter : req.body.twitter,
      youtube : req.body.youtube,
      twitch : req.body.twitch,
      tiktok : req.body.tiktok,


    }

    let sql ='INSERT INTO wowplayers (name, tagline, twitter,youtube,twitch,tiktok) VALUES (?,?,?,?,?,?)'
    let params =[data.name, data.tagline, data.twitter,data.youtube,data.twitch,data.tiktok]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})






app.use(express.static('uploads'));



app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.send({ error: err.message });
});

app.use(function(req, res){
  res.status(404);
  res.send({ error: "Sorry, can't find that" })
});

const port = process.env.PORT || 80;

if (!module.parent) {
  app.listen(port);
  console.log('Express started on port 80');
}