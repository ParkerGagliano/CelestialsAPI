'use strict'

/**
 * Module dependencies.
 */
let db = require("./database.js")
let express = require('express');
let app = module.exports = express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// create an error with .status. we
// can then use the property in our
// custom error handler (Connect respects this prop as well)

function error(status, msg) {
  let err = new Error(msg);
  err.status = status;
  return err;
}

// if we wanted to supply more than JSON, we could
// use something similar to the content-negotiation
// example.

// here we validate the API key,
// by mounting this middleware to /api
// meaning only paths prefixed with "/api"
// will cause this middleware to be invoked

app.use('/api', function(req, res, next){
  let key = req.query['api-key'];

  // key isn't present
  if (!key) return next(error(400, 'api key required'));

  // key is invalid
  if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'))

  // all good, store req.key for route access
  req.key = key;
  next();
});

// map of valid api keys, typically mapped to
// account info with some sort of database like redis.
// api keys do _not_ serve as authentication, merely to
// track API usage or help prevent malicious behavior etc.

let apiKeys = ['foo', 'bar', 'baz'];

// these two objects will serve as our faux database
// we now can assume the api key is valid,
// and simply expose the data


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





// example: http://localhost:3000/api/users/?api-key=foo
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

app.get("/api/user/:id", (req, res, next) => {
    let sql = "select * from wowplayers where id = ?"
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

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
      tiktok : req.body.tiktok

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










// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
  res.status(404);
  res.send({ error: "Sorry, can't find that" })
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}