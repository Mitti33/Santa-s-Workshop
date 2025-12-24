const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./letters.db");

db.run("DELETE FROM letters", [], (err) => {
  if (err) return console.error(err);
  console.log("All test submissions deleted!");
  db.close();
});
