import mongoose, { Schema, Document } from "mongoose";

export interface IProductRating extends Document {
  productId: string;
  rating: number; // ⭐ คะแนน 1-5
  createdAt: Date;
}

const ProductRatingSchema: Schema = new Schema(
  {
    productId: { type: String, required: true },
    userId: { type: String, required: true }, // 🟢 ต้องมี userId ตรงนี้!
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "ProductRatings" }
);

export default mongoose.model<IProductRating>(
  "ProductRating",
  ProductRatingSchema
);
