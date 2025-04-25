"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { showSuccess, showError } from "@/lib/swal";
import Swal from "sweetalert2";

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter();


  const login = async (email: string, password: string): Promise<"customer" | "admin" | null> => {
    try {
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ สำคัญมาก!
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // ✅ ดึง role ที่ Backend ส่งกลับมา
      return data.user.role as "customer" | "admin";
    } catch (error) {
      console.error("❌ Login error:", error);
      return null;
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const role = await login(email, password);
  
      if (!role) {
        showError("เข้าสู่ระบบไม่สําเร็จ!");
        return;
      }
  
      await Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสําเร็จ!',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
  
      if (role === "customer") {
        window.location.href = "http://localhost:5173/";
      } else if (role === "admin") {
        window.location.href = "http://localhost:8081/";
      } else {
      }
    } catch (err) {
      showError("กรุณาลองอีกครั้ง!");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <a href="#" className="text-sm text-gold-600 hover:text-gold-700">
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          required
        />
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="mb-4">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
      </div>

      <div>
        <Button type="submit" variant="luxury" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </div>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">Demo credentials: user@example.com / password123</p>
      </div>
    </form>
  )
}

