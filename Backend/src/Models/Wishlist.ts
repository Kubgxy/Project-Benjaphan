import { Schema, model, Document } from "mongoose";
import { IProduct } from "./Product";

export interface IWishlist extends Document {
  userID: string; // ⬅️ อ้างถึงผู้ใช้งาน
  products: IProduct[]; // ⬅️ เก็บทั้ง product object เต็ม ๆ
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userID: { type: String, required: true, unique: true },
    products: { type: [Object], default: [] }, // ✅ เก็บเป็น array of products
  },
  { collection: "Wishlist", timestamps: true }
);

const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);
export default Wishlist;
