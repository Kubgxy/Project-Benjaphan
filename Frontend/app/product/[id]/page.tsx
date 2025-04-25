import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductDetail } from "./product-detail";
import { notFound } from "next/navigation";

interface Product {
  id_product: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  details: string[];
  isNewArrival: boolean;
  isBestseller: boolean;
  isOnSale: boolean;
  rating: number;
  reviews: number;
  availableSizes?: string[];
  availableColors?: { name: string; value: string }[];
  stock: number;
  features?: string[];
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // 🟢 ดึงข้อมูลจาก API จริง
  const res = await fetch(`http://localhost:3000/api/product/getOneProducts/${params.id}`, {
    credentials: "include",
    cache: "no-store", // ถ้าใช้ SSR
  });

  const data = await res.json();

  if (!res.ok || !data.product) {
    notFound(); // ❌ ถ้าไม่เจอ product ส่ง 404
  }

  const product = {
    ...data.product,
    id: data.product.id_product,                                // ⭐ เปลี่ยน id_product → id
    formattedPrice: `฿${data.product.price.toFixed(2)}`,        // ⭐ เพิ่ม formattedPrice ให้ตรงที่ฝั่ง detail ต้องการ
    isNew: data.product.isNewArrival || false,                  // ⭐ สมมุติ field isNewArrival → isNew
    materials: data.product.materials || [],                    // ⭐ ถ้าไม่มี materials ส่ง []
    features: data.product.features || [],                      // ⭐ ป้องกัน features undefined
  };
  

  const relatedProducts = (data.relatedProducts || []).map((item: any) => ({
    ...item,
    id: item.id_product,
    formattedPrice: `฿${item.price.toFixed(2)}`,
    isNew: item.isNewArrival || false,
    materials: item.materials || [],
    features: item.features || [],
  }));
  


  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <ProductDetail product={product} relatedProducts={relatedProducts} />
      <Footer />
    </div>
  );
}
