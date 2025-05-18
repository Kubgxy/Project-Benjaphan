"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X, MessageCircleHeart } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import { WishlistItem } from "@/lib/types";
import { getBaseUrl } from "@/lib/api";

export function WishlistContent() {
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // default true ไว้ก่อน
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const openModalToChooseSize = (product: any) => {
    if (!product.availableSizes || product.availableSizes.length === 0) {
      toast({
        title: "ไม่พบขนาดสินค้า",
        description: "สินค้านี้ไม่มีขนาดให้เลือก",
        variant: "destructive",
      });
      return;
    }

    setSelectedProduct(product);
    setSelectedSize(null); // reset เผื่อเปิดหลายครั้ง
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `${getBaseUrl()}/api/wishlist/getWishlist`,
        {
          withCredentials: true,
        }
      );
      const products = response.data.wishlist?.products || [];
      console.log("Fetched wishlist items:", products);
      setWishlistItems(products);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // ไม่ได้ Login
        setIsLoggedIn(false);
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "โหลดข้อมูลรายการโปรดไม่สำเร็จ",
          variant: "destructive",
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string, name: string) => {
    if (!selectedProduct || !selectedSize) return;
    try {
      await axios.post(
        `${getBaseUrl()}/api/cart/addToCart`,
        {
          productId: selectedProduct.id_product,
          quantity: 1,
          size: selectedSize,
        },
        { withCredentials: true }
      );

      setAddedToCart(selectedProduct.id_product);
      toast({
        title: "✅ เพิ่มสินค้าลงตะกร้าสำเร็จ!",
        description: `${selectedProduct.name} ไซส์ ${selectedSize} ถูกเพิ่มลงตะกร้าแล้ว`,
        duration: 3000,
      });
      setSelectedProduct(null);
      setSelectedSize(null);
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
        `${getBaseUrl()}/api/wishlist/removeFromWishlist`,
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
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              เลือกขนาดสำหรับ {selectedProduct.name}
            </h2>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {selectedProduct.availableSizes.map((s: any, idx: number) => (
                <Button
                  key={idx}
                  variant={selectedSize === s.size ? "default" : "outline"}
                  onClick={() => setSelectedSize(s.size)}
                >
                  {s.size}
                </Button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelectedProduct(null)}>
                ยกเลิก
              </Button>
              <Button
                disabled={!selectedSize}
                onClick={() => {
                  if (selectedProduct && selectedSize) {
                    handleAddToCart(
                      selectedProduct.id_product,
                      selectedProduct.name
                    );
                  }
                }}
              >
                ยืนยัน
              </Button>
            </div>
          </div>
        </div>
      )}

      <h1 className="flex items-center gap-2 text-3xl font-display font-medium text-brown-800 mb-8">
        <MessageCircleHeart className="w-8 h-8 text-yellow-500" />
        รายการโปรด
      </h1>

      {loading ? (
        <div className="text-center py-16">กำลังโหลด...</div>
      ) : !isLoggedIn ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-display font-medium text-gray-900 mb-2">
            กรุณาเข้าสู่ระบบ
          </h2>
          <p className="text-gray-600 mb-8">
            คุณต้องเข้าสู่ระบบก่อนเพื่อดูและจัดการรายการโปรดของคุณ
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/account">
              <Button className="bg-gold-600 hover:bg-gold-700 px-6 py-3">
                เข้าสู่ระบบ / สมัครสมาชิก
              </Button>
            </Link>
            <Link href="/product">
              <Button variant="outline" className="px-6 py-3">
                กลับไปหน้าสินค้า
              </Button>
            </Link>
          </div>
        </div>
      ) : wishlistItems.length > 0 ? (
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 md:p-6">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-4">สินค้า</th>
                      <th className="text-right pb-4">ราคา</th>
                      <th className="text-right pb-4">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistItems.map((item) => {
                      const product = item.productId;
                      const imageUrl = product?.images?.[0]
                        ? `${getBaseUrl()}${product.images[0]}`
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
                                  className="object-contain rounded"
                                />
                              </div>
                              <Link
                                href={`/product/${product.id_product}`}
                                className="font-medium hover:text-gold-600 transition-colors"
                              >
                                {product.name}
                              </Link>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="font-medium">
                              {formatPrice(product.price)}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openModalToChooseSize(product)} // ✅ แก้ตรงนี้
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

              {/* Mobile Card */}
              <div className="md:hidden space-y-4">
                {wishlistItems.map((item) => {
                  const product = item.productId;
                  const imageUrl = product?.images?.[0]
                    ? `${getBaseUrl()}${product.images[0]}`
                    : "/placeholder.jpg";
                  return (
                    <div
                      key={product._id}
                      className="border rounded-lg p-4 flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20 bg-gray-50 flex-shrink-0 rounded">
                          <Image
                            src={imageUrl}
                            alt={product.name || "Product Image"}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/product/${product.id_product}`}
                            className="font-medium hover:text-gold-600 transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModalToChooseSize(product)}
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

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveWishlist(product._id)}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-1" />
                          ลบออกจากรายการโปรด
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
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
