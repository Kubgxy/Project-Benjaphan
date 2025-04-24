import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"
import Image from "next/image"

export default function AuspiciousPage() {
  // Filter products for auspicious items (in a real app, you'd have a specific category or tag)
  const auspiciousProducts = products.slice(0, 8) // Just using some products for demo

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-gold-600 text-white py-24">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-medium text-center mb-4">เครื่องประดับมงคล</h1>
          <p className="text-center text-white/90 max-w-2xl mx-auto">
            เครื่องประดับทองคำแท้ออกแบบตามหลักโหราศาสตร์ไทย เสริมดวงชะตา เสริมพลังมงคล และปกป้องคุ้มครองผู้สวมใส่
          </p>
        </div>
        <div className="absolute inset-0 opacity-15 lotus-pattern"></div>
      </div>

      {/* Auspicious Jewelry Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-medium text-brown-800 mb-6">
                เครื่องประดับมงคล
                <br />
                เสริมดวงชะตา
              </h2>
              <p className="text-brown-600 mb-4">
                เครื่องประดับมงคลของเบญจภัณฑ์๕ ออกแบบโดยผู้เชี่ยวชาญด้านโหราศาสตร์ไทย ผสมผสานความเชื่อดั้งเดิมกับการออกแบบที่ทันสมัย
                เพื่อสร้างเครื่องประดับที่ไม่เพียงแต่สวยงาม แต่ยังช่วยเสริมดวงชะตาและปกป้องผู้สวมใส่
              </p>
              <p className="text-brown-600 mb-4">
                ทุกชิ้นผลิตจากทองคำแท้คุณภาพสูง ผ่านพิธีปลุกเสกโดยพระอาจารย์ที่มีชื่อเสียง เพื่อเพิ่มพลังมงคลและความศักดิ์สิทธิ์ให้กับเครื่องประดับ
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mr-4 mt-1">
                    <svg
                      className="w-5 h-5 text-gold-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">เสริมโชคลาภ การเงิน</h3>
                    <p className="text-brown-600">ช่วยดึงดูดโชคลาภ เงินทอง และความมั่งคั่งเข้าสู่ชีวิต</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mr-4 mt-1">
                    <svg
                      className="w-5 h-5 text-gold-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">ปกป้องคุ้มครอง</h3>
                    <p className="text-brown-600">ป้องกันสิ่งชั่วร้าย อุบัติเหตุ และภัยอันตรายต่างๆ</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mr-4 mt-1">
                    <svg
                      className="w-5 h-5 text-gold-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">เสริมเสน่ห์ ความรัก</h3>
                    <p className="text-brown-600">ช่วยเสริมเสน่ห์ ดึงดูดความรัก และเสริมความสัมพันธ์ให้แน่นแฟ้น</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1374&auto=format&fit=crop"
                alt="เครื่องประดับมงคล"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 lotus-pattern">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-medium text-brown-800 text-center mb-12">เครื่องประดับมงคลของเรา</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {auspiciousProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Zodiac Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-medium text-brown-800 text-center mb-4">เครื่องประดับตามราศี</h2>
          <p className="text-brown-600 text-center max-w-2xl mx-auto mb-12">
            เลือกเครื่องประดับที่เหมาะกับราศีของคุณ เพื่อเสริมดวงชะตาและพลังมงคลให้ตรงกับธาตุประจำราศี
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "ราศีมังกร", dates: "15 ม.ค. - 12 ก.พ.", element: "ธาตุดิน", image: "/zodiac/capricorn.png" },
              { name: "ราศีกุมภ์", dates: "13 ก.พ. - 13 มี.ค.", element: "ธาตุลม", image: "/zodiac/aquarius.png" },
              { name: "ราศีมีน", dates: "14 มี.ค. - 12 เม.ย.", element: "ธาตุน้ำ", image: "/zodiac/pisces.png" },
              { name: "ราศีเมษ", dates: "13 เม.ย. - 13 พ.ค.", element: "ธาตุไฟ", image: "/zodiac/aries.png" },
              { name: "ราศีพฤษภ", dates: "14 พ.ค. - 13 มิ.ย.", element: "ธาตุดิน", image: "/zodiac/taurus.png" },
              { name: "ราศีเมถุน", dates: "14 มิ.ย. - 14 ก.ค.", element: "ธาตุลม", image: "/zodiac/gemini.png" },
              { name: "ราศีกรกฎ", dates: "15 ก.ค. - 16 ส.ค.", element: "ธาตุน้ำ", image: "/zodiac/cancer.png" },
              { name: "ราศีสิงห์", dates: "17 ส.ค. - 16 ก.ย.", element: "ธาตุไฟ", image: "/zodiac/leo.png" },
              { name: "ราศีกันย์", dates: "17 ก.ย. - 16 ต.ค.", element: "ธาตุดิน", image: "/zodiac/virgo.png" },
              { name: "ราศีตุลย์", dates: "17 ต.ค. - 15 พ.ย.", element: "ธาตุลม", image: "/zodiac/libra.png" },
              { name: "ราศีพิจิก", dates: "16 พ.ย. - 15 ธ.ค.", element: "ธาตุน้ำ", image: "/zodiac/scorpio.png" },
              { name: "ราศีธนู", dates: "16 ธ.ค. - 14 ม.ค.", element: "ธาตุไฟ", image: "/zodiac/sagittarius.png" },
            ].map((zodiac, index) => (
              <div key={index} className="bg-cream-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <Image
                    src={zodiac.image || "/placeholder.svg?height=64&width=64"}
                    alt={zodiac.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium text-brown-800 mb-1">{zodiac.name}</h3>
                <p className="text-xs text-brown-600 mb-1">{zodiac.dates}</p>
                <p className="text-xs text-gold-600 font-medium">{zodiac.element}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

