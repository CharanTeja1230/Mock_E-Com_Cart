import { cartStore } from "@/lib/cart-store"

export async function POST(request: Request) {
  try {
    const { items } = await request.json()

    if (!items || items.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 })
    }

    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const receipt = {
      orderNumber: `ORD-${Math.floor(Math.random() * 100000)}`,
      items,
      total: Number.parseFloat(total.toFixed(2)),
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
    }

    cartStore.clearCart()

    return Response.json({ success: true, receipt }, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Checkout failed" }, { status: 500 })
  }
}
