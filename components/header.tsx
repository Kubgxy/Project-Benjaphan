"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Menu, X, User, Heart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useAuth } from "@/context/auth-context"
import { SearchDialog } from "@/components/search-dialog"

export function Header() {
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const { isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <div className="bg-gold-600 text-white py-2 text-center text-sm font-medium">
        <div className="container mx-auto px-4">
          <p>โปรโมชั่นพิเศษ: ซื้อทองครบ 5,000 บาท รับฟรี! จี้พระพุทธรูปมงคล มูลค่า 599 บาท</p>
        </div>
      </div>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-cream-50 py-4"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative h-16 w-16 mr-3">
                  <Image src="/logo-bencharm.png" alt="เบญจภัณฑ์๕" fill className="object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-medium text-gold-600">เบญจภัณฑ์๕</h1>
                  <p className="text-xs text-brown-600">เครื่องประดับมงคล เสริมดวง</p>
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium text-brown-800 hover:text-gold-600 transition-colors">
                หน้าแรก
              </Link>
              <Link href="/blog" className="text-sm font-medium text-brown-800 hover:text-gold-600 transition-colors">
                บทความ
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-brown-800 hover:text-gold-600 transition-colors"
              >
                สินค้าทั้งหมด
              </Link>
              <Link
                href="/auspicious"
                className="text-sm font-medium text-brown-800 hover:text-gold-600 transition-colors"
              >
                เครื่องประดับมงคล
              </Link>
              <Link href="/about" className="text-sm font-medium text-brown-800 hover:text-gold-600 transition-colors">
                เกี่ยวกับเรา
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-brown-800 hover:text-gold-600 transition-colors"
              >
                ติดต่อเรา
              </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center space-x-4">
              <button
                className="text-brown-800 hover:text-gold-600 transition-colors"
                aria-label="ค้นหา"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/wishlist"
                className="relative text-brown-800 hover:text-gold-600 transition-colors"
                aria-label="สินค้าที่ชอบ"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gold-600 text-xs text-white flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/account"
                className="text-brown-800 hover:text-gold-600 transition-colors"
                aria-label="บัญชีของฉัน"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                className="relative text-brown-800 hover:text-gold-600 transition-colors"
                aria-label="ตะกร้าสินค้า"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gold-600 text-xs text-white flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden text-brown-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="เมนู"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 mt-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-brown-800 hover:text-gold-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  หน้าแรก
                </Link>
                <Link
                  href="/products"
                  className="text-sm font-medium text-brown-800 hover:text-gold-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  สินค้าทั้งหมด
                </Link>
                <Link
                  href="/auspicious"
                  className="text-sm font-medium text-brown-800 hover:text-gold-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  เครื่องประดับมงคล
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-brown-800 hover:text-gold-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  เกี่ยวกับเรา
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-brown-800 hover:text-gold-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ติดต่อเรา
                </Link>
                <Link
                  href="/wishlist"
                  className="text-sm font-medium text-brown-800 hover:text-gold-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  สินค้าที่ชอบ
                </Link>
                <Link
                  href="/account"
                  className="text-sm font-medium text-brown-800 hover:text-gold-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAuthenticated ? "บัญชีของฉัน" : "เข้าสู่ระบบ / สมัครสมาชิก"}
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

