import { Request, Response, NextFunction } from "express";
import ProductRating from "../Models/ProductRating";

export const addRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId, rating } = req.body;
    const userId = req.user?.userId;
  
    if (!userId) {
      res.status(401).json({ message: "Please login before rating." });
      return;
    }
  
    try {
      // ✅ Check ว่า user นี้เคยให้คะแนน product นี้หรือยัง
      const existingRating = await ProductRating.findOne({ productId, userId });
  
      if (existingRating) {
        res.status(400).json({ message: "คุณได้ให้คะแนนสินค้านี้ไปแล้ว!" });
        return 
      }
  
      // ✅ ถ้ายังไม่เคย → ให้บันทึก
      await ProductRating.create({ productId, userId, rating });
      res.status(200).json({ message: "Rating saved successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error saving rating.", error });
    }
  };

// controller/review.controller.ts
export const getUserRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { productId } = req.params;
  
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
  
      const rating = await ProductRating.findOne({ productId, userId });
      if (!rating) {
        res.status(200).json({ rating: 0 });
        return;
      }
  
      res.status(200).json({ rating: rating.rating });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  
  
  

// 🟢 Function ดึงคะแนนเฉลี่ยของ Product ตาม productId
export const getAverageRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.params;
  
    try {
      const result = await ProductRating.aggregate([
        { $match: { productId } },                           // 🟠 filter ตาม productId
        {
          $group: {
            _id: "$productId",
            averageRating: { $avg: "$rating" },               // ✅ คำนวณค่าเฉลี่ย
            totalReviews: { $sum: 1 },                        // ✅ นับจำนวนรีวิวทั้งหมด
          },
        },
      ]);
  
      if (result.length === 0) {
        res.status(200).json({ averageRating: 0, totalReviews: 0 });
        return;
      }
  
      const { averageRating, totalReviews } = result[0];
      res.status(200).json({ averageRating, totalReviews });
    } catch (error) {
      res.status(500).json({ message: "Error fetching rating data.", error });
    }
  };
