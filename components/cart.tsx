"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
  onCheckout: () => void
}

export default function Cart({ items, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Card className="p-6 sticky top-20 h-fit">
      <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-foreground text-sm">{item.name}</span>
                <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="h-6 w-6 p-0">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-border text-sm font-semibold text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <>
          <div className="border-t border-border pt-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-foreground font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={onCheckout} size="lg" className="w-full">
            Checkout
          </Button>
        </>
      )}
    </Card>
  )
}
