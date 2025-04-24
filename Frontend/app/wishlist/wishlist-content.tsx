"use client"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, X } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

export function WishlistContent() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    addItem(product, 1)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-medium text-gray-900 mb-8">My Wishlist</h1>

      {items.length > 0 ? (
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-4">Product</th>
                    <th className="text-right pb-4 hidden md:table-cell">Price</th>
                    <th className="text-right pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 mr-4 bg-gray-50">
                            <Image
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/product/${item.id}`}
                              className="font-medium hover:text-gold-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-gray-600 md:hidden">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right hidden md:table-cell">
                        <span className="font-medium">{formatPrice(item.price)}</span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:inline-flex"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="sm:hidden"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </Button>
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link href="/products" className="text-gold-600 hover:text-gold-700 transition-colors flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-display font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your wishlist yet.</p>
          <Button variant="luxury" size="lg" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

