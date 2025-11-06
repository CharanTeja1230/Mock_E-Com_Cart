const request = require("supertest")
const { app, ready } = require("../index")

describe("API integration tests", () => {
  beforeAll(async () => {
    await ready
  })
  it("GET /api/products returns products", async () => {
    const res = await request(app).get("/api/products")
    expect(res.status).toBe(200)
    expect(res.body.products).toBeInstanceOf(Array)
    expect(res.body.products.length).toBeGreaterThan(0)
  })

  it("Cart flow: add, get, update, delete", async () => {
    // add product 1 qty 2
    let res = await request(app).post("/api/cart").send({ productId: 1, qty: 2 })
    expect(res.status).toBe(200)
    expect(res.body.items).toBeInstanceOf(Array)
    const items = res.body.items
    expect(items.find((i) => i.productId === 1).quantity).toBe(2)

    // update to qty 3
    res = await request(app).post("/api/cart").send({ productId: 1, qty: 3 })
    expect(res.status).toBe(200)
    expect(res.body.items.find((i) => i.productId === 1).quantity).toBe(3)

    // get cart
    res = await request(app).get("/api/cart")
    expect(res.status).toBe(200)
    expect(res.body.total).toBeGreaterThan(0)

    // delete by cart id
    const cartItem = res.body.items.find((i) => i.productId === 1)
    res = await request(app).delete(`/api/cart/${cartItem.id}`)
    expect(res.status).toBe(200)
    expect(res.body.items.find((i) => i.productId === 1)).toBeUndefined()
  })

  it("POST /api/checkout returns receipt and clears cart", async () => {
    // add item
    await request(app).post("/api/cart").send({ productId: 2, qty: 1 })
    const cartRes = await request(app).get("/api/cart")
    const items = cartRes.body.items
    const res = await request(app).post("/api/checkout").send({ items })
    expect(res.status).toBe(200)
    expect(res.body.receipt).toBeDefined()

    const after = await request(app).get("/api/cart")
    expect(after.body.items.length).toBe(0)
  })
})
