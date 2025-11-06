const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { openDatabase, ready } = require("./db")

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())

const db = openDatabase()

// GET /api/products
app.get("/api/products", (req, res) => {
  db.all("SELECT id, name, price, image FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" })
    res.json({ products: rows })
  })
})

// GET /api/cart
app.get("/api/cart", (req, res) => {
  db.all("SELECT id, productId, name, price, quantity FROM cart", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch cart" })
    const total = rows.reduce((sum, it) => sum + it.price * it.quantity, 0)
    res.json({ items: rows, total: Number(total.toFixed(2)) })
  })
})

// POST /api/cart { productId, qty }
app.post("/api/cart", (req, res) => {
  try {
    const { productId, qty } = req.body
    if (!productId || typeof qty !== "number") return res.status(400).json({ error: "Missing fields" })

    // Get product info
    db.get("SELECT id, name, price FROM products WHERE id = ?", [productId], (err, product) => {
      if (err || !product) return res.status(400).json({ error: "Invalid productId" })

      if (qty <= 0) {
        // remove any matching cart item
        db.run("DELETE FROM cart WHERE productId = ?", [productId], function (dErr) {
          if (dErr) return res.status(500).json({ error: "Failed to remove item" })
          db.all("SELECT id, productId, name, price, quantity FROM cart", (e, rows) => {
            const total = rows.reduce((s, it) => s + it.price * it.quantity, 0)
            res.json({ success: true, items: rows, total: Number(total.toFixed(2)) })
          })
        })
        return
      }

      // Upsert: if exists, set quantity, else insert
      db.get("SELECT id FROM cart WHERE productId = ?", [productId], (gErr, row) => {
        if (gErr) return res.status(500).json({ error: "DB error" })
        if (row) {
          db.run("UPDATE cart SET quantity = ? WHERE id = ?", [qty, row.id], function (uErr) {
            if (uErr) return res.status(500).json({ error: "Failed to update" })
            db.all("SELECT id, productId, name, price, quantity FROM cart", (e, rows) => {
              const total = rows.reduce((s, it) => s + it.price * it.quantity, 0)
              res.json({ success: true, items: rows, total: Number(total.toFixed(2)) })
            })
          })
        } else {
          db.run(
            "INSERT INTO cart (productId, name, price, quantity) VALUES (?, ?, ?, ?)",
            [product.id, product.name, product.price, qty],
            function (iErr) {
              if (iErr) return res.status(500).json({ error: "Failed to add" })
              db.all("SELECT id, productId, name, price, quantity FROM cart", (e, rows) => {
                const total = rows.reduce((s, it) => s + it.price * it.quantity, 0)
                res.json({ success: true, items: rows, total: Number(total.toFixed(2)) })
              })
            }
          )
        }
      })
    })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// DELETE /api/cart/:id
app.delete("/api/cart/:id", (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" })
  db.run("DELETE FROM cart WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to delete" })
    db.all("SELECT id, productId, name, price, quantity FROM cart", (e, rows) => {
      const total = rows.reduce((s, it) => s + it.price * it.quantity, 0)
      res.json({ success: true, items: rows, total: Number(total.toFixed(2)) })
    })
  })
})

// POST /api/checkout { items, name?, email? }
app.post("/api/checkout", (req, res) => {
  try {
    const { items, name, email } = req.body
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Cart is empty" })

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const receipt = {
      orderNumber: `ORD-${Math.floor(Math.random() * 100000)}`,
      items,
      total: Number(total.toFixed(2)),
      date: new Date().toISOString(),
      customer: { name: name || null, email: email || null },
    }

    // Clear cart
    db.run("DELETE FROM cart", [], (err) => {
      if (err) console.error("Failed to clear cart after checkout", err)
      res.json({ success: true, receipt })
    })
  } catch (error) {
    res.status(500).json({ error: "Checkout failed" })
  }
})

if (require.main === module) {
  ready.then(() => {
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
  })
}

module.exports = { app, ready }
