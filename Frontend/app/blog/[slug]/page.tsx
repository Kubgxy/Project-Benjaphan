"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Article {
  title: string;
  content: string;
  thumbnail: string;
  views: number;
  slug: string;
  date?: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const hasIncreased = useRef(false);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const router = useRouter();

  const [post, setPost] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    window.scrollTo({ top: 0 });

    const fetchPost = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/article/getOneArticle/${slug}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");
        setPost(data.article);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const increaseView = async () => {
      if (hasIncreased.current) return;
      hasIncreased.current = true;
      try {
        await fetch(`http://localhost:3000/api/article/increaseView/${slug}`, {
          method: "PATCH",
        });
      } catch (err) {
        console.error("เพิ่มวิวไม่สำเร็จ:", err);
      }
    };

    if (slug) {
      fetchPost();
      increaseView();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-40 text-brown-600 text-lg">
        ⏳ กำลังโหลดบทความ...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-40">
        <p className="text-xl text-red-600">❌ ไม่พบบทความที่คุณต้องการ</p>
        <Button onClick={() => router.push("/blog")} className="mt-4">
          กลับหน้าบทความ
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <Header />

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gold-700 mb-6" data-aos="fade-right">
            <Link href="/" className="hover:underline">
              หน้าแรก
            </Link>{" "}
            &gt;{" "}
            <Link href="/blog" className="hover:underline">
              บทความ
            </Link>{" "}
            &gt;{" "}
            <span className="text-brown-600 font-semibold">{post.title}</span>
          </nav>

          {/* Title */}
          <p className="text-gold-600 text-sm mb-2" data-aos="fade-up">
            👁️ {post.views?.toLocaleString() || 0} ครั้ง
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-brown-800 mb-6"
            data-aos="fade-up"
          >
            {post.title}
          </h1>

          {/* Thumbnail */}
          <div
            className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-md mb-10"
            data-aos="zoom-in"
          >
            <Image
              src={`http://localhost:3000/${post.thumbnail}`}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* ✨ แสดงเนื้อหาธรรมดา รองรับเว้นบรรทัดด้วย whitespace-pre-line */}
          <article
            className="prose prose-lg max-w-none text-brown-800 prose-headings:text-brown-800 prose-p:leading-relaxed prose-img:rounded-lg"
            data-aos="fade-up"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Share + Back */}
          <div
            className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="flex gap-2">
              <Button
                className="bg-blue-600 text-white"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                แชร์ Facebook
              </Button>
              <Button
                className="bg-green-500 text-white"
                onClick={() =>
                  window.open(
                    `https://social-plugins.line.me/lineit/share?url=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                แชร์ Line
              </Button>
            </div>

            <Button
              variant="outline"
              className="border-gold-600 text-gold-600 hover:bg-gold-50"
              asChild
            >
              <Link href={`/blog?page=${page}`}>← ย้อนกลับหน้าบทความ</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
