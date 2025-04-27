import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductDetail } from "./product-detail";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ ใช้ await params ก่อน
  const res = await fetch(
    `http://localhost:3000/api/product/getOneProducts/${id}`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || !data.product) {
    notFound();
  }

  const product = {
    ...data.product,
    id: data.product.id_product,
    formattedPrice: `฿${data.product.price.toFixed(2)}`,
    isNew: data.product.isNewArrival || false,
    materials: data.product.materials || [],
    features: data.product.features || [],
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
        params={{ id }}
      />
      <Footer />
    </div>
  );
}
