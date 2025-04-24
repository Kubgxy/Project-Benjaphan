"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import AOS from "aos"
import "aos/dist/aos.css"

const mockPosts = [
  {
    id: "post-1",
    title: "แหวนมงคลเสริมดวง ประจำวันเกิด",
    excerpt: "แนะนำแหวนทองคำแท้ที่ออกแบบตามวันเกิด เสริมดวงและโชคลาภเฉพาะบุคคล",
    image: "/blog/1/วิธีใส่แหวนเสริมดวง.jpg",
    date: "5 เมษายน 2566",
    views: 123,
    content: `
      🔮 วิธีใส่แหวนเสริมดวง ไขความลับตามตำราสายมู
      💍 แหวนไม่ใช่แค่เครื่องประดับ แต่คือเครื่องรางแห่งพลัง!
      แหวนทองคำแท้ไม่เพียงแค่เพิ่มความสง่างาม แต่ยังสามารถส่งพลังดวงชะตาให้กับผู้สวมใส่
      ตามตำราสายมูระบุไว้ว่า "นิ้วที่ใส่แหวนมีผลกับพลังในชีวิตแต่ละด้าน"

      📅 ใส่แหวนตามวันเกิด เสริมดวงตรงจุด
      วันเกิด	นิ้วที่แนะนำ	พลังที่ส่งเสริม
      จันทร์	นิ้วก้อยขวา	เมตตามหานิยม
      อังคาร	นิ้วนางซ้าย	เสน่ห์ การเจรจา
      พุธ	นิ้วกลางขวา	การเงิน การงาน
      พฤหัสฯ	นิ้วชี้ซ้าย	บารมี ความเชื่อมั่น
      ศุกร์	นิ้วหัวแม่มือซ้าย	ความรัก ความมั่นคง
      เสาร์	นิ้วนางขวา	ป้องกันเคราะห์
      อาทิตย์	นิ้วชี้ขวา	เสริมอำนาจ บารมี
      🔁 ใส่ถูกชีวิตรุ่ง ใส่ผิด...พลังตีกลับ!
      ผู้คนหลายคนบอกว่า "หลังใส่แหวนตามวันเกิด ทุกอย่างในชีวิตเริ่มดีขึ้นแบบไม่น่าเชื่อ!"
      แต่หากใส่ผิดนิ้ว หรือใส่แบบไม่ตั้งใจ → อาจเกิดผลตรงกันข้ามได้

      📿 เคล็ดลับเพิ่มเติมจากสายมู
      หมั่นล้างแหวนด้วยน้ำมนต์เดือนละครั้ง

      ใส่แหวนขณะอธิษฐานช่วงเช้าเพื่อพลังดีที่สุด

      ไม่ควรยืมแหวนมาจากคนอื่น!

      💛 สรุป
      ✨ แหวน = เครื่องประดับเสริมบุญ ที่สวยและส่งพลังในชีวิต

      ลองทำตามคำแนะนำของสายมูแล้วชีวิตคุณอาจ “ปัง!” แบบไม่รู้ตัว 💫
    `,
  },
  {
    id: "post-2",
    title: "จี้พระเครื่องทองคำแท้ 99.99%",
    excerpt: "เปิดตัวจี้พระเครื่องรุ่นพิเศษเสริมบารมี แรงศรัทธาและความเชื่ออย่างลึกซึ้ง",
    image: "/posts/amulet-gold.jpg",
    date: "29 มีนาคม 2566",
    views: 450,
    content: `
      แหวนทองคำแท้ที่ออกแบบตามวันเกิดช่วยเสริมพลังดวงชะตา...
      ใส่แล้วรู้สึกมั่นใจ เสริมความเชื่อ เสริมพลังให้กับผู้สวมใส่
    `,
  },
  {
    id: "post-3",
    title: "เครื่องประดับมงคลรับปีใหม่ไทย",
    excerpt: "รวมเครื่องประดับมงคลยอดนิยมช่วงสงกรานต์ เสริมโชค รับสิ่งดี ๆ",
    image: "/posts/thai-newyear.jpg",
    date: "10 เมษายน 2566",
    views: 320,
    content: `
      แหวนทองคำแท้ที่ออกแบบตามวันเกิดช่วยเสริมพลังดวงชะตา...
      ใส่แล้วรู้สึกมั่นใจ เสริมความเชื่อ เสริมพลังให้กับผู้สวมใส่
    `,
  },
  {
    id: "post-4",
    title: "กำไลทองคำแท้ ใส่แล้วรุ่ง",
    excerpt: "เปิดตัวคอลเลกชันกำไลทองคำที่ออกแบบตามหลักฮวงจุ้ย เสริมดวงการเงิน",
    image: "/posts/gold-bracelet.jpg",
    date: "2 เมษายน 2566",
    views: 280,
    content: `
      แหวนทองคำแท้ที่ออกแบบตามวันเกิดช่วยเสริมพลังดวงชะตา...
      ใส่แล้วรู้สึกมั่นใจ เสริมความเชื่อ เสริมพลังให้กับผู้สวมใส่
    `,
  },
  {
    id: "post-5",
    title: "เครื่องประดับเรียกทรัพย์ที่ทุกคนควรมี",
    excerpt: "รวมเครื่องประดับเรียกทรัพย์ เรียกงาน เรียกความสำเร็จ",
    image: "/posts/wealth-jewelry.jpg",
    date: "1 เมษายน 2566",
    views: 510,
    content: `
      แหวนทองคำแท้ที่ออกแบบตามวันเกิดช่วยเสริมพลังดวงชะตา...
      ใส่แล้วรู้สึกมั่นใจ เสริมความเชื่อ เสริมพลังให้กับผู้สวมใส่
    `,
  },
  {
    id: "post-6",
    title: "จี้เพชรแท้ประจำราศี",
    excerpt: "จี้ประจำราศีที่ออกแบบมาเฉพาะคุณ เสริมพลังและความมั่นใจ",
    image: "/posts/zodiac-diamond.jpg",
    date: "25 มีนาคม 2566",
    views: 390,
    content: `
      แหวนทองคำแท้ที่ออกแบบตามวันเกิดช่วยเสริมพลังดวงชะตา...
      ใส่แล้วรู้สึกมั่นใจ เสริมความเชื่อ เสริมพลังให้กับผู้สวมใส่
    `,
  },
  {
    id: "post-7",
    title: "จี้เพชรแท้ประจำราศี",
    excerpt: "จี้ประจำราศีที่ออกแบบมาเฉพาะคุณ เสริมพลังและความมั่นใจ",
    image: "/posts/zodiac-diamond.jpg",
    date: "25 มีนาคม 2566",
    views: 390,
    content: `
      แหวนทองคำแท้ที่ออกแบบตามวันเกิดช่วยเสริมพลังดวงชะตา...
      ใส่แล้วรู้สึกมั่นใจ เสริมความเชื่อ เสริมพลังให้กับผู้สวมใส่
    `,
  },
  {
    id: "post-8",
    title: "จี้เพชรแท้ประจำราศี",
    excerpt: "จี้ประจำราศีที่ออกแบบมาเฉพาะคุณ เสริมพลังและความมั่นใจ",
    image: "/posts/zodiac-diamond.jpg",
    date: "25 มีนาคม 2566",
    views: 390,
    content: `
      แหวนทองคำแท้ที่ออกแบบตามวันเกิดช่วยเสริมพลังดวงชะตา...
      ใส่แล้วรู้สึกมั่นใจ เสริมความเชื่อ เสริมพลังให้กับผู้สวมใส่
    `,
  },
]

const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const searchParams = useSearchParams()
  const pageQuery = parseInt(searchParams.get("page") || "1")
  const [currentPage, setCurrentPage] = useState(pageQuery)
  const [search, setSearch] = useState("")
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  const filteredPosts = useMemo(() => {
    return mockPosts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(start, start + POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  const popularPosts = [...mockPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-down">
            <h1 className="text-4xl md:text-5xl font-heading font-medium text-brown-800 mb-4">
              บทความ
            </h1>
            <p className="text-brown-600 max-w-2xl mx-auto">
              อัปเดตสินค้ามงคล รีวิวเครื่องประดับ และแนะนำเทรนด์เสริมบุญล่าสุด
            </p>
          </div>

          <div className="mb-10 max-w-xl mx-auto" data-aos="zoom-in">
            <input
              type="text"
              placeholder="ค้นหาบทความ..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gold-200 rounded-md focus:outline-none focus:ring focus:ring-gold-300"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="col-span-full lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="relative h-52 w-full">
                    <Image
                      src={post.image}
                      alt={`ภาพบทความ: ${post.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gold-600 uppercase tracking-wide font-medium mb-1">
                      {post.date}
                    </p>
                    <h2 className="text-lg font-semibold text-brown-800 mb-1">
                      {post.title}
                    </h2>
                    <p className="text-brown-600 text-sm line-clamp-3 mb-2">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-brown-400 mb-2">
                      👁️ {post.views.toLocaleString()} ครั้ง
                    </p>
                    <Link
                      href={`/blog/${post.id}?page=${currentPage}`}
                      className="inline-flex items-center text-gold-600 hover:text-gold-800 transition text-sm"
                    >
                      อ่านเพิ่มเติม <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="lg:pl-6 border-t lg:border-t-0 lg:border-l border-gold-100 pt-6 lg:pt-0"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <h3 className="text-xl font-semibold text-brown-800 mb-4">
                🔥 บทความยอดฮิต
              </h3>
              <ul className="space-y-4">
                {popularPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-gold-700 hover:text-gold-900 font-medium text-sm"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-brown-500">
                      👁️ {post.views.toLocaleString()} ครั้ง
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2" data-aos="fade-up">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    router.push(`/blog?page=${i + 1}`)
                    setCurrentPage(i + 1)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }} 
                  className={`px-4 py-2 border rounded ${
                    currentPage === i + 1
                      ? "bg-gold-600 text-white"
                      : "border-gold-600 text-gold-600 hover:bg-gold-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          <div className="text-center mt-16" data-aos="zoom-in">
            <Button
              variant="outline"
              className="border-gold-600 text-gold-600 hover:bg-gold-50"
              asChild
            >
              <Link href="/">ย้อนกลับหน้าแรก</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}