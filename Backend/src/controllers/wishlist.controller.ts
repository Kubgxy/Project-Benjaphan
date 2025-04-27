import { Request, Response } from "express";
import Wishlist from "../Models/Wishlist";
import Product from "../Models/Product";

// Whishlist //
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { productId } = req.body;
  
    try {
      // 1️⃣ ดึง product object มาเต็ม ๆ ก่อน
      const product = await Product.findOne({ id_product: productId }).lean();
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return 
      }
  
      // 2️⃣ เก็บทั้ง object ลงไปเลย
      const wishlist = await Wishlist.findOneAndUpdate(
        { userID: userId },
        { $addToSet: { products: product } },  // ⭐ เก็บทั้ง object ลง products
        { upsert: true, new: true }
      );
  
      res.status(200).json({ message: "Added to wishlist", wishlist });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  
  export const removeFromWishlist = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { productId } = req.body;
  
    try {
      const wishlist = await Wishlist.findOneAndUpdate(
        { userID: userId },
        { $pull: { products: productId } },
        { new: true }
      );
      res.status(200).json({ message: "Removed from wishlist", wishlist });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  export const getWishlist = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
  
    try {
      const wishlist = await Wishlist.findOne({ userID: userId }).populate(
        "products"
      );
      res.status(200).json({ wishlist: wishlist?.products || [] });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
