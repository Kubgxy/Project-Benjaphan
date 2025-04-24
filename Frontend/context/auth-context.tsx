"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
  },
  {
    id: "2",
    email: "jane@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/me", {
          method: "GET",
          credentials: "include", // ✅ ใช้ cookie-based auth
        });
  
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
  
        const data = await res.json();
        setUser(data.user); // <-- จาก backend ส่ง req.user กลับมา
      } catch (error) {
        setUser(null); // ถ้า token หมดอายุ หรือไม่มี cookie
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  

  // Save user to localStorage whenever it changes
  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/user/logout", {
        method: "POST",
        credentials: "include", // ✅ cookie-based auth สำคัญ!
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null); // เคลียร์ context
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };
  

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.firstName}!`,
      })
      return true
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const userExists = MOCK_USERS.some((u) => u.email === email)

    if (userExists) {
      toast({
        title: "Registration failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      })
      return false
    }

    // Create new user
    const newUser = {
      id: Math.random().toString(36).substring(2, 10),
      email,
      firstName,
      lastName,
    }

    setUser(newUser)
    toast({
      title: "Registration successful",
      description: `Welcome to LUXE JEWELS, ${firstName}!`,
    })
    return true
  }



  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:3000/api/user/edituser", {
        method: "PATCH",
        credentials: "include", // ✅ ใช้ cookie-based auth
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!res.ok) {
        console.error("Failed to update profile");
        return false;
      }
  
      const data = await res.json();
      console.log("✅ Profile updated:", data);
  
      // 🟢 Refresh context ด้วย user ใหม่ที่ได้จาก backend
      setUser(data.user); 
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };
  
  

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

