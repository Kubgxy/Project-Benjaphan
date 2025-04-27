"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { mapProductToCardProduct } from "@/lib/product";
import { useToast } from "@/components/ui/use-toast";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({
  product,
  relatedProducts,
}: { params: { id: string } } & ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.availableSizes ? product.availableSizes[0].size : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.availableColors ? product.availableColors[0].name : undefined
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const { toast } = useToast();

  const selectedSizeObj = product.availableSizes?.find(
    (sizeObj) => sizeObj.size === selectedSize
  );
  const availableStock = selectedSizeObj ? selectedSizeObj.quantity : 0;
  const [isInWishlist, setIsInWishlist] = useState(false);

  const [selectedRating, setSelectedRating] = useState<number>(0);

  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({ title: "⚠️ กรุณาเลือกขนาดสินค้า", variant: "destructive" });
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/cart/addToCart",
        {
          productId: product.id_product, // ✅ ใช้ _id ของ product (MongoDB ObjectId)
          quantity: quantity, // ✅ ส่ง quantity ที่เลือก
          size: selectedSize, // ✅ ส่ง size ที่เลือก
        },
        {
          withCredentials: true, // ✅ สำคัญ! เพื่อส่ง cookie-based token ไป backend
        }
      );

      if (!selectedSize) {
        toast({ title: "⚠️ กรุณาเลือกขนาดสินค้า", variant: "destructive" });
        return;
      }

      setAddedToCart(true);
      toast({ title: "✅ เพิ่มสินค้าลงตะกร้าสำเร็จ!" });

      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error: any) {
      console.error("❌ Error adding to cart:", error);
      toast({
        title: "❌ ไม่สามารถเพิ่มสินค้าลงตะกร้าได้",
        description:
          error.response?.data?.message ||
          "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const incrementQuantity = () => {
    const selectedSizeObj = product.availableSizes?.find(
      (sizeObj) => sizeObj.size === selectedSize
    );
    const availableStock = selectedSizeObj ? selectedSizeObj.quantity : 0;

    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // ✅ ตรวจสอบว่ามีสินค้านี้ใน wishlist หรือยัง
  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/wishlist/getWishlist",
        {
          withCredentials: true,
        }
      );
      const wishlistItems = response.data.wishlist?.products || [];
      const exists = wishlistItems.some(
        (item: any) => item.id_product === product.id_product
      );
      setIsInWishlist(exists);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  useEffect(() => {
    checkWishlistStatus();
  }, []);

  const handleWishlist = async () => {
    try {
      if (isInWishlist) {
        await axios.post(
          "http://localhost:3000/api/wishlist/removeFromWishlist",
          { productId: product.id_product },
          { withCredentials: true }
        );
        toast({ title: "💔 ลบออกจากรายการโปรดแล้ว" });
      } else {
        await axios.post(
          "http://localhost:3000/api/wishlist/addToWishlist",
          { productId: product.id_product },
          { withCredentials: true }
        );
        toast({ title: "❤️ เพิ่มลงในรายการโปรดแล้ว" });
      }
      checkWishlistStatus(); // ✅ Refresh สถานะ
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตรายการโปรดได้",
        variant: "destructive",
      });
    }
  };

  const handleSubmitRating = async (rating: number) => {
    try {
      await axios.post(
        "http://localhost:3000/api/review/addRating",
        { productId: product.id_product, rating }, // ส่ง productId กับคะแนน
        { withCredentials: true }
      );
      toast({ title: "✅ ขอบคุณสำหรับการให้คะแนน!" });
      setSelectedRating(rating); // เก็บคะแนนที่เลือกไว้ใน state
      fetchAverageRating(); // อัปเดตคะแนนเฉลี่ยหลังจากกด
    } catch (error: any) {
      console.error("❌ Error submitting rating:", error);
      toast({
        title: "❌ ไม่สามารถส่งคะแนนได้",
        description:
          error.response?.data?.message ||
          "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const fetchUserRating = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/review/user-rating/${product.id_product}`,
        { withCredentials: true }
      );
      setSelectedRating(res.data.rating); // ⭐ preload คะแนนที่ user เคยให้
    } catch (error) {
      console.error("❌ ไม่สามารถโหลดคะแนนของผู้ใช้ได้", error);
    }
  };

  useEffect(() => {
    fetchAverageRating(); // โหลดคะแนนเฉลี่ย
    fetchUserRating(); // โหลดคะแนนของ user (กันกดซ้ำ)
  }, [product.id_product]);

  const fetchAverageRating = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/review/average/${product.id_product}`
      );
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  useEffect(() => {
    fetchAverageRating();
  }, [product.id_product]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/products"
        className="inline-flex items-center text-gray-600 hover:text-gold-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        กลับไปยังสินค้าทั้งหมด
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative h-[600px] bg-gray-50">
            <Image
              src={
                `http://localhost:3000${product.images[selectedImage]}` ||
                "/placeholder.svg"
              }
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`relative h-24 bg-gray-50 border cursor-pointer ${
                  selectedImage === index
                    ? "border-gold-500"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={
                    image ? `http://localhost:3000${image}` : "/placeholder.svg"
                  }
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-display font-medium text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-2xl font-medium text-gray-900 mb-6">
            {formatPrice(product.price)}
          </p>

          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Details</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          {product.availableSizes && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((sizeObj) => (
                  <button
                    key={sizeObj._id}
                    className={`h-16 w-16 rounded-full border flex flex-col items-center justify-center text-sm focus:outline-none ${
                      selectedSize === sizeObj.size
                        ? "border-gold-500 bg-gold-50 text-gold-600"
                        : "border-gray-300 hover:border-gold-500"
                    }`}
                    onClick={() => setSelectedSize(sizeObj.size)}
                  >
                    <span>{sizeObj.size}</span>
                    <span className="text-xs text-gray-500">
                      {sizeObj.quantity} ชิ้น
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l"
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    if (value >= 1 && value <= availableStock) {
                      setQuantity(value);
                    } else if (value > availableStock) {
                      setQuantity(availableStock); // ✅ ถ้ากรอกเกิน ให้เซ็ตเป็น stock สูงสุด
                    } else {
                      setQuantity(1); // ✅ ถ้าต่ำกว่า 1 ให้กลับมาเป็น 1
                    }
                  }
                }}
                className="w-16 h-10 text-center border-t border-b border-gray-300"
              />

              <button
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r"
                onClick={incrementQuantity}
                disabled={quantity >= availableStock}
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="ml-4 text-sm text-gray-600">
                คงเหลือ {availableStock} ชิ้น
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              variant="luxury"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart} // ✅ เปลี่ยนมาใช้ API จริง!
            >
              เพิ่มลงตะกร้า
            </Button>

            <Button
              variant={isInWishlist ? "outline" : "luxuryOutline"}
              size="lg"
              className={`sm:w-auto ${
                isInWishlist
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : ""
              }`}
              onClick={handleWishlist}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist ? "fill-red-500" : ""}`}
              />
            </Button>

            <Button variant="luxuryOutline" size="lg" className="sm:w-auto">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          {/* ⭐⭐⭐⭐⭐ ให้คะแนน */}
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-700 mr-2">ให้คะแนนสินค้า:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => {
                  if (selectedRating === 0) handleSubmitRating(star); // ✅ ป้องกันกดซ้ำ!
                }}
                className={`h-6 w-6 cursor-pointer transition-all ${
                  star <= selectedRating
                    ? "fill-gold-500 text-gold-500"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-700">
              {averageRating.toFixed(1)} / 5 ({totalReviews} รีวิว)
            </span>
          </div>
          {selectedRating > 0 && (
            <p className="text-green-600 text-sm mb-4">
              คุณให้คะแนนไปแล้ว {selectedRating} ดาว ขอบคุณครับ ❤️
            </p>
          )}

          {addedToCart && (
            <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md flex items-center mb-6">
              <Check className="h-5 w-5 mr-2" />
              เพิ่มลงตะกร้าเรียบร้อยแล้ว
            </div>
          )}
        </div>
      </div>

      {/* Product Features */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {(product.features || []).map((feature, index) => (
          <div key={index} className="text-center p-6 border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-50 flex items-center justify-center">
              <Check className="h-6 w-6 text-gold-600" />
            </div>
            <p className="text-gray-800">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
