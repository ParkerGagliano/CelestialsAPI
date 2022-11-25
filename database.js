var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

//migration makes the table, etc
// knex library - query builder half raw sql half orm 

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE wowplayers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text UNIQUE, 
            tagline text,
            twitter text,
            youtube text,
            twitch text,
            tiktok text,
            profilephoto blob

            )`,

        (err) => {
            if (err) {
                // Table already created
            }else{
                console.log('added jaunt')
                // Table just created, creating some rows
                let insert = 'INSERT INTO wowplayers (name, tagline, twitter, youtube, twitch, tiktok) VALUES (?,?,?,?,?,?)'
                db.run(insert, ["KYLE","Guild Leader","kyle", "kyle", "kyle", "kyle"])
            }
        }); 
        db.run(`CREATE TABLE photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profilephoto blob

            )`,

        (err) => {
            if (err) {
                // Table already created
            }
            
        });  
    }
});


module.exports = db


// look into docker compose 
// -d to run in background
// -p to specify port

// can have entre architecture in one file

//layered architecture ** look into this
// different layers 1. DB data access, 2. service, 3. view

// top down

// controller