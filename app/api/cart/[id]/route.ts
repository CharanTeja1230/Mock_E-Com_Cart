import { cartStore } from "@/lib/cart-store"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cartItemId = Number.parseInt(params.id, 10)

    if (isNaN(cartItemId)) {
      return Response.json({ error: "Invalid cart item ID" }, { status: 400 })
    }

    const items = cartStore.removeItem(cartItemId)
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
    return Response.json({ error: "Failed to remove item from cart" }, { status: 400 })
  }
}
