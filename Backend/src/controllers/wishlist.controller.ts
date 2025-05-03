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
    // ✅ เช็คว่า product นี้มีอยู่จริงในฐานข้อมูล
    const productExists = await Product.findById(productId);
    if (!productExists) {
      res.status(404).json({ message: "❌ Product not found" });
      return
    }

    // ✅ เพิ่ม productId เข้า wishlist (ไม่ซ้ำ)
    const wishlist = await Wishlist.findOneAndUpdate(
      { userID: userId },
      { $addToSet: { products: productId } },
      { upsert: true, new: true }
    ).populate("products"); // 👉 ดึงรายละเอียด product มาด้วย

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

    const productDoc = await Product.findOne({ id_product: productId });
  if (!productDoc) {
    res.status(404).json({ message: 'Product not found' });
    return 
}
    // ✅ ลบ productId ออกจาก wishlist
    const wishlist = await Wishlist.findOneAndUpdate(
      { userID: userId },
      { $pull: { products: productDoc._id } },
      { new: true }
    ).populate("products");

    console.log('productId from req:', productId);
    console.log('fetched productDoc:', productDoc);


    res.status(200).json({ message: "✅ Removed from wishlist", wishlist });
  } catch (error) {
    console.error("❌ Error removing from wishlist:", error);
    res.status(500).json({ message: "Server error", error });
  }
  
};

export const getWishlist = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    // ✅ ดึง wishlist พร้อม populate ข้อมูลสินค้าเต็ม
    const wishlist = await Wishlist.findOne({ userID: userId }).populate("products");

    if (!wishlist) {
      res.status(200).json({ wishlist: { products: [] } }); // ส่ง array ว่างถ้าไม่มี
      return
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("❌ Error fetching wishlist:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
