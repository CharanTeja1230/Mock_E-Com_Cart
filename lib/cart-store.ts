interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
}

let cart: CartItem[] = []
let nextCartId = 1

export const cartStore = {
  getCart() {
    return cart
  },

  addItem(productId: number, name: string, price: number, quantity: number) {
    const existingItem = cart.find((item) => item.productId === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: nextCartId++,
        productId,
        name,
        price,
        quantity,
      })
    }

    return cart
  },

  removeItem(cartItemId: number) {
    cart = cart.filter((item) => item.id !== cartItemId)
    return cart
  },

  clearCart() {
    cart = []
    nextCartId = 1
  },

  getTotal() {
    return Number.parseFloat(cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2))
  },
}
