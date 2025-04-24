"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  // Get filter parameters from URL
  const categoryFilter = searchParams.get("category");
  const sortOption = searchParams.get("sort") || "featured";

  // Filter products by category if category parameter exists
  let filteredProducts = categoryFilter
    ? products.filter((product) => {
        const category = categories.find((cat) => cat.slug === categoryFilter);
        return category ? product.category === category.id : true;
      })
    : products;

  // Sort products based on sort parameter
  switch (sortOption) {
    case "price-low-high":
      filteredProducts = [...filteredProducts].sort(
        (a, b) => a.price - b.price
      );
      break;
    case "price-high-low":
      filteredProducts = [...filteredProducts].sort(
        (a, b) => b.price - a.price
      );
      break;
    case "newest":
      filteredProducts = [...filteredProducts].filter(
        (product) => product.isNew
      );
      break;
    case "bestselling":
      filteredProducts = [...filteredProducts].filter(
        (product) => product.isBestseller
      );
      break;
    default:
      // Default sorting (featured)
      break;
  }

  // Get the current category name for display
  const currentCategory = categoryFilter
    ? categories.find((cat) => cat.slug === categoryFilter)?.name
    : "สินค้าทั้งหมด";

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-gold-600 text-white py-16">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-display font-medium text-center mb-4">
            {currentCategory || "สินค้าทั้งหมด"}
          </h1>
          <p className="text-center text-white/90 max-w-2xl mx-auto">
            เครื่องประดับทองคำแท้คุณภาพสูง
            ออกแบบเพื่อความเป็นสิริมงคลและเสริมดวงชะตา
          </p>
        </div>
        <div className="absolute inset-0 opacity-15 lotus-pattern"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Filter Button - Mobile Only */}
          <button className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm border border-gold-200">
            <Filter className="h-4 w-4 text-gold-600" />
            <span className="text-brown-800">กรองสินค้า</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gold-600" />
            <span className="text-brown-800 font-medium">จัดเรียง:</span>
            <select
              className="border border-gold-200 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              value={sortOption}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("sort", e.target.value);
                window.location.href = url.toString();
              }}
            >
              <option value="featured">แนะนำ</option>
              <option value="price-low-high">ราคา: ต่ำไปสูง</option>
              <option value="price-high-low">ราคา: สูงไปต่ำ</option>
              <option value="newest">สินค้าใหม่</option>
              <option value="bestselling">สินค้าขายดี</option>
            </select>
          </div>
        </div>

        {/* Category tabs for easy filtering */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <Tabs defaultValue={categoryFilter || "all"} className="w-full">
            <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start mb-4 pb-2 bg-cream-50 p-1 rounded-md">
              <TabsTrigger
                value="all"
                className="px-4 py-2 whitespace-nowrap data-[state=active]:bg-gold-600 data-[state=active]:text-white"
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete("category");
                  window.location.href = url.toString();
                }}
              >
                ทั้งหมด
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.slug}
                  className="px-4 py-2 whitespace-nowrap data-[state=active]:bg-gold-600 data-[state=active]:text-white"
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("category", category.slug);
                    window.location.href = url.toString();
                  }}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gold-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-medium text-brown-800 mb-2">
              ไม่พบสินค้า
            </h2>
            <p className="text-brown-600 mb-6">
              ขออภัย เราไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหาของคุณ
              โปรดลองเลือกหมวดหมู่อื่นหรือตัวเลือกการกรองอื่น
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
