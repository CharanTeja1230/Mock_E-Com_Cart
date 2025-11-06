const sqlite3 = require("sqlite3").verbose()
const path = require("path")

let readyResolve
const ready = new Promise((resolve) => {
  readyResolve = resolve
})

function openDatabase() {
  const dbPath = process.env.NODE_ENV === "test" ? ":memory:" : path.join(__dirname, "data.sqlite")
  const db = new sqlite3.Database(dbPath)

  // Initialize tables
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT
      )`
    )

    db.run(
      `CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL
      )`
    )

    // Seed products if empty
    db.get("SELECT COUNT(*) as cnt FROM products", (err, row) => {
      if (err) return console.error(err)
      if (row && row.cnt === 0) {
        const products = [
          [1, "Wireless Headphones", 79.99, "/wireless-headphones.png"],
          [2, "Smart Watch", 199.99, "/smartwatch-lifestyle.png"],
          [3, "USB-C Cable", 19.99, "/usb-c-cable.jpg"],
          [4, "Portable Speaker", 49.99, "/portable-speaker.png"],
          [5, "Phone Case", 24.99, "/colorful-phone-case-display.png"],
          [6, "Screen Protector", 14.99, "/screen-protector.png"],
        ]

        const stmt = db.prepare("INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)")
        for (const p of products) stmt.run(p)
        stmt.finalize((e) => {
          if (e) console.error(e)
          readyResolve()
        })
      } else {
        readyResolve()
      }
    })
  })

  return db
}

module.exports = {
  openDatabase,
  ready,
}
