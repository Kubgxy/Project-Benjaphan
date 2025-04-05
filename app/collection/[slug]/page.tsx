import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { collections, getProductsByCollection } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"

export default function CollectionPage({ params }: { params: { slug: string } }) {
  // Find the collection by slug
  const collection = collections.find((col) => col.slug === params.slug)

  // If collection not found, show 404
  if (!collection) {
    notFound()
  }

  // Get products for this collection
  const collectionProducts = getProductsByCollection(collection.id)

  return (
    <div className="min-h-screen">
      <Header />

      <div className="relative h-[50vh] mb-12">
        <Image src={collection.image || "/placeholder.svg"} alt={collection.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">{collection.name}</h1>
            <p className="text-lg md:text-xl">{collection.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {collectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {collectionProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found in this collection.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

