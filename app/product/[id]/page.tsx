import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "./product-detail"
import { getProductById, getRelatedProducts } from "@/lib/data"
import { notFound } from "next/navigation"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Get product data from our mock database
  const product = getProductById(params.id)

  // If product not found, show 404
  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(params.id, 4)

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <ProductDetail product={product} relatedProducts={relatedProducts} />
      <Footer />
    </div>
  )
}

