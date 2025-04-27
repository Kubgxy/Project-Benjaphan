"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

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
  const { toast } = useToast();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  
    try {
      await axios.post(
        "http://localhost:3000/api/cart/addToCart",
        {
          productId: product.id,          // ✅ ใช้ id_product ตรงนี้!
          quantity: 1,                    // ✅ ใส่ default 1 ชิ้น
          size: "FreeSize",               // ✅ หรือเลือก size ตรงนี้ถ้ามีหลาย size
        },
        { withCredentials: true }
      );
  
      setAddedToCart(true); // 🟢 ดันเข้า context ตะกร้า
      toast({
        title: "✅ เพิ่มสินค้าลงตะกร้าสำเร็จ!",
        description: `${product.name} ถูกเพิ่มลงตะกร้าแล้ว`,
      });
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const checkWishlistStatus = async () => {
    try {
        const response = await axios.get(
          "http://localhost:3000/api/wishlist/getWishlist",
          {
            withCredentials: true,
          }
        );
        const wishlistItems = response.data.wishlist?.products || [];
        const exists = wishlistItems.some(
          (item: any) => item.id_product === product.id
        );
        setIsInWishlist(exists);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };
  
    useEffect(() => {
      checkWishlistStatus();
    }, []);

      const handleWishlist = async () => {
        try {
          if (isInWishlist) {
            await axios.post(
              "http://localhost:3000/api/wishlist/removeFromWishlist",
              { productId: product.id },
              { withCredentials: true }
            );
            toast({ title: "💔 ลบออกจากรายการโปรดแล้ว" });
          } else {
            await axios.post(
              "http://localhost:3000/api/wishlist/addToWishlist",
              { productId: product.id },
              { withCredentials: true }
            );
            toast({ title: "❤️ เพิ่มลงในรายการโปรดแล้ว" });
          }
          checkWishlistStatus(); // ✅ Refresh สถานะ
        } catch (error) {
          console.error("Error updating wishlist:", error);
          toast({
            title: "❌ เกิดข้อผิดพลาด",
            description: "ไม่สามารถอัปเดตรายการโปรดได้",
            variant: "destructive",
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
          priority

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
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
        <button
          className={`absolute top-4 right-4 h-8 w-8 rounded-full bg-white flex items-center justify-center ${
            isInWishlist ? "text-red-500" : "text-gray-600 hover:text-yellow-600"
          } transition-colors shadow-md`}
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500" : ""}`} />
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
