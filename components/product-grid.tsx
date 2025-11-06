"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  image: string
}

interface ProductGridProps {
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/products`
          : `/api-ext/products`
        const res = await fetch(apiUrl)
        const data = await res.json()
        setProducts(data.products)
      } catch (error) {
        console.error("[v0] Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>

              <Button onClick={() => onAddToCart(product)} size="sm" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
