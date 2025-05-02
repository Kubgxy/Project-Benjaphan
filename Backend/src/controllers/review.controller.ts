// controllers/review.controller.ts
import { Request, Response } from "express";
import Review from "../Models/Review";

// ✅ 1. เพิ่มรีวิวใหม่
export const addReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user?.userId;

    // 🔐 ป้องกันการรีวิวซ้ำ
    const existed = await Review.findOne({ productId, userId });
    if (existed) {
      res.status(400).json({ message: "คุณได้รีวิวสินค้าแล้ว" });
      return
    }

    const review = new Review({ productId, userId, rating, comment });
    await review.save();

    res.status(201).json({ message: "เพิ่มรีวิวสำเร็จ", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
};

// 🗑️ 2. ลบรีวิว (เฉพาะเจ้าของหรือแอดมิน)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user?.userId;

    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404).json({ message: "ไม่พบรีวิว" });
    return
    }

    if (review.userId.toString() !== userId) {
      res.status(403).json({ message: "คุณไม่มีสิทธิ์ลบรีวิวนี้" })
      return;
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "ลบรีวิวแล้ว" });
  } catch (err) {
    res.status(500).json({ message: "ลบรีวิวไม่สำเร็จ", error: err });
  }
};

// 🔍 3. ดึงรีวิวทั้งหมดของสินค้าตาม productId
export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name") // ดึงชื่อ user
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (err) {
    res.status(500).json({ message: "ไม่สามารถดึงรีวิวได้", error: err });
  }
};
