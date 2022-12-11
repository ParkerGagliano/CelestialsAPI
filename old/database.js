var sqlite3 = require("sqlite3").verbose();

//migration makes the table, etc
// knex library - query builder half raw sql half orm

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE wowplayers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text UNIQUE, 
            tagline text,
            rank integer,
            twitter text,
            youtube text,
            twitch text,
            tiktok text
            )`,

      (err) => {
        if (err) {
          console.log(err);
          // Table already created
        } else {
          console.log("added kyle");
          // Table just created, creating some rows
          let insert =
            "INSERT INTO wowplayers (name, tagline, rank, twitter, youtube, twitch, tiktok) VALUES (?,?,?,?,?,?,?)";
          db.run(insert, [
            "Kyle",
            "Guild Leader",
            "0",
            "_kylelandon",
            "kyle",
            "landonkyle",
            "kyle",
          ]);
        }
      }
    );
  }
});

module.exports = db;

// look into docker compose
// -d to run in background
// -p to specify port

// can have entre architecture in one file

//layered architecture ** look into this
// different layers 1. DB data access, 2. service, 3. view

// top down

// controller
