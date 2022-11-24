var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

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
            tiktok text

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
    }
});


module.exports = db