//Load sqlite3 in revolver
const sqlite3 = require('sqlite3').verbose();

//Open new file
const db = new sqlite3.Database('./letters.db');

//Create table
db.run(`
    CREATE TABLE IF NOT EXISTS letters(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        wish TEXT NOT NULL,
        message TEXT,
        created_at TEXT NOT NULL,
        gift_token TEXT
    )    
`);

// db.run(`ALTER TABLE letters ADD COLUMN gift_token TEXT`, (err) => {
//   if (err) {
//     console.error("Column might already exist or error:", err.message);
//   } else {
//     console.log("✅ gift_token column added!");
//   }
// });

//db.run(`DELETE FROM letters`);

//Export the db. Fire!
module.exports = db;