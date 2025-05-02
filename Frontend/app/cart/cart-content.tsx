"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 15 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

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
        "http://localhost:3000/api/cart/removeItem",
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
      toast({ title: "🛒 อัปเดตจำนวนสินค้าเรียบร้อย!" });
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-medium text-gray-900 mb-8">
        Shopping Cart
      </h1>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-4">Product</th>
                      <th className="text-center pb-4">Quantity</th>
                      <th className="text-right pb-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={`${item.productId}-${item.size}`}
                        className="border-b"
                      >
                        <td className="py-4">
                          <div className="flex items-center">
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
                Continue Shopping
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  variant="luxury"
                  size="lg"
                  className="w-full mt-6"
                  asChild
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
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
            <Link href="/product">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
