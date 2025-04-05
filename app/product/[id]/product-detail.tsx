"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, Star, Minus, Plus, Check } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.availableSizes ? product.availableSizes[0] : undefined,
  )
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.availableColors ? product.availableColors[0].name : undefined,
  )
  const [addedToCart, setAddedToCart] = useState(false)

  const productInWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor)
    setAddedToCart(true)

    // Reset the added to cart message after 3 seconds
    setTimeout(() => {
      setAddedToCart(false)
    }, 3000)
  }

  const handleWishlist = () => {
    if (productInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/products"
        className="inline-flex items-center text-gray-600 hover:text-gold-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        กลับไปยังสินค้าทั้งหมด
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative h-[600px] bg-gray-50">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`relative h-24 bg-gray-50 border cursor-pointer ${selectedImage === index ? "border-gold-500" : "border-gray-200"}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-gold-500 text-gold-500" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <h1 className="text-3xl font-display font-medium text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-medium text-gray-900 mb-6">{formatPrice(product.price)}</p>

          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Details</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          {product.availableSizes && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`h-10 w-10 rounded-full border flex items-center justify-center text-sm focus:outline-none ${
                      selectedSize === size
                        ? "border-gold-500 bg-gold-50 text-gold-600"
                        : "border-gray-300 hover:border-gold-500"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.availableColors && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((color) => (
                  <button
                    key={color.name}
                    className={`h-10 w-10 rounded-full border flex items-center justify-center hover:border-gold-500 focus:outline-none ${
                      selectedColor === color.name ? "ring-2 ring-gold-500" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    onClick={() => setSelectedColor(color.name)}
                  >
                    {selectedColor === color.name && <Check className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={quantity}
                className="w-16 h-10 text-center border-t border-b border-gray-300"
                readOnly
              />
              <button
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="ml-4 text-sm text-gray-600">{product.stock} items available</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button variant="luxury" size="lg" className="flex-1" onClick={handleAddToCart}>
              เพิ่มลงตะกร้า
            </Button>
            <Button
              variant={productInWishlist ? "outline" : "luxuryOutline"}
              size="lg"
              className={`sm:w-auto ${productInWishlist ? "text-red-500 border-red-500 hover:bg-red-50" : ""}`}
              onClick={handleWishlist}
            >
              <Heart className={`h-5 w-5 ${productInWishlist ? "fill-red-500" : ""}`} />
            </Button>
            <Button variant="luxuryOutline" size="lg" className="sm:w-auto">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {addedToCart && (
            <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md flex items-center mb-6">
              <Check className="h-5 w-5 mr-2" />
              เพิ่มลงตะกร้าเรียบร้อยแล้ว
            </div>
          )}

          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Materials</h3>
            <div className="flex flex-wrap gap-2">
              {product.materials.map((material, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                  {material}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Features */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {product.features.map((feature, index) => (
          <div key={index} className="text-center p-6 border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-50 flex items-center justify-center">
              <Check className="h-6 w-6 text-gold-600" />
            </div>
            <p className="text-gray-800">{feature}</p>
          </div>
        ))}
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <h2 className="text-2xl font-display font-medium text-gray-900 mb-8">สินค้าที่คุณอาจสนใจ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>
    </div>
  )
}

