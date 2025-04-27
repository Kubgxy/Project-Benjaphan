"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { categories, testimonials } from "@/lib/data";
import type { Product } from "@/lib/types";

export default function Home() {
  // Get featured products from our mock data
  const [newProducts, setNewProducts] = useState<Product[]>([]); // ✅ สร้าง state
  const [loading, setLoading] = useState(true);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);
  const featuredCategories = categories
    .filter((cat) => cat.featured)
    .slice(0, 4);
  const featuredTestimonials = testimonials.slice(0, 3);

  const fetchNewProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/product/getNewProducts"
      );
      const data = await response.json();
      setNewProducts(data.products); // ✅ เซ็ตข้อมูลที่ได้มาเข้า state
    } catch (error) {
      console.error("Error fetching new products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewProducts(); // ✅ ดึงข้อมูลตอน mount
  }, []);

  const fetchBestsellers = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/product/getBestsellerProducts"
      );
      const data = await response.json();
      setBestsellers(data.products);
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    } finally {
      setLoadingBestsellers(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/production.jpg"
            alt="เครื่องประดับทองคำแท้"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-white">
            <h1 className="text-5xl md:text-7xl font-display font-medium leading-tight mb-6">
              เบญจภัณฑ์ ๕
            </h1>
            <h2 className="text-4xl gold-text-gradient">
              ของดีมีศรัทธา เสริมบุญหนา วาสนาเปล่งประกาย
            </h2>
            <p className="text-lg md:text-lg mb-8 text-white/90 font-light">
              เปล่งประกายทั้งภายนอกและภายใน เสริมโชคลาภ ดึงดูดความสำเร็จ
              ให้ชีวิตงดงามทุกก้าว
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                className="bg-gold-600 hover:bg-gold-700 text-base"
                asChild
              >
                <Link href="/products">ดูสินค้าทั้งหมด</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base bg-transparent text-white border-white hover:bg-white/10"
                asChild
              >
                <Link href="/auspicious">เครื่องประดับมงคล</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ส่วนแสดงจุดเด่น */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="relative w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-4">
                <Image
                  src="/icons/gold-quality.svg"
                  alt="ทองคำแท้"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-heading font-medium text-brown-800 mb-2">
                ทองคำแท้ 100%
              </h3>
              <p className="text-brown-600">
                เครื่องประดับทองคำแท้คุณภาพสูง ผ่านการรับรองมาตรฐาน
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="relative w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-4">
                <Image
                  src="/icons/auspicious.svg"
                  alt="เสริมดวง"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-heading font-medium text-brown-800 mb-2">
                เสริมดวงชะตา
              </h3>
              <p className="text-brown-600">
                ออกแบบตามหลักโหราศาสตร์ เพื่อเสริมดวงและความเป็นสิริมงคล
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="relative w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-4">
                <Image
                  src="/icons/craftsmanship.svg"
                  alt="งานฝีมือ"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-heading font-medium text-brown-800 mb-2">
                งานฝีมือประณีต
              </h3>
              <p className="text-brown-600">
                ผลิตโดยช่างทองฝีมือดี มีประสบการณ์มากกว่า 30 ปี
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 lotus-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-brown-800 mb-4">
              หมวดหมู่สินค้า
            </h2>
            <p className="text-brown-600 max-w-4xl mx-auto">
              เลือกชมเครื่องประดับทองคำแท้คุณภาพสูง
              ออกแบบด้วยความประณีตและใส่ใจในทุกรายละเอียด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[150px] items-center justify-center ml-[250px]">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="relative h-80 w-[280px] overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-end justify-center p-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-display font-medium text-white mb-2">
                        {category.name}
                      </h3>
                      <span className="inline-block px-4 py-2 border border-gold-400 text-gold-100 text-sm uppercase tracking-wider group-hover:bg-gold-600 group-hover:border-gold-600 transition-colors duration-300">
                        ดูสินค้า
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-medium text-brown-800 mb-4">
                สินค้ามาใหม่
              </h2>
              <p className="text-brown-600 max-w-2xl">
                เครื่องประดับทองคำแท้รุ่นใหม่ล่าสุด ออกแบบตามหลักโหราศาสตร์
                เสริมดวงชะตา
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center text-gold-600 hover:text-gold-700 transition-colors"
            >
              <span className="mr-2">ดูทั้งหมด</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <p>กำลังโหลดสินค้ามาใหม่...</p> // ✅ ใส่ loading (optional)
            ) : newProducts.length > 0 ? (
              newProducts.map((product) => {
                const productWithId = { ...product, id: product._id }; // ✅ เพิ่ม id เข้ามา
                return <ProductCard key={product._id} product={productWithId} featured />;
              })
            ) : (
              <p>ยังไม่มีสินค้ามาใหม่ตอนนี้</p> // ✅ กรณีไม่มีสินค้า
            )}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button
              variant="outline"
              className="border-gold-600 text-gold-600 hover:bg-gold-50"
              asChild
            >
              <Link href="/products?sort=newest">ดูสินค้าทั้งหมด</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collection - เครื่องประดับมงคล */}
      <section className="py-20 bg-cream-50 thai-pattern">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[600px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1600721391689-2564bb8055de?q=80&w=1374&auto=format&fit=crop"
                alt="เครื่องประดับมงคล"
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-lg">
              <span className="text-sm text-gold-600 uppercase tracking-wider font-medium">
                คอลเลคชั่นพิเศษ
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-heading font-medium text-brown-800 mb-6">
                เครื่องประดับมงคล <br />
                เสริมดวงชะตา
              </h2>
              <p className="text-brown-600 mb-8">
                เครื่องประดับทองคำแท้ที่ออกแบบตามหลักโหราศาสตร์ไทย
                ช่วยเสริมดวงชะตา เสริมพลังมงคล และปกป้องคุ้มครองผู้สวมใส่
                เหมาะสำหรับเป็นของขวัญในโอกาสพิเศษ
              </p>
              <Button
                variant="default"
                size="lg"
                className="bg-gold-600 hover:bg-gold-700"
                asChild
              >
                <Link href="/auspicious">ดูคอลเลคชั่น</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      {bestsellers.length > 0 && (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-medium text-brown-800 mb-4">
          สินค้าขายดี
        </h2>
        <p className="text-brown-600 max-w-2xl mx-auto">
          เครื่องประดับทองคำแท้ยอดนิยม ที่ลูกค้าให้ความไว้วางใจเลือกซื้อมากที่สุด
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loadingBestsellers ? (
          <p>กำลังโหลดสินค้าขายดี...</p>
        ) : (
          bestsellers.map((product) => {
            const productWithId = { ...product, id: product._id };
            return <ProductCard key={product._id} product={productWithId} />;
          })
        )}
      </div>
    </div>
  </section>
)}


      {/* คุณค่าของแบรนด์ */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-gold-600 hover:transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gold-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-medium text-brown-800 mb-2 text-center">
                ทองคำแท้ 100%
              </h3>
              <p className="text-brown-600 text-center">
                เครื่องประดับทองคำแท้คุณภาพสูง ผ่านการรับรองมาตรฐาน
                มั่นใจได้ในคุณภาพ
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-gold-600 hover:transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gold-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-medium text-brown-800 mb-2 text-center">
                รับประกันตลอดชีพ
              </h3>
              <p className="text-brown-600 text-center">
                เรารับประกันคุณภาพสินค้าตลอดชีพ
                มั่นใจได้ในคุณภาพและความคงทนของเครื่องประดับ
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-gold-600 hover:transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gold-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-medium text-brown-800 mb-2 text-center">
                ชำระเงินปลอดภัย
              </h3>
              <p className="text-brown-600 text-center">
                ระบบชำระเงินที่ปลอดภัย หลากหลายช่องทาง
                พร้อมบริการจัดส่งฟรีทั่วประเทศ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-brown-800 mb-4">
              เสียงจากลูกค้า
            </h2>
            <p className="text-brown-600 max-w-2xl mx-auto">
              ความประทับใจจากลูกค้าที่ไว้วางใจเลือกซื้อเครื่องประดับจากเบญจภัณฑ์๕
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-cream-50 p-8 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-gold-500"
                          : "text-gray-300"
                      } fill-current`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-brown-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-brown-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-brown-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gold-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-medium mb-4">
            รับข่าวสารและโปรโมชั่น
          </h2>
          <p className="mt-4 max-w-md mx-auto mb-8">
            ลงทะเบียนเพื่อรับข่าวสาร โปรโมชั่นพิเศษ และสิทธิพิเศษสำหรับสมาชิก
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="อีเมลของคุณ"
              className="flex-1 px-4 py-3 text-brown-800 focus:outline-none rounded-l-md"
            />
            <button className="px-6 py-3 bg-brown-800 text-white font-medium hover:bg-brown-900 transition-colors rounded-r-md">
              สมัคร
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
