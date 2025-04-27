import { Request, Response } from "express";
import Wishlist from "../Models/Wishlist";
import Product from "../Models/Product";

export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId; // ⬅️ ได้จาก cookie-based auth
  const { productId } = req.body;

  try {
    const product = await Product.findOne({ id_product: productId }).lean();
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userID: userId },
      { $addToSet: { products: product } }, // ⬅️ เพิ่ม product เต็ม ๆ แบบไม่ซ้ำ
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { productId } = req.body;

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userID: userId },
      { $pull: { products: { id_product: productId } } },
      { new: true }
    );

    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  try {
    const wishlist = await Wishlist.findOne({ userID: userId });
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
