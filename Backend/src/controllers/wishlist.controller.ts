import { Request, Response } from "express";

// import Wishlist from "../Models/Wishlist";
// import Product from "../Models/Product";

import Wishlist from "../Models_GPT/Wishlist";
import Product from "../Models_GPT/Product";

export const addToWishlist = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { productId } = req.body;
  console.log("รับมาเพิ่ม wishlist:", productId);

  try {
    const productExists = await Product.findById(productId);
    if (!productExists) {
      res.status(404).json({ message: "❌ Product not found" });
      return;
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      {
        $addToSet: {
          products: {
            productId: productId,
            dateAdded: new Date()
          }
        }
      },
      { upsert: true, new: true }
    ).populate("products.productId");

    res.status(200).json({ message: "✅ Added to wishlist", wishlist });
  } catch (error) {
    console.error("❌ Error adding to wishlist:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { productId } = req.body;

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      {
        $pull: { products: { productId: productId } }
      },
      { new: true }
    ).populate("products.productId");

    res.status(200).json({ message: "✅ Removed from wishlist", wishlist });
  } catch (error) {
    console.error("❌ Error removing from wishlist:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const wishlist = await Wishlist.findOne({ userId: userId }).populate("products.productId");

    if (!wishlist) {
      res.status(200).json({ wishlist: { products: [] } });
      return;
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("❌ Error fetching wishlist:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

