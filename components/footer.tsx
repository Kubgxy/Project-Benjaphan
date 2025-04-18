import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-cream-100 border-t border-gold-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="relative h-16 w-16 mr-3">
                <Image src="/logo-bencharm.png" alt="เบญจภัณฑ์๕" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-medium text-gold-600">เบญจภัณฑ์๕</h1>
                <p className="text-xs text-brown-600">เครื่องประดับมงคล เสริมดวง</p>
              </div>
            </div>
            <p className="text-brown-600 mb-6">
              เบญจภัณฑ์๕ ร้านทองและเครื่องประดับมงคล คัดสรรเครื่องประดับทองคำแท้คุณภาพสูง ออกแบบเพื่อความเป็นสิริมงคลและเสริมดวงชะตา
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold-600 text-white flex items-center justify-center hover:bg-gold-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold-600 text-white flex items-center justify-center hover:bg-gold-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold-600 text-white flex items-center justify-center hover:bg-gold-700 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-heading font-medium text-brown-800 mb-4">หมวดหมู่สินค้า</h3>
            <ul className="space-y-2 text-brown-600">
              <li>
                <Link href="/products?category=rings" className="hover:text-gold-600 transition-colors">
                  แหวน
                </Link>
              </li>
              <li>
                <Link href="/products?category=bracelets" className="hover:text-gold-600 transition-colors">
                  กำไลและสร้อยข้อมือ
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings" className="hover:text-gold-600 transition-colors">
                  ต่างหู
                </Link>
              </li>
              <li>
                <Link href="/products?category=necklaces" className="hover:text-gold-600 transition-colors">
                  สร้อยคอ
                </Link>
              </li>
              <li>
                <Link href="/products?category=pendants" className="hover:text-gold-600 transition-colors">
                  จี้
                </Link>
              </li>
              <li>
                <Link href="/auspicious" className="hover:text-gold-600 transition-colors">
                  เครื่องประดับมงคล
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-heading font-medium text-brown-800 mb-4">ข้อมูลเพิ่มเติม</h3>
            <ul className="space-y-2 text-brown-600">
              <li>
                <Link href="/about" className="hover:text-gold-600 transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-600 transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-600 transition-colors">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold-600 transition-colors">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-600 transition-colors">
                  เงื่อนไขการใช้บริการ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gold-600 transition-colors">
                  การจัดส่งและการคืนสินค้า
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-heading font-medium text-brown-800 mb-4">ติดต่อเรา</h3>
            <address className="not-italic text-brown-600 space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gold-600" />
                <p>123 ถนนเยาวราช แขวงสัมพันธวงศ์ เขตสัมพันธวงศ์ กรุงเทพฯ 10100</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gold-600" />
                <p>02-123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gold-600" />
                <p>info@bencharm.com</p>
              </div>
            </address>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-brown-800 mb-2">รับข่าวสารและโปรโมชั่น</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="อีเมลของคุณ"
                  className="flex-1 px-3 py-2 border border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent rounded-l-md"
                />
                <button className="px-4 py-2 bg-gold-600 text-white hover:bg-gold-700 transition-colors rounded-r-md">
                  สมัคร
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gold-200 text-center text-brown-600">
          <p>© {new Date().getFullYear()} เบญจภัณฑ์๕ (Bencharm) - สงวนลิขสิทธิ์</p>
        </div>
      </div>
    </footer>
  )
}

