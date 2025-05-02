"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingBasket, Banknote } from "lucide-react";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  images: string[];
}

interface CartResponse {
  cart: {
    items: CartItem[];
  };
}

export function CartContent() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const selectedCartItems = cartItems.filter(
    (item) => selectedItems[`${item.productId}-${item.size}`]
  );

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const subtotal = selectedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = selectedCartItems.length > 0 ? 50 : 0;
  const total = selectedCartItems.length > 0 ? subtotal + shipping : 0;

  const fetchCart = async () => {
    try {
      const response = await axios.get<CartResponse>(
        "http://localhost:3000/api/cart/getCart",
        { withCredentials: true } // ✅ ส่ง cookie ไปด้วย
      );
      setCartItems(response.data.cart.items);
    } catch (error) {
      console.error("❌ Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId: string, size: string) => {
    try {
      await axios.post(
        "http://localhost:3000/api/cart/removeCartItem",
        { productId, size },
        { withCredentials: true }
      );
      fetchCart(); // รีเฟรช cart หลังจากลบ
    } catch (error) {
      console.error("❌ Failed to remove item:", error);
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    size: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      await axios.post(
        "http://localhost:3000/api/cart/updateCartItem",
        {
          productId,
          size,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );
      fetchCart(); // ✅ ดึงข้อมูลตะกร้าใหม่เพื่อ refresh
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "❌ ไม่สามารถอัปเดตจำนวนได้",
        description: "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      const items = selectedCartItems.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
      }));

      await axios.post(
        "http://localhost:3000/api/checkout/select",
        { items },
        { withCredentials: true }
      );

      // เมื่อสำเร็จ → navigate ไปหน้า checkout
      router.push("/checkout");
    } catch (error) {
      console.error("❌ Failed to save selected items:", error);
      toast({
        title: "❌ ไม่สามารถเลือกสินค้าสำหรับ checkout ได้",
        description: "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="flex gap-2 items-center text-3xl font-display font-medium text-brown-800 mb-8">
        <ShoppingBasket className="w-8 h-8 text-yellow-500" />
        ตะกร้าสินค้า
      </h1>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-brown-800">
                      <th className="text-left pb-4">สินค้า</th>
                      <th className="text-center pb-4">จำนวน</th>
                      <th className="text-right pb-4">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={`${item.productId}-${item.size}`}
                        className="border-b"
                      >
                        <td className="py-4">
                          <div className="flex items-center text-brown-800">
                            <input
                              type="checkbox"
                              checked={
                                selectedItems[
                                  `${item.productId}-${item.size}`
                                ] || false
                              }
                              onChange={(e) =>
                                setSelectedItems({
                                  ...selectedItems,
                                  [`${item.productId}-${item.size}`]:
                                    e.target.checked,
                                })
                              }
                              className="mr-2"
                            />
                            <div className="relative w-16 h-16 mr-4 bg-gray-50">
                              <Image
                                src={
                                  item.images[0]
                                    ? `http://localhost:3000${item.images[0]}`
                                    : "/placeholder.svg"
                                }
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">
                                {formatPrice(item.price)}
                              </p>
                              {item.size && (
                                <p className="text-xs text-gray-500">
                                  Size: {item.size}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center">
                            <button
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              className="w-12 h-8 text-center border-t border-b border-gray-300"
                              readOnly
                            />
                            <button
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end">
                            <span className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                              onClick={() =>
                                handleRemoveItem(item.productId, item.size)
                              }
                            >
                              <X className="w-4 h-4" />
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
              <Link
                href="/products"
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
                Continue Shopping
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="flex gap-2 items-center text-lg font-medium mb-4 text-brown-800">
                  <Banknote className="w-6 h-6 text-yellow-500" />
                  สรุปยอดสั่งซื้อ
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>ราคาสินค้า</span>
                    <span>{formatPrice(subtotal)} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าจัดส่ง</span>
                    <span>{formatPrice(shipping)} บาท</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-medium">
                    <span>รวมทั้งสิ้น</span>
                    <span>{formatPrice(total)} บาท</span>
                  </div>
                </div>

                <Button
                  variant="luxury"
                  size="lg"
                  className="w-full mt-6"
                  onClick={handleProceedToCheckout}
                  disabled={selectedCartItems.length === 0}
                >
                  สั่งซื้อสินค้า
                  </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-display font-medium text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button variant="luxury" size="lg" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
