import { Request, Response } from "express";

// import Wishlist from "../Models/Wishlist";
// import Product from "../Models/Product";

import Wishlist from "../Models_GPT/Wishlist";
import Product from "../Models_GPT/Product";
import User from "../Models_GPT/User";

export const addToWishlist = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { productId } = req.body;

  try {
    const productExists = await Product.findById(productId);
    if (!productExists) {
      res.status(404).json({ message: "❌ Product not found" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "❌ User not found" });
      return;
    }

    let wishlist = await Wishlist.findById(user.wishlistId);

    if (!wishlist) {
      // ✅ สร้าง wishlist ใหม่โดยใช้ _id ที่กำหนดไว้แล้ว
      wishlist = await Wishlist.create({
        _id: user.wishlistId,
        userId: user._id,
        products: [{ productId, dateAdded: new Date() }],
      });
    } else {
      // ✅ ถ้ามีอยู่แล้ว อัปเดตเฉย ๆ
      await Wishlist.findByIdAndUpdate(
        user.wishlistId,
        {
          $addToSet: {
            products: {
              productId,
              dateAdded: new Date(),
            },
          },
        },
        { new: true }
      );
    }

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
        $pull: { products: { productId: productId } },
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
    const wishlist = await Wishlist.findOne({ userId: userId })
      .populate({
        path: "products.productId",
        select: "name id_product images price availableSizes", // เลือก field ที่ frontend ต้องใช้
      })
      .lean()
      .exec();

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
