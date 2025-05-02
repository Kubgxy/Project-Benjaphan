"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Package,
  Heart,
  LogOut,
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

export function AccountContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile, logout, setUser } =
    useAuth();
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [showLoginForm, setShowLoginForm] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser(); // 🟢 ดึงข้อมูล user ทุกครั้งที่เข้า AccountContent
    }
  }, [isAuthenticated]);
  const refreshUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/getUserProfile", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to fetch user profile");
        return;
      }

      const data = await res.json();
      console.log("✅ Refreshed user data:", data.user);
      setUser(data.user); // ✅ << อัปเดต user ใน context
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  console.log("user:", user);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview รูปก่อน
    const reader = new FileReader();

    reader.readAsDataURL(file);

    // เตรียมส่งไป backend
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:3000/api/user/updateuser", {
        method: "PATCH",
        body: formData,
        credentials: "include", // ✅ ใช้ cookie-based auth
      });

      // 🟢 เช็กว่าเป็น JSON ก่อนค่อย .json()
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const errorText = contentType?.includes("application/json")
          ? await res.json()
          : await res.text();
        console.error("Upload failed! Server returned error:", errorText);
        return;
      }

      if (contentType?.includes("application/json")) {
        const data = await res.json();
        console.log("Updated user:", data);
        await refreshUser();
      } else {
        const text = await res.text();
        console.warn("Unexpected response (not JSON):", text);
      }
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
                Login
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  !showLoginForm
                    ? "text-gold-600 border-b-2 border-gold-600"
                    : "text-gray-500"
                }`}
                onClick={() => setShowLoginForm(false)}
              >
                Register
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
      <h1 className="text-3xl font-display font-medium text-gray-900 mb-8">
        My Account
      </h1>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div
                  className="relative w-16 h-16 rounded-full overflow-hidden mr-4 group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()} // 👉 ย้ายมาใส่ที่ <div> ตรงนี้!
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
                  <h2 className="font-medium text-lg">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === "profile"
                      ? "bg-gold-50 text-gold-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === "orders"
                      ? "bg-gold-50 text-gold-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Orders
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === "wishlist"
                      ? "bg-gold-50 text-gold-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    router.push("/wishlist");
                  }}
                >
                  <Heart className="h-5 w-5 mr-3" />
                  Wishlist
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === "addresses"
                      ? "bg-gold-50 text-gold-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Addresses
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === "payment"
                      ? "bg-gold-50 text-gold-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Payment Methods
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === "settings"
                      ? "bg-gold-50 text-gold-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>
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
                    Profile Information
                  </h2>
                  <ProfileForm />
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-medium mb-6">Order History</h2>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      You haven't placed any orders yet.
                    </p>
                    <Button variant="luxury" asChild>
                      <a href="/product">Start Shopping</a>
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <h2 className="text-xl font-medium mb-6">Saved Addresses</h2>
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      You don't have any saved addresses yet.
                    </p>
                    <Button variant="luxury">Add New Address</Button>
                  </div>
                </div>
              )}

              {activeTab === "payment" && (
                <div>
                  <h2 className="text-xl font-medium mb-6">Payment Methods</h2>
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      You don't have any saved payment methods yet.
                    </p>
                    <Button variant="luxury">Add Payment Method</Button>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-medium mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Email Preferences
                      </h3>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="marketing-emails"
                          className="mr-2"
                        />
                        <label htmlFor="marketing-emails">
                          Receive marketing emails
                        </label>
                      </div>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="order-updates"
                          className="mr-2"
                          checked
                        />
                        <label htmlFor="order-updates">
                          Receive order updates
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-2">
                        Privacy Settings
                      </h3>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="data-sharing"
                          className="mr-2"
                        />
                        <label htmlFor="data-sharing">
                          Allow data sharing with partners
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-2">
                        Account Actions
                      </h3>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
