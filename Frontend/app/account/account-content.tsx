"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Package,
  Heart,
  CreditCard,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ProfileForm } from "./profile-form";
import Swal from "sweetalert2";

type AccountTab =
  | "profile"
  | "orders"
  | "wishlist"
  | "addresses"
  | "payment"
  | "settings";

interface OrderItem {
  productId: string; // 👉 กลายเป็น string
  name: string;
  images: string[];
  price: number;
  quantity: number;
  size: string;
}

interface Order {
  orderId: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: OrderItem[];
}

export function AccountContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [showLoginForm, setShowLoginForm] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated]);

  const refreshUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/getUserProfile", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return console.error("Failed to fetch user profile");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fetch("http://localhost:3000/api/user/updateuser", {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) return console.error("Upload failed");
      await refreshUser();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการออกจากระบบ",
      text: "คุณต้องการออกจากระบบหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      logout();
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/order/getOrdersByUser", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium ${
                  showLoginForm
                    ? "text-gold-600 border-b-2 border-gold-600"
                    : "text-gray-500"
                }`}
                onClick={() => setShowLoginForm(true)}
              >
                เข้้าสู่ระบบ
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  !showLoginForm
                    ? "text-gold-600 border-b-2 border-gold-600"
                    : "text-gray-500"
                }`}
                onClick={() => setShowLoginForm(false)}
              >
                สมัครสมาชิก
              </button>
            </div>
            <div className="mt-6">
              {showLoginForm ? (
                <LoginForm />
              ) : (
                <RegisterForm onSuccess={() => setShowLoginForm(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-medium text-brown-800 mb-8">
        ข้อมูลบัญชีผู้ใช้
      </h1>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div
                  className="relative w-16 h-16 rounded-full overflow-hidden mr-4 group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image
                    src={
                      user?.avatar
                        ? `http://localhost:3000${user.avatar}`
                        : "https://ui-avatars.com/api/?name=" +
                          (user?.firstName || "User")
                    }
                    alt={user?.firstName || "User"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs">
                    เปลี่ยนรูป
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <h2 className="font-medium text-lg text-brown-800">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-brown-900">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                {[
                  { tab: "profile", icon: <User />, label: "Profile" },
                  { tab: "orders", icon: <Package />, label: "Orders" },
                  { tab: "wishlist", icon: <Heart />, label: "Wishlist" },
                  { tab: "addresses", icon: <CreditCard />, label: "Addresses" },
                  { tab: "payment", icon: <CreditCard />, label: "Payment Methods" },
                  { tab: "settings", icon: <Settings />, label: "Settings" },
                ].map(({ tab, icon, label }) => (
                  <button
                    key={tab}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md  ${
                      activeTab === tab
                        ? "bg-gold-50 text-gold-600"
                        : "text-brown-800 hover:text-brown-900 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      tab === "wishlist"
                        ? router.push("/wishlist")
                        : setActiveTab(tab as AccountTab)
                    }
                  >
                    {icon}
                    <span className="ml-3">{label}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-medium mb-6">
                    ข้อมูลส่วนตัว
                  </h2>
                  <ProfileForm />
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-medium mb-6">ประวัติการสั่งซื้อ</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-4">
                        คุณยังไม่มีคำสั่งซื้อ
                      </p>
                      <Button variant="luxury" asChild>
                        <a href="/product">ซื้อสินค้าเลย</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.orderId}
                          className="border rounded p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                เลขการสั่งซื้อ : {order.orderId}
                              </p>
                              <p className="text-sm text-gray-500">
                                วันที่สั่งซื้อ :{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                สถานะ : {order.orderStatus} | Payment:{" "}
                                {order.paymentStatus}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() =>
                                router.push(`/payment?orderId=${order.orderId}`)
                              }
                            >
                              ดูรายละเอียด
                            </Button>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {order.items.map((item) => (
                              <div
                                key={`${order.orderId}-${item.productId}`}
                                className="flex items-center"
                              >
                                <Image
                                  src={`http://localhost:3000${item.images[0]}`}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="rounded mr-2 object-cover"
                                />
                                <div className="text-sm">
                                  <p>{item.name}</p>
                                  <p className="text-gray-500">
                                    {item.quantity} ชิ้น | ราคา {item.price} บาท
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="mt-2 font-bold text-right">
                            รวม {order.total.toLocaleString()} บาท
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
