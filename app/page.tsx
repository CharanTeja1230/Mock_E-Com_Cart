"use client"

import React, { useState } from "react"
import Header from "@/components/header"
import ProductGrid from "@/components/product-grid"
import Cart from "@/components/cart"
import CheckoutModal from "@/components/checkout-modal"

interface CartItem {
  id: number
  productId?: number
  name: string
  price: number
  quantity: number
  image: string
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [receipt, setReceipt] = useState<any>(null)

  // Build API URL: prefer explicit NEXT_PUBLIC_API_URL, otherwise proxy via /api-ext
  const api = (path: string) =>
    process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}${path}` : `/api-ext${path}`

  // load cart from backend on first render
  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(api("/api/cart"))
        const data = await res.json()
        setCartItems(data.items || [])
      } catch (err) {
        console.error("Failed to load cart", err)
      }
    }
    load()
  }, [])

  const addToCart = async (product: any) => {
    try {
      const existing = cartItems.find((it) => it.productId === product.id || it.id === product.id)
      const newQty = existing ? existing.quantity + 1 : 1
      const res = await fetch(api("/api/cart"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, qty: newQty }),
      })
      const data = await res.json()
      if (data.items) setCartItems(data.items)
    } catch (err) {
      console.error("Add to cart failed", err)
    }
  }

  const removeFromCart = async (cartItemId: number) => {
    try {
  const res = await fetch(api(`/api/cart/${cartItemId}`), { method: "DELETE" })
      const data = await res.json()
      if (data.items) setCartItems(data.items)
    } catch (err) {
      console.error("Remove from cart failed", err)
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      // productId here is actually cart item id in the UI; backend expects productId - attempt to map
      const item = cartItems.find((it) => it.id === productId || it.productId === productId)
      if (!item) return
      if (quantity <= 0) {
        await removeFromCart(item.id)
        return
      }
      const res = await fetch(api("/api/cart"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, qty: quantity }),
      })
      const data = await res.json()
      if (data.items) setCartItems(data.items)
    } catch (err) {
      console.error("Update quantity failed", err)
    }
  }

  const handleCheckout = async () => {
    try {
        const res = await fetch(api("/api/checkout"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems }),
        })

      const data = await res.json()
      if (data.success) {
        setReceipt(data.receipt)
        setShowCheckout(false)
        setCartItems([])
      }
    } catch (error) {
      console.error("[v0] Checkout failed:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={cartItems.length} onCartClick={() => setShowCheckout(true)} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-foreground mb-8">Shop</h1>
            <ProductGrid onAddToCart={addToCart} />
          </div>

          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onCheckout={() => setShowCheckout(true)}
            />
          </div>
        </div>
      </div>

      {showCheckout && cartItems.length > 0 && (
        <CheckoutModal items={cartItems} onClose={() => setShowCheckout(false)} onConfirm={handleCheckout} />
      )}

      {receipt && <CheckoutModal receipt={receipt} onClose={() => setReceipt(null)} isReceipt />}
    </main>
  )
}
