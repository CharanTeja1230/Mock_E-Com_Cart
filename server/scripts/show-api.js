const request = require('supertest')
const { app, ready } = require('../index')

async function main() {
  await ready

  const productsRes = await request(app).get('/api/products')
  console.log('GET /api/products -> status', productsRes.status)
  console.log(JSON.stringify(productsRes.body, null, 2))

  const addRes = await request(app).post('/api/cart').send({ productId: 1, qty: 2 })
  console.log('POST /api/cart {productId:1, qty:2} -> status', addRes.status)
  console.log(JSON.stringify(addRes.body, null, 2))

  const cartRes = await request(app).get('/api/cart')
  console.log('GET /api/cart -> status', cartRes.status)
  console.log(JSON.stringify(cartRes.body, null, 2))

  const items = cartRes.body.items || []
  if (items.length) {
    const delRes = await request(app).delete(`/api/cart/${items[0].id}`)
    console.log(`DELETE /api/cart/${items[0].id} -> status`, delRes.status)
    console.log(JSON.stringify(delRes.body, null, 2))
  }

  const checkoutRes = await request(app).post('/api/checkout').send({ items: [{ id: 999, name: 'Test', price: 1.5, quantity: 2 }] })
  console.log('POST /api/checkout (mock) -> status', checkoutRes.status)
  console.log(JSON.stringify(checkoutRes.body, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
