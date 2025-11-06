import { cartStore } from "@/lib/cart-store"

export async function GET() {
  const items = cartStore.getCart()
  const total = cartStore.getTotal()

  return Response.json(
    {
      items,
      total,
    },
    { status: 200 },
  )
}

export async function POST(request: Request) {
  try {
    const { productId, name, price, quantity } = await request.json()

    if (!productId || !name || price === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const items = cartStore.addItem(productId, name, price, quantity || 1)
    const total = cartStore.getTotal()

    return Response.json(
      {
        success: true,
        items,
        total,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json({ error: "Failed to add item to cart" }, { status: 400 })
  }
}
