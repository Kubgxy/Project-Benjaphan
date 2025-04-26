import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductDetail } from "./product-detail";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ ใช้ API จริงดึงข้อมูล product + relatedProducts
  const res = await fetch(
    `http://localhost:3000/api/product/getOneProducts/${params.id}`,
    {
      credentials: "include",
      cache: "no-store", // SSR
    }
  );

  const data = await res.json();

  if (!res.ok || !data.product) {
    notFound(); // ❌ ถ้าไม่เจอ product ส่ง 404
  }

  // ✅ ไม่ซ้ำชื่อกับข้างบนแล้ว
  const product = {
    ...data.product,
    id: data.product.id_product, // ⭐ เปลี่ยน id_product → id ให้ตรง Front ใช้
    formattedPrice: `฿${data.product.price.toFixed(2)}`, // ⭐ เพิ่ม formattedPrice
    isNew: data.product.isNewArrival || false, // ⭐ กรณี field isNewArrival
    materials: data.product.materials || [], // ⭐ กัน materials undefined
    features: data.product.features || [], // ⭐ กัน features undefined
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
      <ProductDetail 
        product={product} 
        relatedProducts={relatedProducts}
        params={{ id: params.id }} />
      <Footer />
    </div>
  );
}
