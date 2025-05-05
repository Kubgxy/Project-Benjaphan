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
import ReactImageMagnify from "react-image-magnify";

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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { toast } = useToast();

  const selectedSizeObj = product.availableSizes?.find(
    (sizeObj) => sizeObj.size === selectedSize
  );
  const availableStock = selectedSizeObj ? selectedSizeObj.quantity : 0;
  const [isInWishlist, setIsInWishlist] = useState(false);

  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  interface Review {
    userId?: { firstName: string; lastName: string; avatar: string };
    productId: string;
    rating: number;
    comment: string;
  }
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewComment, setReviewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // จำนวนรีวิวต่อหน้า

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({ title: "⚠️ กรุณาเลือกขนาดสินค้า", variant: "destructive" });
      return;
    }
    if (isAddingToCart) return; // กันกดรัว
    setIsAddingToCart(true);

    try {
      await axios.post(
        "http://localhost:3000/api/cart/addToCart",
        {
          productId: product.id_product,
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

      if (availableStock <= 0) {
        toast({ title: "❌ สินค้าหมดสต็อก", variant: "destructive" });
        return;
      }

      if (quantity > availableStock) {
        toast({ title: "❌ จำนวนเกินสต็อกที่มี", variant: "destructive" });
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
    } finally {
      setIsAddingToCart(false); // รีเซ็ตสถานะการเพิ่มลงตะกร้า
    }
  };

  useEffect(() => {
    const selected = product.availableSizes?.find(
      (sizeObj) => sizeObj.size === selectedSize
    );
    if (selected) {
      setQuantity(selected.quantity > 0 ? 1 : 0);
    } else {
      setQuantity(0);
    }
  }, [selectedSize]);

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
        { withCredentials: true }
      );
      const wishlistItems = response.data.wishlist?.products || [];
      const exists = wishlistItems.some(
        (item: any) =>
          (item.productId && item.productId === product._id) ||
          (item.productId && item.productId._id === product._id)
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
          { productId: product._id },
          { withCredentials: true }
        );
        toast({ title: "💔 ลบออกจากรายการโปรดแล้ว" });
      } else {
        await axios.post(
          "http://localhost:3000/api/wishlist/addToWishlist",
          { productId: product._id },
          { withCredentials: true }
        );
        toast({ title: "❤️ เพิ่มลงในรายการโปรดแล้ว" });
        console.log("ส่งไปเพิ่ม wishlist:", product._id);
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

  const fetchProductReviews = async (page = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/review/getReviews/${product._id}?page=${page}&limit=${reviewsPerPage}`
      );
      setReviews(res.data.reviews);
      setTotalReviews(res.data.totalReviews);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchProductReviews();
  }, [product._id]);

  const fetchAverageRating = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/review/average/${product._id}`
      );
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (comment.trim() === "" && rating > 0) {
        // ส่งแค่ดาว
        await axios.post(
          "http://localhost:3000/api/review/addReview",
          { productId: product._id, rating },
          { withCredentials: true }
        );
        toast({ title: "✅ ขอบคุณสำหรับการให้ดาว!" });
      } else if (comment.trim() !== "" && rating > 0) {
        // ส่งคอมเมนต์ + ดาว
        await axios.post(
          "http://localhost:3000/api/review/addReview",
          { productId: product._id, rating, comment },
          { withCredentials: true }
        );
        toast({ title: "✅ ขอบคุณสำหรับการรีวิว!" });
        setReviewComment("");
      }
      fetchAverageRating();
      fetchProductReviews();
    } catch (error: any) {
      console.error("❌ Error submitting review:", error);
      toast({
        title: "❌ ไม่สามารถส่งรีวิวได้",
        description:
          error.response?.data?.message ||
          "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchUserRating = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/review/user-rating/${product._id}`,
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
  }, [product._id]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/product"
        className="inline-flex items-center text-gray-600 hover:text-gold-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        กลับไปยังสินค้าทั้งหมด
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4 ml-[20px]">
          <div className="relative w-[650px] h-[500px]   bg-white">
            <Image
              src={
                product.images && product.images.length > 0
                  ? `http://localhost:3000${product.images[selectedImage]}`
                  : "/placeholder.svg"
              }
              alt={product.name}
              fill
              className="object-cover"
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

        <div className="mt-4">
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
                {product.availableSizes.map((sizeObj, index) => (
                  <button
                    key={`${sizeObj.size}-${index}`}
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
                      setQuantity(availableStock);
                    } else {
                      setQuantity(1);
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
              onClick={handleAddToCart}
              disabled={!selectedSize || availableStock === 0 || quantity === 0}
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

          {/* ⭐⭐⭐⭐⭐ ให้คะแนน + คอมเมนต์ */}
          <div className="mb-4">
            <textarea
              className="w-full border p-2 rounded"
              placeholder="เขียนรีวิวของคุณ..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-700 mr-2">ให้คะแนนสินค้า:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => {
                  setSelectedRating(star);
                  if (reviewComment.trim() === "") {
                    if (!isSubmitting) {
                      handleSubmitReview(star, "");
                    }
                  }
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
            {selectedRating > 0 && (
            <p className="text-green-600 text-sm ml-4">
              (คุณให้คะแนนไปแล้ว {selectedRating} ดาว ขอบคุณครับ ❤️)
            </p>
          )}
          </div>
          <Button
            variant="luxury"
            size="lg"
            className="mt-4"
            onClick={() => handleSubmitReview(selectedRating, reviewComment)}
            disabled={
              isSubmitting ||
              selectedRating === 0 || // ต้องมีดาว
              reviewComment.trim() === "" // ต้องมีคอมเมนต์ (เพราะปุ่มนี้ไว้ส่งคอมเมนต์)
            }
          >
            ส่งรีวิว
          </Button>
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

      {/* รีวิวทั้งหมด */}
      <div className="mt-16">
        <h3 className="text-lg font-medium mb-4">
          รีวิวทั้งหมด ({reviews.length})
        </h3>
        <div className="space-y-4">
          {reviews.map((r, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg shadow"
            >
              {/* Avatar ตัวอักษรแรกของชื่อ */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {r.userId?.avatar ? (
                  // ใช้ avatar ถ้ามี
                  <Image
                    src={`http://localhost:3000${r.userId.avatar}`}
                    alt="User Avatar"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                ) : (
                  // ถ้าไม่มี avatar ให้ใช้ตัวอักษรแรกของชื่อ
                  <span className="text-white font-bold">
                    {r.userId?.firstName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* ข้อมูลรีวิว */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">
                    {r.userId?.firstName} {r.userId?.lastName}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= r.rating
                            ? "fill-gold-500 text-gold-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {r.comment || "ไม่มีข้อความรีวิว"}
                </p>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-8">
            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded shadow">
              <button
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => fetchProductReviews(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ก่อนหน้า
              </button>
              <span className="text-sm text-gray-600">
                หน้า {currentPage} / {Math.ceil(totalReviews / reviewsPerPage)}
              </span>
              <button
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => fetchProductReviews(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(totalReviews / reviewsPerPage)
                }
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {product.features && product.features.length > 0 && (
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {product.features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 border border-gray-200"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-50 flex items-center justify-center">
                  <Check className="h-6 w-6 text-gold-600" />
                </div>
                <p className="text-gray-800">{feature}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
