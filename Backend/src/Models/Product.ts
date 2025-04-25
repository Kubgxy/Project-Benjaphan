import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  id_product: string;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string[];
  images: string[];
  rating: number;
  reviews: number;
  isNewArrival: boolean; // Indicates if the product is new
  isBestseller: boolean;
  isOnSale: boolean;
  availableSizes: string[];
  stock: number;
}

const productSchema = new Schema<IProduct>(
  {
    id_product: { type: String, required: true, unique: true }, // ควร unique ป้องกัน id ซ้ำ
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    details: { type: [String], required: true , default: [] },
    images: { type: [String], required: true , default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    isNewArrival: { type: Boolean, default: false }, // Default value for new products
    isBestseller: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    availableSizes: { type: [String], default: [] },
    stock: { type: Number, required: true },
  },
  { collection: "Products", timestamps: true }
);

const Product = model<IProduct>("Product", productSchema);
export default Product;