"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import { WishlistItem } from "@/lib/types";

export function WishlistContent() {
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/wishlist/getWishlist", {
        withCredentials: true,
      });
      const products = response.data.wishlist?.products || [];
      console.log("Fetched wishlist items:", products);
      setWishlistItems(products);
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "โหลดข้อมูลรายการโปรดไม่สำเร็จ",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAddToCart = async (productId: string, name: string) => {
    try {
      await axios.post(
        "http://localhost:3000/api/cart/addToCart",
        {
          productId,
          quantity: 1,
        },
        { withCredentials: true }
      );

      setAddedToCart(productId);
      toast({
        title: "✅ เพิ่มสินค้าลงตะกร้าสำเร็จ!",
        description: `${name} ถูกเพิ่มลงตะกร้าแล้ว`,
        duration: 3000,
      });
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleRemoveWishlist = async (productId: string) => {
    try {
      await axios.post(
        "http://localhost:3000/api/wishlist/removeFromWishlist",
        { productId },
        { withCredentials: true }
      );
      toast({ title: "💔 ลบออกจากรายการโปรดแล้ว", duration: 3000 });
      fetchWishlist();
      console.log("sending to remove:", productId);
    } catch (error) {
      console.error("❌ Error removing wishlist item:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบออกจากรายการโปรดได้",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-medium text-gray-900 mb-8">
        รายการโปรด
      </h1>

      {wishlistItems.length > 0 ? (
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-4">สินค้า</th>
                    <th className="text-right pb-4 hidden md:table-cell">
                      ราคา
                    </th>
                    <th className="text-right pb-4">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlistItems.map((item) => {
                    const product = item.productId;
                    const imageUrl = product?.images?.[0]
                      ? `http://localhost:3000${product.images[0]}`
                      : "/placeholder.jpg";

                    return (
                      <tr key={product._id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="relative w-16 h-16 mr-4 bg-gray-50">
                              <Image
                                src={imageUrl}
                                alt={product.name || "Product Image"}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/product/${product.id_product}`}
                                className="font-medium hover:text-gold-600 transition-colors"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-gray-600 md:hidden">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right hidden md:table-cell">
                          <span className="font-medium">
                            {formatPrice(product.price)}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleAddToCart(product.id_product, product.name)
                              }
                              disabled={addedToCart === product.id_product}
                            >
                              {addedToCart === product.id_product ? (
                                <>
                                  <ShoppingBag className="h-4 w-4 mr-1" />
                                  เพิ่มลงตะกร้าแล้ว
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-4 w-4 mr-1" />
                                  เพิ่มลงตะกร้า
                                </>
                              )}
                            </Button>
                            <button
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              onClick={() =>
                                handleRemoveWishlist(product._id)
                              }
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link
              href="/product"
              className="text-gold-600 hover:text-gold-700 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              กลับไปที่หน้าสินค้า
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-display font-medium text-gray-900 mb-2">
            ไม่มีรายการโปรด
          </h2>
          <p className="text-gray-600 mb-8">
            คุณยังไม่มีสินค้าที่บันทึกไว้ในรายการโปรดของคุณ
          </p>
          <Button variant="luxury" size="lg" asChild>
            <Link href="/product">กลับไปที่หน้าสินค้า</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
