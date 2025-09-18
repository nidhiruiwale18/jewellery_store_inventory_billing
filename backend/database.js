const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the inventory database.');
});

db.serialize(() => {
  // Create 'items' table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    weight REAL,
    price REAL,
    quantity INTEGER,
    image_url TEXT
  )`);

  // Create 'bills' table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    item_id INTEGER,
    quantity INTEGER,
    total_price REAL,
    bill_date DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
