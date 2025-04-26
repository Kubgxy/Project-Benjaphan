"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export interface AvailableSize {
  _id: string;
  size: string;
  quantity: number;
}
export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  details: string[];
  features: string[];
  formattedPrice: string;
  isNewArrival: boolean;
  isBestseller: boolean;
  isOnSale: boolean;
  rating: number;
  reviews: number;
  materials: string[];
  discount?: number;
  category: string;
  stock: number;
  availableSizes?: AvailableSize[]; // ✅ เพิ่มตรงนี้!
  availableColors?: { name: string; value: string }[]; // ✅ เพิ่มตรงนี้!
}

interface ProductCardProps {
  product: ProductCardData;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product.id); // ✅ ส่งแค่ id พอเลยครับ!
      toast({
        title: "Removed from Favorites",
        description: `${product.name} has been removed from your favorites.`,
      });
    } else {
      addToWishlist({ ...product, id_product: product.id }); // ✅ ตรงนี้ถูกแล้ว!
      toast({
        title: "Added to Favorites",
        description: `${product.name} has been added to your favorites.`,
      });
    }
  };

  return (
    <div className="group">
      <div
        className={`relative ${
          featured ? "h-96" : "h-80"
        } bg-white rounded-lg overflow-hidden shadow-md mb-4`}
      >
        <Image
          src={
            product.images && product.images.length > 0 && product.images[0]
              ? `http://localhost:3000${product.images[0]}`
              : "/placeholder.svg"
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {product.isNewArrival && (
          <span className="absolute top-4 left-4 bg-yellow-600 text-white text-xs px-2 py-1 uppercase tracking-wider rounded-md">
            New
          </span>
        )}
        {product.isOnSale && product.discount && (
          <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 uppercase tracking-wider rounded-md">
            {`Sale ${product.discount}%`}
          </span>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
          <Link
            href={`/product/${product.id}`}
            className="bg-white text-brown-800 px-6 py-3 text-sm font-medium hover:bg-yellow-600 hover:text-white  transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 rounded-md"
          >
            View Details
          </Link>
          <Button
            variant="default"
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75"
            // onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
        <button
          className={`absolute top-4 right-4 h-8 w-8 rounded-full bg-white flex items-center justify-center ${
            inWishlist ? "text-red-500" : "text-gray-600 hover:text-yellow-600"
          } transition-colors shadow-md`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500" : ""}`} />
        </button>
      </div>
      <Link href={`/product/${product.id}`} className="block">
        <div className="px-2">
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-brown-500 ml-1">
              ({product.reviews})
            </span>
          </div>
          <h3 className="text-lg font-medium text-brown-800 hover:text-yellow-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-yellow-600 font-medium">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </div>
  );
}
