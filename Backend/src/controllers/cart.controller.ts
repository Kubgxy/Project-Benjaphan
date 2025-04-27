import { Request, Response } from "express";
import Cart from "../Models/Cart";
import Product from "../Models/Product";

// ✅ Add to cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { productId, quantity, size } = req.body;

  if (!userId || !productId || !quantity || !size) {
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
      size,
      images: product.images,
    };

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId && item.size === size
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


