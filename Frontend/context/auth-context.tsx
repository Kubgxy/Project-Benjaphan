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
    try {
      const savedUser = localStorage.getItem("luxe-jewels-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("luxe-jewels-user", JSON.stringify(user))
      } else {
        localStorage.removeItem("luxe-jewels-user")
      }
    } catch (error) {
      console.error("Failed to save user to localStorage:", error)
    }
  }, [user])

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

  const logout = () => {
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      return true
    }

    return false
  }

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

