"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Check } from "lucide-react"

interface CheckoutModalProps {
  items?: any[]
  onClose: () => void
  onConfirm?: () => void
  receipt?: any
  isReceipt?: boolean
}

export default function CheckoutModal({ items = [], onClose, onConfirm, receipt, isReceipt }: CheckoutModalProps) {
  const total = isReceipt ? receipt.total : items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{isReceipt ? "Order Confirmation" : "Review Order"}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Receipt Success */}
          {isReceipt && (
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-foreground font-semibold mb-2">Order Placed Successfully!</p>
              <p className="text-muted-foreground text-sm mb-4">Order #{receipt.orderNumber}</p>
              <p className="text-muted-foreground text-sm">Date: {receipt.date}</p>
            </div>
          )}

          {/* Items */}
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {(isReceipt ? receipt.items : items).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="text-foreground font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-foreground font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Subtotal:</span>
              <span className="text-foreground font-medium">${(total * 0.9).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground text-sm">Tax (10%):</span>
              <span className="text-foreground font-medium">${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-bold">Total:</span>
              <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              {isReceipt ? "Close" : "Cancel"}
            </Button>
            {!isReceipt && onConfirm && (
              <Button onClick={onConfirm} className="flex-1">
                Complete Purchase
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
