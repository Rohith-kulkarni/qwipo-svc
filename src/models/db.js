const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./data.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database connection established successfully");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS addresses (
      address_id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      address_line TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
    )
  `);
});

module.exports = db;
