import { Request, Response } from "express";
// import Cart from "../Models/Cart";
// import Product from "../Models/Product";

import Cart from "../Models_GPT/Cart"; // Model
import Product from "../Models_GPT/Product"; // Model

// ✅ Add to cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { productId, quantity , size} = req.body;

  if (!userId || !productId || !quantity ) {
    res.status(400).json({ message: "Missing required fields" });
    return; // ✅ return เฉย ๆ หยุดการทำงาน ไม่ return Response
  }

  try {
    const product = await Product.findOne({ id_product: productId });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return; // ✅ return เฉย ๆ หยุดการทำงาน ไม่ return Response
    }

    const cart = await Cart.findOne({ userID: userId });
    const newItem = {
      productId,
      name: product.name,
      price: product.price,
      quantity,
      size, // ✅ ใช้ size จาก req.body แทน
      images: product.images,
    };

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push(newItem);
      }

      await cart.save();
      res.status(200).json({ message: "Cart updated successfully", cart }); // ✅ ไม่ return
    } else {
      const newCart = new Cart({ userID: userId, items: [newItem] });
      await newCart.save();
      res
        .status(201)
        .json({ message: "Cart created successfully", cart: newCart }); // ✅ ไม่ return
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error }); // ✅ ไม่ return
  }
};

// ✅ Remove item from cart
export const removeCartItem = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { productId } = req.body;

  // 🔒 เช็คค่าที่จำเป็น
  if (!userId || !productId ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    // 🔍 หา cart ของผู้ใช้
    const cart = await Cart.findOne({ userID: userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // 🎯 กรองเอาสินค้าที่ไม่ตรงออก
    const newItems = cart.items.filter(
      (item) => !(item.productId === productId)
    );

    // 🔄 อัปเดตตะกร้า
    cart.items.splice(0, cart.items.length, ...newItems);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("❌ Error removing item from cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// controllers/cartController.ts
export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { productId, size, quantity } = req.body;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userID: userId, "items.productId": productId, "items.size": size },
      { $set: { "items.$.quantity": quantity } }, // 🎯 อัปเดต quantity ใน item ที่ match
      { new: true }
    );

    res.status(200).json({ message: "Cart updated", cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart", error });
  }
};

// ✅ Get cart For User
export const getCartUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId; // ✅ ดึง userId ให้ถูกต้องก่อนนะ

  try {
    const cart = await Cart.findOne({ userID: userId });
    if (!cart) {
      res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
      return; // ✅ ใช้ return ตรงนี้ได้ เพื่อหยุดการทำงานต่อ
    }

    res.status(200).json({ cart }); // ✅ ไม่ต้อง return res...
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all carts For Admin
export const getAllCarts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const carts = await Cart.find().populate(
      "userID",
      "firstName lastName email"
    );
    res.status(200).json({ carts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


