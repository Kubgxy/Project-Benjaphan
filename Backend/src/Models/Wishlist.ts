// models/Wishlist.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
  userID: mongoose.Types.ObjectId;
  products: any[];  // 👈 เปลี่ยนตรงนี้!
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{}],  // 👈 เปลี่ยนตรงนี้! เก็บทั้ง object ได้เลย
  },
  { timestamps: true, collection: "Wishlist" }  // แก้ชื่อ collection ด้วยนะ!
);

export default mongoose.model<IWishlist>("Wishlist", WishlistSchema);
