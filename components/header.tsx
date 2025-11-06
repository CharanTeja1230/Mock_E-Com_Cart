"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
            E
          </div>
          <h1 className="text-2xl font-bold text-foreground">Shop</h1>
        </div>

        <Button onClick={onCartClick} variant="outline" className="relative bg-transparent">
          <ShoppingCart className="w-5 h-5" />
          <span className="ml-2">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
